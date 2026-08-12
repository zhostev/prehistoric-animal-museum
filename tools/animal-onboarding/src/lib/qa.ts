import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { hashFile, writeJsonFile, type FileFingerprint } from './files'
import {
  evaluateIdleClip,
  evaluateModelBudgets,
  inspectCandidateGlb,
  type CandidateGlbInspection,
} from './glb'
import {
  pathExists,
  type HeadSide,
  type LoadedProfile,
  type MouthMotion,
  type ProfileLandmarks,
  type ProfilePresentation,
} from './profile'

export const HEAD_SIDE_MIN_SEPARATION = 0.35
export const MOTION_RENDER_MIN_RATIO = 0.01

export interface QaGate {
  readonly id: string
  readonly status: 'pass' | 'fail' | 'pending'
  readonly detail: string
}

export interface QaReport {
  readonly id: string
  readonly run: string
  readonly modelOnly: boolean
  readonly automatedPass: boolean
  readonly gates: readonly QaGate[]
  readonly model: {
    readonly bytes: number
    readonly sha256: string
    readonly inspection: CandidateGlbInspection
  } | null
  readonly warnings: readonly string[]
}

type Vec3 = readonly [number, number, number]

// Matches the runtime exactly: ViewerController sets
// modelRoot.rotation.y = degToRad(initialYawDegrees) (three.js right-handed
// rotation about +Y), and the fitted camera sits on +Z looking at the model,
// so projected +x lands on the viewer's RIGHT. Verified against the live
// review build on 2026-08-10 (candidate GLB, head toward glTF -Z, yaw -90
// rendered head-right).
export function rotateInitialYaw(point: Vec3, yawDegrees: number): Vec3 {
  const radians = (yawDegrees * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const [x, y, z] = point
  return [x * cos + z * sin, y, -x * sin + z * cos]
}

export interface HeadSideEvaluation {
  readonly ok: boolean
  readonly projectedSide: HeadSide
  readonly horizontalSeparation: number
  readonly problems: readonly string[]
}

// Projects the measured head/tailTip landmarks through the initial yaw and
// checks the declared head side plus a >=35% horizontal separation (anything
// below that reads as a near-frontal view).
export function evaluateHeadSideGate(
  landmarks: Pick<ProfileLandmarks, 'head' | 'tailTip'>,
  presentation: Pick<ProfilePresentation, 'initialYawDegrees' | 'initialHeadSide'>,
): HeadSideEvaluation {
  const head = rotateInitialYaw(landmarks.head, presentation.initialYawDegrees)
  const tail = rotateInitialYaw(landmarks.tailTip, presentation.initialYawDegrees)
  const bodyAxis = Math.hypot(
    landmarks.head[0] - landmarks.tailTip[0],
    landmarks.head[1] - landmarks.tailTip[1],
    landmarks.head[2] - landmarks.tailTip[2],
  )
  const horizontalSeparation =
    bodyAxis === 0 ? 0 : Math.abs(head[0] - tail[0]) / bodyAxis
  const projectedSide: HeadSide = head[0] < 0 ? 'left' : 'right'

  const problems: string[] = []
  if (projectedSide !== presentation.initialHeadSide) {
    problems.push(
      `head projects to the viewer's ${projectedSide} at yaw ${presentation.initialYawDegrees} but the profile declares ${presentation.initialHeadSide}`,
    )
  }
  if (horizontalSeparation < HEAD_SIDE_MIN_SEPARATION) {
    problems.push(
      `near-frontal projection: horizontal separation ${(horizontalSeparation * 100).toFixed(1)}% < ${HEAD_SIDE_MIN_SEPARATION * 100}%`,
    )
  }
  return { ok: problems.length === 0, projectedSide, horizontalSeparation, problems }
}

// Enabled mouth modes need Blender 0/4/8 s close-up evidence; this batch
// records none, so any enabled mode is a hard 'not evidenced' failure.
export function evaluateMouthMotion(mouth: MouthMotion): string[] {
  if (mouth.mode === 'disabled') {
    return typeof mouth.reason === 'string' && mouth.reason.trim().length > 0
      ? []
      : ["mouthMotion disabled without a recorded reason"]
  }
  return [
    `mouthMotion mode '${mouth.mode}' is enabled but not evidenced: this batch ships no Blender 0/4/8 s mouth close-ups`,
  ]
}

export interface MotionRenderEvidence {
  readonly pass: boolean
  readonly ratios: Readonly<Record<string, number>>
}

// Parses the normalization log's motion-render pixel-diff line. The 0s vs 8s
// pair is the loop seam (expected ~0); the mid-clip pairs must show >=1%
// changed pixels, and the Blender gate line must record PASS.
export function parseMotionRenderEvidence(logText: string): MotionRenderEvidence | null {
  const diffMatch = /motion render pixel diff[^\n]*:(.+)/.exec(logText)
  const gateMatch = /motion render pixel gate \([^\n]*\): (\w+)/.exec(logText)
  if (!diffMatch || !gateMatch) {
    return null
  }
  const ratios: Record<string, number> = {}
  const pairPattern = /(\w+) vs (\w+) = ([\d.]+)%/g
  let match = pairPattern.exec(diffMatch[1] ?? '')
  while (match) {
    ratios[`${match[1]} vs ${match[2]}`] = Number(match[3]) / 100
    match = pairPattern.exec(diffMatch[1] ?? '')
  }
  const midClipRatios = Object.entries(ratios)
    .filter(([pair]) => pair !== '0s vs 8s')
    .map(([, ratio]) => ratio)
  const pass =
    gateMatch[1] === 'PASS' &&
    midClipRatios.length > 0 &&
    midClipRatios.every((ratio) => ratio >= MOTION_RENDER_MIN_RATIO)
  return { pass, ratios }
}

async function hashOutputs(
  candidateDir: string,
  relativePaths: readonly string[],
): Promise<Record<string, FileFingerprint>> {
  const hashes: Record<string, FileFingerprint> = {}
  for (const relativePath of relativePaths) {
    const absolutePath = join(candidateDir, ...relativePath.split('/'))
    if (await pathExists(absolutePath)) {
      hashes[relativePath] = await hashFile(absolutePath)
    }
  }
  return hashes
}

function outputRelativePaths(loaded: LoadedProfile): string[] {
  const paths = [
    'output/model/model.glb',
    'blender/normalization.log',
  ]
  for (const locale of ['zh-CN', 'en'] as const) {
    const narration = loaded.profile.narration[locale]
    paths.push(narration.scriptPath, narration.path, narration.metricsPath)
  }
  if (loaded.profile.assets.posterPortraitPath) {
    paths.push(loaded.profile.assets.posterPortraitPath)
  }
  return paths
}

export const QA_REPORT_PATH = 'qa/qa-report.json'

export interface QaRunResult {
  readonly report: QaReport
  readonly exitCode: 0 | 1
}

export async function runQa(
  loaded: LoadedProfile,
  options: { readonly modelOnly: boolean; readonly autofix: boolean },
): Promise<QaRunResult> {
  const { profile, candidateDir } = loaded
  const gates: QaGate[] = []
  const warnings: string[] = []
  const gate = (id: string, problems: readonly string[], passDetail: string) => {
    if (problems.length === 0) {
      gates.push({ id, status: 'pass', detail: passDetail })
    } else {
      gates.push({ id, status: 'fail', detail: problems.join('; ') })
    }
    return problems.length === 0
  }

  // Archive integrity: every archived file must still match its recording.
  const archiveProblems: string[] = []
  for (const [key, entry] of Object.entries(profile.archive)) {
    const absolutePath = join(candidateDir, ...entry.path.split('/'))
    if (!(await pathExists(absolutePath))) {
      archiveProblems.push(`archive.${key} missing on disk: ${entry.path}`)
      continue
    }
    const actual = await hashFile(absolutePath)
    if (actual.sha256 !== entry.sha256 || actual.bytes !== entry.bytes) {
      archiveProblems.push(`archive.${key} hash/size drift: ${entry.path}`)
    }
  }
  gate(
    'archive-integrity',
    archiveProblems,
    `${Object.keys(profile.archive).length} archived file(s) match their recorded sha256`,
  )

  // GLB validity + budgets + Idle contract.
  const modelPath = join(candidateDir, 'output/model/model.glb')
  let inspection: CandidateGlbInspection | null = null
  let modelFingerprint: FileFingerprint | null = null
  if (!(await pathExists(modelPath))) {
    gates.push({ id: 'glb-validity', status: 'fail', detail: 'output/model/model.glb missing' })
  } else {
    const buffer = await readFile(modelPath)
    modelFingerprint = {
      sha256: (await hashFile(modelPath)).sha256,
      bytes: buffer.byteLength,
    }
    try {
      inspection = inspectCandidateGlb(buffer)
      gate(
        'glb-validity',
        inspection.externalUris.length > 0
          ? [`external URIs survive: ${inspection.externalUris.join(', ')}`]
          : [],
        `glTF 2.0, self-contained, ${buffer.byteLength} bytes`,
      )
      const budgets = evaluateModelBudgets(buffer.byteLength, inspection)
      warnings.push(...budgets.warnings)
      gate(
        'budgets',
        budgets.problems,
        `bytes ${buffer.byteLength}, triangles ${inspection.triangles}, draw calls ${inspection.drawCalls}, bones ${inspection.bones} within budgets`,
      )
      gate(
        'idle-clip',
        evaluateIdleClip(inspection, profile.model.animated),
        `exactly one 8.0 s Idle clip, ${inspection.cubicSplineRotationTracks} CUBICSPLINE rotation tracks`,
      )
    } catch (error) {
      gates.push({ id: 'glb-validity', status: 'fail', detail: String(error) })
    }
  }

  // Landmark projection through the initial yaw.
  const headSide = evaluateHeadSideGate(profile.landmarks, profile.presentation)
  gate(
    'head-side-projection',
    headSide.problems,
    `head projects to the viewer's ${headSide.projectedSide} at yaw ${profile.presentation.initialYawDegrees} with ${(headSide.horizontalSeparation * 100).toFixed(1)}% horizontal separation`,
  )
  const contactProblems =
    profile.presentation.habitat === 'land' && profile.landmarks.contacts.length === 0
      ? ['land animal without measured ground contacts']
      : []
  gate(
    'landmarks',
    contactProblems,
    `head, tailTip and ${profile.landmarks.contacts.length} contact(s) measured`,
  )

  // Motion-render pixel evidence from the normalization log.
  const logPath = join(candidateDir, 'blender/normalization.log')
  if (profile.model.animated) {
    if (!(await pathExists(logPath))) {
      gates.push({ id: 'motion-render-evidence', status: 'fail', detail: 'blender/normalization.log missing' })
    } else {
      const evidence = parseMotionRenderEvidence(await readFile(logPath, 'utf8'))
      if (evidence === null) {
        gates.push({
          id: 'motion-render-evidence',
          status: 'fail',
          detail: 'normalization log records no motion-render pixel-diff evidence',
        })
      } else {
        gate(
          'motion-render-evidence',
          evidence.pass ? [] : ['Blender motion-render pixel gate did not pass'],
          `motion renders change ${Object.entries(evidence.ratios)
            .map(([pair, ratio]) => `${pair}: ${(ratio * 100).toFixed(2)}%`)
            .join(', ')} of pixels`,
        )
      }
    }
  }

  gate(
    'mouth-motion',
    evaluateMouthMotion(profile.model.mouthMotion),
    `mouth motion disabled: ${profile.model.mouthMotion.reason ?? ''}`,
  )

  // Narration is reported, never faked: --model-only marks it pending.
  const narrationProblems: string[] = []
  const narrationPending: string[] = []
  for (const locale of ['zh-CN', 'en'] as const) {
    const narration = profile.narration[locale]
    const mp3Path = join(candidateDir, ...narration.path.split('/'))
    const scriptPath = join(candidateDir, ...narration.scriptPath.split('/'))
    if (!(await pathExists(scriptPath))) {
      narrationProblems.push(`${locale} narration script missing: ${narration.scriptPath}`)
    }
    if (narration.speaker !== 'Serena') {
      narrationProblems.push(`${locale} narration speaker must be Serena`)
    }
    if (!(await pathExists(mp3Path))) {
      narrationPending.push(`${locale} MP3 not generated yet (${narration.path})`)
    }
  }
  if (options.modelOnly) {
    gates.push({
      id: 'narration',
      status: 'pending',
      detail: ['--model-only: audio gates deferred', ...narrationPending].join('; '),
    })
  } else {
    gate(
      'narration',
      [...narrationProblems, ...narrationPending],
      'both narration MP3s present with pinned voice metadata',
    )
  }

  // Recorded output hashes: --autofix refreshes them; otherwise drift fails.
  const relativeOutputs = outputRelativePaths(loaded)
  const currentOutputs = await hashOutputs(candidateDir, relativeOutputs)
  if (options.autofix || profile.outputHashes === undefined) {
    if (options.autofix) {
      gates.push({
        id: 'output-hashes',
        status: 'pass',
        detail: `recorded ${Object.keys(currentOutputs).length} output hash(es) into the profile`,
      })
    } else {
      gates.push({
        id: 'output-hashes',
        status: 'pending',
        detail: 'no recorded output hashes yet; rerun with --autofix to pin them',
      })
    }
  } else {
    const drift: string[] = []
    for (const [relativePath, recorded] of Object.entries(profile.outputHashes)) {
      const current = currentOutputs[relativePath]
      if (!current) {
        drift.push(`recorded output now missing: ${relativePath}`)
      } else if (current.sha256 !== recorded.sha256 || current.bytes !== recorded.bytes) {
        drift.push(`recorded output changed: ${relativePath}`)
      }
    }
    for (const relativePath of Object.keys(currentOutputs)) {
      if (!(relativePath in profile.outputHashes)) {
        drift.push(`new unrecorded output: ${relativePath}`)
      }
    }
    gate(
      'output-hashes',
      drift,
      `${Object.keys(currentOutputs).length} recorded output hash(es) still match`,
    )
  }

  const automatedPass = gates.every((entry) => entry.status !== 'fail')
  const report: QaReport = {
    id: profile.id,
    run: profile.run,
    modelOnly: options.modelOnly,
    automatedPass,
    gates,
    model:
      inspection && modelFingerprint
        ? {
            bytes: modelFingerprint.bytes,
            sha256: modelFingerprint.sha256,
            inspection,
          }
        : null,
    warnings,
  }

  await writeJsonFile(join(candidateDir, QA_REPORT_PATH), report)

  if (options.autofix) {
    await writeJsonFile(loaded.profilePath, {
      ...profile,
      outputHashes: currentOutputs,
    })
    // Keep the registered draft manifest in sync when the draft is already on
    // the local-review allowlist. Blender output itself is never regenerated.
    const { ensureBackgrounds, writeReviewManifest, REVIEW_MANIFEST_PATH } =
      await import('./review-prepare')
    if (await pathExists(join(candidateDir, REVIEW_MANIFEST_PATH))) {
      const background = await ensureBackgrounds(loaded)
      await writeReviewManifest(
        loaded,
        {
          zhCN: await pathExists(
            join(candidateDir, ...profile.narration['zh-CN'].path.split('/')),
          ),
          en: await pathExists(
            join(candidateDir, ...profile.narration.en.path.split('/')),
          ),
        },
        background,
      )
    }
  }

  return { report, exitCode: automatedPass ? 0 : 1 }
}
