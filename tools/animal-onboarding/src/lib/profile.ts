import { access } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'

import { readJsonFile, repositoryRoot } from './files'

export type HeadSide = 'left' | 'right'
export type ProfileHabitat = 'land' | 'air' | 'water'
export type MouthMotionMode = 'disabled' | 'source-rig' | 'curated-components'

export interface ArchivedFile {
  readonly path: string
  readonly sha256: string
  readonly bytes: number
}

export type TextureBakeKind = 'scales' | 'stripes' | 'mottle'

export interface TextureBake {
  readonly patterns: Readonly<Record<string, TextureBakeKind>>
  readonly mainMaterial?: string | null
  readonly resolution?: 256 | 512 | 1024 | 2048
}

export interface MouthMotion {
  readonly mode: MouthMotionMode
  readonly reason: string | null
  readonly jawBone: string | null
  readonly tongueBones: readonly string[]
  readonly hinge: unknown
  readonly componentCount: number | null
  readonly vertexCount: number | null
  readonly softMaskCount: number | null
}

export interface ProfilePresentation {
  readonly initialYawDegrees: number
  readonly initialHeadSide: HeadSide
  readonly habitat: ProfileHabitat
  readonly shadow: 'ground' | 'none'
}

export interface ProfileLandmarks {
  readonly head: readonly [number, number, number]
  readonly tailTip: readonly [number, number, number]
  readonly contacts: ReadonlyArray<readonly [number, number, number]>
}

export interface NarrationLocaleProfile {
  readonly path: string
  readonly scriptPath: string
  readonly metricsPath: string
  readonly speaker: string
  readonly language: string
  readonly humanReviewStatus: 'pending' | 'approved'
}

export const APPROVAL_CATEGORIES = [
  'science',
  'anatomy',
  'materials',
  'background',
  'naturalMotion',
  'mouthComfort',
  'contentZhCN',
  'contentEn',
  'audioZhCN',
  'audioEn',
  'redistribution',
  'production',
] as const

export type ApprovalCategory = (typeof APPROVAL_CATEGORIES)[number]

export type HumanApprovals = Record<ApprovalCategory, boolean>

export interface CandidateProfile {
  readonly id: string
  readonly run: string
  readonly candidate: {
    readonly name: string
    readonly scientificName: string
    readonly sourcePage: string
    readonly downloadURL: string
    readonly author: string
    readonly license: string
    readonly licenseEvidence: string
    readonly accessDate: string
  }
  readonly archive: Readonly<Record<string, ArchivedFile>>
  readonly model: {
    readonly animated: boolean
    readonly sourceClip?: string | null
    readonly mouthMotion: MouthMotion
    readonly textureBake?: TextureBake
  }
  readonly presentation: ProfilePresentation
  readonly landmarks: ProfileLandmarks
  readonly narration: Readonly<Record<'zh-CN' | 'en', NarrationLocaleProfile>>
  readonly assets: { readonly posterPortraitPath?: string }
  readonly humanApprovals: HumanApprovals
  readonly outputHashes?: Readonly<Record<string, { sha256: string; bytes: number }>>
}

export interface LoadedProfile {
  readonly profile: CandidateProfile
  readonly profilePath: string
  readonly candidateDir: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isVec3(value: unknown): value is readonly [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((entry) => typeof entry === 'number' && Number.isFinite(entry))
  )
}

