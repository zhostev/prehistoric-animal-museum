// Self-contained GLB inspection for the qa stage. The thresholds live here
// per the onboarding standard; scripts/content-validation.ts keeps its own
// production-oriented copy.

export const MODEL_TARGET_BYTES = 12 * 1024 * 1024
export const MODEL_CEILING_BYTES = 20 * 1024 * 1024
export const TRIANGLE_TARGET = 100_000
export const TRIANGLE_CEILING = 250_000
export const DRAW_CALL_TARGET = 12
export const DRAW_CALL_CEILING = 24
export const BONE_TARGET = 120
export const BONE_CEILING = 200

export const IDLE_CLIP_NAME = 'Idle'
export const IDLE_DURATION_SECONDS = 8
// Retimed Blender exports land exactly on 8 s; the tolerance only absorbs
// binary32 keyframe rounding at the last sample.
export const IDLE_DURATION_TOLERANCE_SECONDS = 0.01

export interface CandidateGlbInspection {
  readonly animationNames: readonly string[]
  readonly animationDurations: Readonly<Record<string, number>>
  readonly cubicSplineRotationTracks: number
  readonly externalUris: readonly string[]
  readonly triangles: number
  readonly drawCalls: number
  readonly bones: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function records(value: unknown): ReadonlyArray<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

export function inspectCandidateGlb(buffer: Buffer): CandidateGlbInspection {
  if (buffer.byteLength < 20 || buffer.toString('ascii', 0, 4) !== 'glTF') {
    throw new Error('not a GLB container')
  }
  const version = buffer.readUInt32LE(4)
  const declaredBytes = buffer.readUInt32LE(8)
  const jsonChunkBytes = buffer.readUInt32LE(12)
  const jsonChunkType = buffer.readUInt32LE(16)
  if (version !== 2) {
    throw new Error(`only glTF 2.0 is supported, found container version ${version}`)
  }
  if (declaredBytes !== buffer.byteLength) {
    throw new Error(
      `GLB declared length ${declaredBytes} != file length ${buffer.byteLength}`,
    )
  }
  if (jsonChunkType !== 0x4e4f534a || 20 + jsonChunkBytes > buffer.byteLength) {
    throw new Error('GLB is missing a valid JSON first chunk')
  }

  const parsed: unknown = JSON.parse(
    buffer.toString('utf8', 20, 20 + jsonChunkBytes),
  )
  if (!isRecord(parsed)) {
    throw new Error('GLB JSON root must be an object')
  }

  const accessors = records(parsed.accessors)
  const animations = records(parsed.animations)
  const animationNames: string[] = []
  const animationDurations: Record<string, number> = {}
  let cubicSplineRotationTracks = 0
  for (const animation of animations) {
    const name = readString(animation.name) ?? '<unnamed>'
    animationNames.push(name)
    let duration = 0
    const samplers = records(animation.samplers)
    for (const sampler of samplers) {
      const inputIndex = readNumber(sampler.input)
      const input = inputIndex === undefined ? undefined : accessors[inputIndex]
      const max = input === undefined ? undefined : readNumber(
        Array.isArray(input.max) ? input.max[0] : undefined,
      )
      if (max !== undefined) {
        duration = Math.max(duration, max)
      }
    }
    animationDurations[name] = duration

    for (const channel of records(animation.channels)) {
      const target = isRecord(channel.target) ? channel.target : {}
      const samplerIndex = readNumber(channel.sampler)
      const sampler =
        samplerIndex === undefined ? undefined : samplers[samplerIndex]
      if (
        readString(target.path) === 'rotation' &&
        sampler !== undefined &&
        readString(sampler.interpolation) === 'CUBICSPLINE'
      ) {
        cubicSplineRotationTracks += 1
      }
    }
  }

  const externalUris = [...records(parsed.buffers), ...records(parsed.images)]
    .map((entry) => readString(entry.uri))
    .filter(
      (uri): uri is string => uri !== undefined && !uri.startsWith('data:'),
    )

  let triangles = 0
  let drawCalls = 0
  for (const mesh of records(parsed.meshes)) {
    for (const primitive of records(mesh.primitives)) {
      drawCalls += 1
      const attributes = isRecord(primitive.attributes) ? primitive.attributes : {}
      const accessorIndex = readNumber(primitive.indices) ?? readNumber(attributes.POSITION)
      const accessor =
        accessorIndex === undefined ? undefined : accessors[accessorIndex]
      const elementCount =
        accessor === undefined ? undefined : readNumber(accessor.count)
      if (elementCount === undefined) {
        continue
      }
      const mode = readNumber(primitive.mode) ?? 4
      if (mode === 4) {
        triangles += Math.floor(elementCount / 3)
      } else if (mode === 5 || mode === 6) {
        triangles += Math.max(0, elementCount - 2)
      }
    }
  }

  const bones = records(parsed.skins).reduce(
    (maximum, skin) =>
      Math.max(maximum, Array.isArray(skin.joints) ? skin.joints.length : 0),
    0,
  )

  return {
    animationNames,
    animationDurations,
    cubicSplineRotationTracks,
    externalUris,
    triangles,
    drawCalls,
    bones,
  }
}

export interface BudgetEvaluation {
  readonly problems: readonly string[]
  readonly warnings: readonly string[]
}

// Hard ceilings fail the gate; targets between target and ceiling stay
// visible as warnings.
export function evaluateModelBudgets(
  bytes: number,
  inspection: CandidateGlbInspection,
): BudgetEvaluation {
  const checks = [
    ['model bytes', bytes, MODEL_TARGET_BYTES, MODEL_CEILING_BYTES],
    ['triangles', inspection.triangles, TRIANGLE_TARGET, TRIANGLE_CEILING],
    ['draw calls', inspection.drawCalls, DRAW_CALL_TARGET, DRAW_CALL_CEILING],
    ['bones', inspection.bones, BONE_TARGET, BONE_CEILING],
  ] as const
  const problems: string[] = []
  const warnings: string[] = []
  for (const [label, actual, target, ceiling] of checks) {
    if (actual > ceiling) {
      problems.push(`${label} ${actual} exceeds the ${ceiling} hard ceiling`)
    } else if (actual > target) {
      warnings.push(`${label} ${actual} exceeds the ${target} target`)
    }
  }
  return { problems, warnings }
}

// The Idle contract: exactly one animation, named Idle, exactly 8.0 s, and
// no CUBICSPLINE rotation tracks. A clip name alone never passes; the qa
// stage combines this with the motion-render pixel evidence.
export function evaluateIdleClip(
  inspection: CandidateGlbInspection,
  animated: boolean,
): string[] {
  const problems: string[] = []
  if (!animated) {
    if (inspection.animationNames.length > 0) {
      problems.push('profile declares animated=false but the GLB carries animations')
    }
    return problems
  }
  if (inspection.animationNames.length !== 1) {
    problems.push(
      `expected exactly one animation, found ${inspection.animationNames.length} (${inspection.animationNames.join(', ') || 'none'})`,
    )
    return problems
  }
  const name = inspection.animationNames[0] ?? ''
  if (name !== IDLE_CLIP_NAME) {
    problems.push(`the single clip must be named '${IDLE_CLIP_NAME}', found '${name}'`)
  }
  const duration = inspection.animationDurations[name]
  if (
    duration === undefined ||
    Math.abs(duration - IDLE_DURATION_SECONDS) > IDLE_DURATION_TOLERANCE_SECONDS
  ) {
    problems.push(
      `Idle duration must be ${IDLE_DURATION_SECONDS.toFixed(1)} s, found ${duration === undefined ? 'unknown' : duration.toFixed(4)} s`,
    )
  }
  if (inspection.cubicSplineRotationTracks > 0) {
    problems.push(
      `${inspection.cubicSplineRotationTracks} CUBICSPLINE rotation track(s) survive; LINEAR only`,
    )
  }
  return problems
}