// Validates the parts of the profile schema the CLI gates rely on. Returns a
// list of problems; an empty list means the profile is usable.
export function validateProfileDocument(document: unknown): string[] {
  const problems: string[] = []
  if (!isRecord(document)) {
    return ['profile root must be an object']
  }
  if (typeof document.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.id)) {
    problems.push('id must be kebab-case')
  }
  if (typeof document.run !== 'string' || document.run.length === 0) {
    problems.push('run must be a non-empty string')
  }

  const presentation = document.presentation
  if (!isRecord(presentation)) {
    problems.push('presentation missing')
  } else {
    if (
      typeof presentation.initialYawDegrees !== 'number' ||
      !Number.isFinite(presentation.initialYawDegrees)
    ) {
      problems.push('presentation.initialYawDegrees must be a finite number')
    }
    if (presentation.initialHeadSide !== 'left' && presentation.initialHeadSide !== 'right') {
      problems.push("presentation.initialHeadSide must be 'left' or 'right'")
    }
    if (!['land', 'air', 'water'].includes(String(presentation.habitat))) {
      problems.push('presentation.habitat must be land | air | water')
    }
    if (presentation.shadow !== 'ground' && presentation.shadow !== 'none') {
      problems.push("presentation.shadow must be 'ground' or 'none'")
    }
  }

  const landmarks = document.landmarks
  if (!isRecord(landmarks)) {
    problems.push('landmarks missing')
  } else {
    if (!isVec3(landmarks.head)) {
      problems.push('landmarks.head must be a measured [x, y, z] triple')
    }
    if (!isVec3(landmarks.tailTip)) {
      problems.push('landmarks.tailTip must be a measured [x, y, z] triple')
    }
    if (!Array.isArray(landmarks.contacts) || !landmarks.contacts.every(isVec3)) {
      problems.push('landmarks.contacts must be an array of [x, y, z] triples')
    }
  }

  const mouth = isRecord(document.model) ? document.model.mouthMotion : undefined
  if (!isRecord(mouth)) {
    problems.push('model.mouthMotion missing')
  } else if (!['disabled', 'source-rig', 'curated-components'].includes(String(mouth.mode))) {
    problems.push('model.mouthMotion.mode must be disabled | source-rig | curated-components')
  }

  const textureBake = isRecord(document.model) ? document.model.textureBake : undefined
  if (textureBake !== undefined) {
    if (!isRecord(textureBake)) {
      problems.push('model.textureBake must be an object')
    } else {
      if (!isRecord(textureBake.patterns)) {
        problems.push('model.textureBake.patterns must be an object')
      } else {
        for (const [slot, kind] of Object.entries(textureBake.patterns)) {
          if (!['scales', 'stripes', 'mottle'].includes(String(kind))) {
            problems.push(`model.textureBake.patterns.${slot} must be scales | stripes | mottle`)
          }
        }
      }
      if (
        textureBake.resolution !== undefined &&
        ![256, 512, 1024, 2048].includes(Number(textureBake.resolution))
      ) {
        problems.push('model.textureBake.resolution must be 256 | 512 | 1024 | 2048')
      }
    }
  }

  const approvals = document.humanApprovals
  if (!isRecord(approvals)) {
    problems.push('humanApprovals missing')
  } else {
    for (const category of APPROVAL_CATEGORIES) {
      if (typeof approvals[category] !== 'boolean') {
        problems.push(`humanApprovals.${category} must be a boolean`)
      }
    }
  }

  const archive = document.archive
  if (!isRecord(archive) || Object.keys(archive).length === 0) {
    problems.push('archive must record at least one hashed file')
  } else {
    for (const [key, entry] of Object.entries(archive)) {
      if (
        !isRecord(entry) ||
        typeof entry.path !== 'string' ||
        typeof entry.sha256 !== 'string' ||
        !/^[a-f0-9]{64}$/.test(entry.sha256) ||
        typeof entry.bytes !== 'number'
      ) {
        problems.push(`archive.${key} must record path, sha256 and bytes`)
      }
    }
  }

  return problems.sort()
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

// Resolves and validates a profile argument. Throws with a message suitable
// for exit code 2 when the invocation or profile is invalid.
export async function loadProfile(profileArgument: string): Promise<LoadedProfile> {
  const profilePath = isAbsolute(profileArgument)
    ? profileArgument
    : join(repositoryRoot, profileArgument)
  let document: unknown
  try {
    document = await readJsonFile(profilePath)
  } catch (error) {
    throw new Error(`cannot read profile ${profileArgument}: ${String(error)}`)
  }
  const problems = validateProfileDocument(document)
  if (problems.length > 0) {
    throw new Error(
      `invalid profile ${profileArgument}:\n  ${problems.join('\n  ')}`,
    )
  }
  return {
    profile: document as CandidateProfile,
    profilePath,
    candidateDir: dirname(profilePath),
  }
}
