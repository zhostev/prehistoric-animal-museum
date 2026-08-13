import { execFile } from 'node:child_process'
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import { promisify } from 'node:util'
import { dirname, join } from 'node:path'

import type {
  AssetProvenance,
  AssetSource,
} from '../../../../src/content/types'
import { APPROVAL_RECORD_FILE, type ApprovalRecord } from './approvals'
import { captureBaseline, ORIGINAL_12_IDS } from './baseline'
import { COMPOSITION_REPORT_PATH } from './composition'
import {
  hashFile,
  readJsonFile,
  repositoryRoot,
  writeJsonFile,
  type FileFingerprint,
} from './files'
import { hashDirectory } from './files'
import {
  APPROVAL_CATEGORIES,
  pathExists,
  type CandidateProfile,
  type LoadedProfile,
} from './profile'
import { QA_REPORT_PATH, type QaReport } from './qa'
import { checkReviewManifestCurrent } from './review-prepare'
import type { CompositionReport } from './composition'

const execFileAsync = promisify(execFile)

const COLLECTION_PATH = join(repositoryRoot, 'src/content/collections/main.ts')

// Files the post-steps regenerate; rollback must restore them alongside the
// collection so a failed batch leaves the tree byte-identical.
const POST_STEP_SNAPSHOT_PATHS = [
  'src/content/credits.generated.ts',
  'THIRD_PARTY_NOTICES.md',
  'tools/animal-onboarding/baseline.json',
] as const

export interface PromotionFileOp {
  readonly animalId: string
  readonly source: string
  readonly target: string
  readonly status: 'ready' | 'generate' | 'missing'
}

export interface PromotionPlan {
  readonly ops: readonly PromotionFileOp[]
  readonly collectionAppend: readonly string[]
  readonly postSteps: readonly ['generate:credits', 'validate:content']
}

// Pure staging-plan builder. Non-catalog files always install before the
// catalog-facing animal.ts, which is the last op of each animal; the
// collection append happens exactly once after every animal. Exported for
// unit tests.
export function buildPromotionPlan(
  profiles: ReadonlyArray<Pick<LoadedProfile, 'profile'>>,
  existingOutputs: Readonly<Record<string, readonly string[]>> = {},
): PromotionPlan {
  const ops: PromotionFileOp[] = []
  for (const { profile } of profiles) {
    const id = profile.id
    const sourceRoot = `assets/candidates/${profile.run}/${id}`
    const targetRoot = `src/content/animals/${id}`
    const existing = new Set(existingOutputs[id] ?? [])
    const op = (
      source: string,
      target: string,
      generated = false,
    ): PromotionFileOp => ({
      animalId: id,
      source,
      target,
      status: generated
        ? 'generate'
        : existing.has(target.slice(targetRoot.length + 1))
          ? 'ready'
          : 'missing',
    })

    ops.push(
      op(`${sourceRoot}/output/model/model.glb`, `${targetRoot}/model/model.glb`),
      op(`${sourceRoot}/output/poster.webp`, `${targetRoot}/images/poster.webp`),
      op(
        `${sourceRoot}/output/images/poster-portrait.webp`,
        `${targetRoot}/images/poster-portrait.webp`,
      ),
      op(`${sourceRoot}/output/thumbnail.webp`, `${targetRoot}/images/thumbnail.webp`),
      op(
        `${sourceRoot}/output/background-landscape.webp`,
        `${targetRoot}/backgrounds/landscape.webp`,
      ),
      op(
        `${sourceRoot}/output/background-portrait.webp`,
        `${targetRoot}/backgrounds/portrait.webp`,
      ),
      op(
        `${sourceRoot}/${profile.narration['zh-CN'].path}`,
        `${targetRoot}/audio/narration.zh-CN.mp3`,
      ),
      op(
        `${sourceRoot}/${profile.narration.en.path}`,
        `${targetRoot}/audio/narration.en.mp3`,
      ),
      op(
        `${sourceRoot}/content/content.zh-CN.ts`,
        `${targetRoot}/content.zh-CN.ts`,
      ),
      op(`${sourceRoot}/content/content.en.ts`, `${targetRoot}/content.en.ts`),
      op('<generated from profile + qa evidence>', `${targetRoot}/provenance.ts`, true),
      op('<generated from the approved draft package>', `${targetRoot}/package.ts`, true),
      // The catalog-facing module installs last, per the promotion contract.
      op('<generated catalog entry>', `${targetRoot}/animal.ts`, true),
    )
  }
  return {
    ops,
    collectionAppend: profiles.map(({ profile }) => profile.id),
    postSteps: ['generate:credits', 'validate:content'],
  }
}

export interface PromotionValidation {
  readonly id: string
  readonly deterministicProblems: readonly string[]
  readonly pendingHuman: readonly string[]
  readonly plan: PromotionPlan
}

async function readReport<T>(candidateDir: string, relativePath: string): Promise<T | null> {
  const reportPath = join(candidateDir, ...relativePath.split('/'))
  if (!(await pathExists(reportPath))) {
    return null
  }
  return (await readJsonFile(reportPath)) as T
}

// The complete pre-promotion validation for one draft. Deterministic gate
// failures are exit-1 class; missing media or absent owner approvals are the
// exit-3 class.
export async function validateForPromotion(
  loaded: LoadedProfile,
): Promise<PromotionValidation> {
  const { profile, candidateDir } = loaded
  const deterministicProblems: string[] = []
  const pendingHuman: string[] = []

  const qa = await readReport<QaReport>(candidateDir, QA_REPORT_PATH)
  if (qa === null) {
    deterministicProblems.push('qa report missing; run qa <profile> --model-only --autofix')
  } else if (!qa.automatedPass) {
    deterministicProblems.push('qa report has failing gates')
  }

  const composition = await readReport<CompositionReport>(candidateDir, COMPOSITION_REPORT_PATH)
  if (composition === null) {
    deterministicProblems.push('composition report missing; run composition <profile>')
  } else if (!composition.automatedPass) {
    deterministicProblems.push('composition report has failing gates')
  }

  const manifest = await checkReviewManifestCurrent(loaded)
  if (!manifest.current) {
    deterministicProblems.push(...manifest.problems)
  }

  const existingOutputs: string[] = []
  const requiredMedia: Array<readonly [string, string]> = [
    ['output/model/model.glb', 'model'],
    ['output/poster.webp', 'poster'],
    ['output/images/poster-portrait.webp', 'portrait poster'],
    ['output/thumbnail.webp', 'thumbnail'],
    ['output/background-landscape.webp', 'landscape background'],
    ['output/background-portrait.webp', 'portrait background'],
    [profile.narration['zh-CN'].path, 'zh-CN narration MP3'],
    [profile.narration.en.path, 'en narration MP3'],
  ]
  const targetBySource: Record<string, string> = {
    'output/model/model.glb': 'model/model.glb',
    'output/poster.webp': 'images/poster.webp',
    'output/images/poster-portrait.webp': 'images/poster-portrait.webp',
    'output/thumbnail.webp': 'images/thumbnail.webp',
    'output/background-landscape.webp': 'backgrounds/landscape.webp',
    'output/background-portrait.webp': 'backgrounds/portrait.webp',
    [profile.narration['zh-CN'].path]: 'audio/narration.zh-CN.mp3',
    [profile.narration.en.path]: 'audio/narration.en.mp3',
    'content/content.zh-CN.ts': 'content.zh-CN.ts',
    'content/content.en.ts': 'content.en.ts',
  }
  for (const [relativePath, label] of requiredMedia) {
    const absolutePath = join(candidateDir, ...relativePath.split('/'))
    if (await pathExists(absolutePath)) {
      existingOutputs.push(targetBySource[relativePath] ?? relativePath)
    } else {
      pendingHuman.push(`${label} not generated yet (${relativePath})`)
    }
  }
  for (const content of ['content/content.zh-CN.ts', 'content/content.en.ts']) {
    if (await pathExists(join(candidateDir, ...content.split('/')))) {
      existingOutputs.push(targetBySource[content] ?? content)
    }
  }

  for (const category of APPROVAL_CATEGORIES) {
    if (!profile.humanApprovals[category]) {
      pendingHuman.push(`humanApprovals.${category} is false`)
    }
  }

  return {
    id: profile.id,
    deterministicProblems,
    pendingHuman,
    plan: buildPromotionPlan([loaded], { [profile.id]: existingOutputs }),
  }
}

function generateAnimalModule(): string {
  return `import narrationEnUrl from './audio/narration.en.mp3'
import narrationZhCNUrl from './audio/narration.zh-CN.mp3'
import landscapeUrl from './backgrounds/landscape.webp'
import portraitUrl from './backgrounds/portrait.webp'
import posterUrl from './images/poster.webp'
import posterPortraitUrl from './images/poster-portrait.webp'
import thumbnailUrl from './images/thumbnail.webp'
import modelUrl from './model/model.glb?url'

import { createRuntimeAnimal } from '../../create-runtime-animal'
import { animalDefinition } from './package'

export const animal = createRuntimeAnimal(animalDefinition, {
  backgroundLandscape: landscapeUrl,
  backgroundPortrait: portraitUrl,
  model: modelUrl,
  narration: {
    'zh-CN': narrationZhCNUrl,
    en: narrationEnUrl,
  },
  poster: posterUrl,
  posterPortrait: posterPortraitUrl,
  thumbnail: thumbnailUrl,
})
`
}

function generatePackageModule(
  profile: CandidateProfile,
  yawDegrees: number,
): string {
  const shadow = profile.presentation.shadow
  return `import { definePublishedAnimal } from '../../types'
import { en } from './content.en'
import { zhCN } from './content.zh-CN'
import { provenance } from './provenance'

export const animalDefinition = definePublishedAnimal({
  id: '${profile.id}',
  status: 'published',
  kind: '${profile.presentation.habitat === 'water' ? 'other-prehistoric-animal' : 'dinosaur'}',
  habitat: '${profile.presentation.habitat}',
  atmosphere: '${profile.presentation.habitat === 'water' ? 'underwater' : profile.presentation.habitat === 'air' ? 'air' : 'plains'}',
  content: { 'zh-CN': zhCN, en },
  presentation: {
    initialYawDegrees: ${yawDegrees},
    safeAreaPadding: 0.12,
    preciseBounds: true,
    shadow: '${shadow}',${shadow === 'ground' ? '\n    shadowOpacity: 0.5,\n    shadowScale: 0.5,' : ''}
  },
  animation: {
    clip: 'Idle',
    loop: 'repeat',
    speed: 1,
  },
  narration: {
    'zh-CN': {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
      speaker: 'Serena',
      language: 'Chinese',
      humanReviewStatus: 'approved',
    },
    en: {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
      speaker: 'Serena',
      language: 'English',
      humanReviewStatus: 'approved',
    },
  },
  provenance,
})
`
}

export interface DerivativesImageRecord extends FileFingerprint {
  readonly width: number
  readonly height: number
}

export interface DerivativesLogSummary {
  readonly blender: {
    readonly version: string
    readonly seed: number
    readonly specPath: string
    readonly specSha256: string
  }
  readonly webpSettings: {
    readonly quality: number
  }
  readonly backgrounds: {
    readonly landscape: DerivativesImageRecord
    readonly portrait: DerivativesImageRecord
  }
  readonly posters: {
    readonly landscape: DerivativesImageRecord
    readonly portrait: DerivativesImageRecord
    readonly thumbnail: DerivativesImageRecord
  }
}

export interface NarrationMetricsSummary {
  readonly model: {
    readonly repoId: string
    readonly revision: string
  }
  readonly speaker: string
  readonly generatedAt: string
  readonly mp3: FileFingerprint
}

export interface PromotionProvenanceInput {
  readonly profile: CandidateProfile
  readonly stagedFiles: Readonly<Record<string, FileFingerprint>>
  readonly scripts: Readonly<Record<'zh-CN' | 'en', string>>
  readonly normalizationLog: string
  readonly derivativesLog: DerivativesLogSummary
  readonly narrationMetrics: Readonly<
    Record<'zh-CN' | 'en', NarrationMetricsSummary>
  >
  readonly sceneSpec: FileFingerprint
  readonly approval: {
    readonly approvedBy: string
    readonly approvedOn: string
  }
}

export interface PromotionProvenanceBundle {
  readonly records: readonly AssetProvenance[]
  readonly evidenceFiles: Readonly<Record<string, string>>
}

// Extracts the two narration sentences from a candidate content module. The
// zh-CN module is emitted as JSON, the en module as a single-quoted TS
// literal; both quote styles are accepted so the generated provenance binds
// exactly the sentences the production validator recomputes.
export function extractNarrationSentences(
  contentModuleText: string,
): readonly [string, string] {
  const keyMatch = /"?sentences"?\s*:/.exec(contentModuleText)
  if (keyMatch === null) {
    throw new Error('content module declares no narration sentences')
  }
  const rest = contentModuleText.slice(keyMatch.index + keyMatch[0].length)
  const literalPattern = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g
  const first = literalPattern.exec(rest)
  const second = first === null ? null : literalPattern.exec(rest)
  if (first === null || second === null) {
    throw new Error('narration sentences must be two string literals')
  }
  const decode = (match: RegExpExecArray): string => {
    if (match[1] !== undefined) {
      return JSON.parse(`"${match[1]}"`) as string
    }
    return (match[2] ?? '').replace(/\\(['\\])/g, '$1')
  }
  return [decode(first), decode(second)]
}

// The validator recomputes the script as the two sentences joined with ''
// for zh-CN and ' ' for en; the recorded prompt must match after NFKC and
// whitespace normalisation.
export function joinNarrationScript(
  locale: 'zh-CN' | 'en',
  sentences: readonly [string, string],
): string {
  return sentences.join(locale === 'zh-CN' ? '' : ' ')
}

// Turns the Blender normalization log into the published model modification
// narrative: pipeline, retime/synthesis, orientation, scale, grounding and
// mouth decision lines, plus a count of dropped source clips.
export function summarizeNormalizationLog(
  log: string,
): readonly [string, ...string[]] {
  const includePatterns = [
    /^pipeline: /,
    /^action '.+' \(.+\) resampled to 'Idle': /,
    /^Idle synthesized: /,
    /^decimate: /,
    /^shading: /,
    /^materials authored /,
    /^armature synthesized: /,
    /source faces Blender .+-> head now toward \+Y/,
    /^scale: /,
    /^grounding \(land\): /,
    /^centring \(water\): /,
    /^mouth motion stays DISABLED/,
  ]
  const picked: string[] = []
  let removedClips = 0
  for (const line of log.split('\n')) {
    const trimmed = line.trim()
    if (/^removed source clip /.test(trimmed)) {
      removedClips += 1
      continue
    }
    if (includePatterns.some((pattern) => pattern.test(trimmed))) {
      picked.push(trimmed)
    }
  }
  if (removedClips > 0) {
    picked.push(
      `Removed ${removedClips} unused source clips after retiming the Idle take.`,
    )
  }
  if (picked.length === 0) {
    picked.push(
      'Normalized orientation, scale and grounding; retimed to one closed eight-second LINEAR Idle.',
    )
  }
  return picked as [string, ...string[]]
}

function requireFingerprint(
  stagedFiles: Readonly<Record<string, FileFingerprint>>,
  target: string,
): FileFingerprint {
  const fingerprint = stagedFiles[target]
  if (fingerprint === undefined) {
    throw new Error(`staged fingerprint missing for ${target}`)
  }
  return fingerprint
}

function assertFingerprint(
  label: string,
  actual: FileFingerprint,
  expected: FileFingerprint,
): void {
  if (actual.sha256 !== expected.sha256 || actual.bytes !== expected.bytes) {
    throw new Error(
      `${label} fingerprint drift: staged ${actual.sha256}/${actual.bytes} B vs recorded ${expected.sha256}/${expected.bytes} B`,
    )
  }
}

const modelEvidencePaths = [
  'provenance/LICENSES/model-license.txt',
  'provenance/LICENSES/model-source.txt',
] as const

function licenseFor(spdx: string): {
  readonly spdx: string
  readonly name: string
  readonly url: string
} {
  if (spdx === 'CC0-1.0') {
    return {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    }
  }
  if (spdx === 'CC-BY-4.0') {
    return {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    }
  }
  if (spdx === 'CC-BY-NC-SA-4.0') {
    return {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    }
  }
  throw new Error(`unsupported candidate license ${spdx}`)
}

const generatedSceneLicense = {
  spdx: 'CC-BY-NC-SA-4.0',
  name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
} as const

const qwenOutputLicense = {
  spdx: 'CC-BY-NC-SA-4.0',
  name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
} as const

// Builds the complete, self-contained 8-record provenance set plus the five
// LICENSES evidence text files for one staged package. Pure: every value is
// derived from the candidate evidence passed in. Exported for unit tests.
export function buildPromotionProvenance(
  input: PromotionProvenanceInput,
): PromotionProvenanceBundle {
  const { profile, stagedFiles } = input
  const name = profile.candidate.name
  const source = profile.archive.sourceDownload
  if (source === undefined) {
    throw new Error(`${profile.id}: archive.sourceDownload missing`)
  }
  const modelLicense = licenseFor(profile.candidate.license)
  const modelAttribution = `“${name}” by ${profile.candidate.author}, ${profile.candidate.license}; modified for the Prehistoric Animal Museum.`
  const generatedOn = input.approval.approvedOn
  const projectAuthored = !profile.candidate.sourcePage.startsWith('https://')
  if (
    projectAuthored &&
    !profile.candidate.author.toLowerCase().includes('project-authored')
  ) {
    throw new Error(
      `${profile.id}: non-HTTPS model source is allowed only for an explicitly project-authored candidate`,
    )
  }

  const runtimeModel = requireFingerprint(stagedFiles, 'model/model.glb')
  const runtimeLandscape = requireFingerprint(stagedFiles, 'backgrounds/landscape.webp')
  const runtimePortrait = requireFingerprint(stagedFiles, 'backgrounds/portrait.webp')
  const runtimePoster = requireFingerprint(stagedFiles, 'images/poster.webp')
  const runtimePosterPortrait = requireFingerprint(stagedFiles, 'images/poster-portrait.webp')
  const runtimeThumbnail = requireFingerprint(stagedFiles, 'images/thumbnail.webp')
  const runtimeNarrationZh = requireFingerprint(stagedFiles, 'audio/narration.zh-CN.mp3')
  const runtimeNarrationEn = requireFingerprint(stagedFiles, 'audio/narration.en.mp3')

  const { derivativesLog } = input
  assertFingerprint('landscape background', runtimeLandscape, derivativesLog.backgrounds.landscape)
  assertFingerprint('portrait background', runtimePortrait, derivativesLog.backgrounds.portrait)
  assertFingerprint('poster', runtimePoster, derivativesLog.posters.landscape)
  assertFingerprint('portrait poster', runtimePosterPortrait, derivativesLog.posters.portrait)
  assertFingerprint('thumbnail', runtimeThumbnail, derivativesLog.posters.thumbnail)
  if (input.sceneSpec.sha256 !== derivativesLog.blender.specSha256) {
    throw new Error(
      `scene spec drift: ${input.sceneSpec.sha256} vs recorded ${derivativesLog.blender.specSha256}`,
    )
  }

  const blenderVersion = derivativesLog.blender.version.split(' ')[0] ?? derivativesLog.blender.version
  const sceneTool = `Blender ${blenderVersion} (project-authored habitat scene, deterministic seed)`
  const scenePrompt =
    `Deterministic project-authored Blender habitat scene; scene spec ${derivativesLog.blender.specPath} ` +
    `(SHA-256 ${derivativesLog.blender.specSha256}) rendered with seed ${derivativesLog.blender.seed} ` +
    `for the ${profile.presentation.habitat} habitat.`

  const modifications = summarizeNormalizationLog(input.normalizationLog)

  const modelSource: AssetSource = projectAuthored
    ? {
        type: 'generated',
        title: `${name} deterministic procedural model source`,
        tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
        generatedOn,
        prompt:
          'Project-authored procedural model generated from the archived Blender Python generator; ' +
          'the retained generator script is the reproducible source.',
        sha256: source.sha256,
        bytes: source.bytes,
      }
    : {
        type: 'third-party',
        title: name,
        author: profile.candidate.author,
        url: profile.candidate.sourcePage as `https://${string}`,
        accessedOn: profile.candidate.accessDate,
        sha256: source.sha256,
        bytes: source.bytes,
      }

  const narrationRecords: AssetProvenance[] = (
    ['zh-CN', 'en'] as const
  ).map((locale) => {
    const metrics = input.narrationMetrics[locale]
    const runtime = locale === 'zh-CN' ? runtimeNarrationZh : runtimeNarrationEn
    assertFingerprint(`${locale} narration`, runtime, metrics.mp3)
    if (metrics.speaker !== 'Serena') {
      throw new Error(`${profile.id}: ${locale} narration speaker is not Serena`)
    }
    if (!metrics.model.repoId.includes('Qwen3-TTS')) {
      throw new Error(
        `${profile.id}: ${locale} narration model is not Qwen3-TTS`,
      )
    }
    const language = locale === 'zh-CN' ? 'Mandarin' : 'English'
    return {
      assetPath: `audio/narration.${locale}.mp3`,
      kind: 'narration',
      source: {
        type: 'generated',
        title: `${name} ${language} narration`,
        tool: 'Qwen3-TTS CustomVoice',
        model: metrics.model.repoId,
        revision: `${metrics.model.revision}; Serena built-in voice; deterministic local generation`,
        generatedOn: metrics.generatedAt.slice(0, 10),
        prompt: input.scripts[locale],
        sha256: metrics.mp3.sha256,
        bytes: metrics.mp3.bytes,
      },
      license: qwenOutputLicense,
      runtime,
      modifications: [
        'Generated offline from the exact reviewed two-sentence script.',
        'Normalized to a reviewed 48 kHz mono MP3 without runtime synthesis.',
      ],
      attribution: `Project-generated ${language} narration produced locally with Qwen3-TTS 0.6B CustomVoice (Serena).`,
      redistributionAllowed: true,
      evidencePaths: ['provenance/LICENSES/narration-rights.txt'],
    } as AssetProvenance
  })

  const backgroundRecord = (
    orientation: 'landscape' | 'portrait',
    runtime: FileFingerprint,
  ): AssetProvenance => ({
    assetPath: `backgrounds/${orientation}.webp`,
    kind: 'background',
    source: {
      type: 'generated',
      title: `${name} habitat scene — ${orientation}`,
      tool: sceneTool,
      generatedOn,
      prompt: scenePrompt,
      sha256: input.sceneSpec.sha256,
      bytes: input.sceneSpec.bytes,
    },
    license: generatedSceneLicense,
    runtime,
    modifications: [
      `Rendered the ${orientation} pass deterministically from the project-authored habitat scene spec with EEVEE Next.`,
      `Encoded as lossy WebP at quality ${derivativesLog.webpSettings.quality} without text, logos, UI, or watermarks.`,
    ],
    attribution: `Project-generated ${name} ${orientation} habitat background rendered by the Prehistoric Animal Museum Blender pipeline.`,
    redistributionAllowed: true,
    evidencePaths: ['provenance/LICENSES/background-generation.txt'],
  })

  const records: AssetProvenance[] = [
    {
      assetPath: 'model/model.glb',
      kind: 'model',
      source: modelSource,
      license: modelLicense,
      runtime: runtimeModel,
      modifications,
      attribution: modelAttribution,
      redistributionAllowed: true,
      evidencePaths: [...modelEvidencePaths],
    } as AssetProvenance,
    backgroundRecord('landscape', runtimeLandscape),
    backgroundRecord('portrait', runtimePortrait),
    {
      assetPath: 'images/poster.webp',
      kind: 'poster',
      source: {
        type: 'derived',
        title: `${name} transparent model still`,
        generatedOn,
        inputAssetPaths: ['model/model.glb'],
        method:
          'Rendered the deterministic first animation frame at the normal 1200 × 675 landscape runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
      },
      license: modelLicense,
      runtime: runtimePoster,
      modifications: [
        'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
        'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
      ],
      attribution: modelAttribution,
      redistributionAllowed: true,
      evidencePaths: [
        ...modelEvidencePaths,
        'provenance/LICENSES/derived-images.txt',
      ],
    } as AssetProvenance,
    {
      assetPath: 'images/poster-portrait.webp',
      kind: 'poster',
      source: {
        type: 'derived',
        title: `${name} transparent portrait model still`,
        generatedOn,
        inputAssetPaths: ['model/model.glb'],
        method:
          'Rendered the deterministic first animation frame at the normal 390 × 844 portrait runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
      },
      license: modelLicense,
      runtime: runtimePosterPortrait,
      modifications: [
        'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
        'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
      ],
      attribution: modelAttribution,
      redistributionAllowed: true,
      evidencePaths: [
        ...modelEvidencePaths,
        'provenance/LICENSES/derived-images.txt',
      ],
    } as AssetProvenance,
    {
      assetPath: 'images/thumbnail.webp',
      kind: 'thumbnail',
      source: {
        type: 'derived',
        title: `${name} collection thumbnail`,
        generatedOn,
        inputAssetPaths: ['model/model.glb', 'backgrounds/landscape.webp'],
        method:
          'Deterministic square crop from the accepted desktop review presentation after hiding all interface chrome.',
      },
      license: modelLicense,
      runtime: runtimeThumbnail,
      modifications: [
        'Selected a card-size crop that keeps the animal readable.',
        'Exported without embedded text, controls, labels, logos, or watermarks.',
      ],
      attribution: `${modelAttribution} Scene art generated for this project.`,
      redistributionAllowed: true,
      evidencePaths: [
        ...modelEvidencePaths,
        'provenance/LICENSES/derived-images.txt',
      ],
    } as AssetProvenance,
    ...narrationRecords,
  ]

  const evidenceFiles = renderEvidenceFiles(input, {
    modelLicense,
    modelAttribution,
    modifications,
    runtimeModel,
    runtimeLandscape,
    runtimePortrait,
    runtimePoster,
    runtimePosterPortrait,
    runtimeThumbnail,
    runtimeNarrationZh,
    runtimeNarrationEn,
    generatedOn,
  })

  return { records, evidenceFiles }
}

interface EvidenceContext {
  readonly modelLicense: ReturnType<typeof licenseFor>
  readonly modelAttribution: string
  readonly modifications: readonly string[]
  readonly runtimeModel: FileFingerprint
  readonly runtimeLandscape: FileFingerprint
  readonly runtimePortrait: FileFingerprint
  readonly runtimePoster: FileFingerprint
  readonly runtimePosterPortrait: FileFingerprint
  readonly runtimeThumbnail: FileFingerprint
  readonly runtimeNarrationZh: FileFingerprint
  readonly runtimeNarrationEn: FileFingerprint
  readonly generatedOn: string
}

// The five LICENSES evidence texts the production validator checks. The
// narration file carries the Serena / project-owner / listening-approval /
// per-locale language phrases the validator regex-greps.
function renderEvidenceFiles(
  input: PromotionProvenanceInput,
  context: EvidenceContext,
): Record<string, string> {
  const { profile } = input
  const name = profile.candidate.name
  const source = profile.archive.sourceDownload
  const archiveNote =
    profile.archive.licenseEvidenceFile === undefined
      ? ''
      : `\nArchived license file: ${profile.archive.licenseEvidenceFile.path}\nSHA-256: ${profile.archive.licenseEvidenceFile.sha256}\n`
  const approvalLine = `Recorded in approval-record.json: approved by ${input.approval.approvedBy} on ${input.approval.approvedOn}.`
  const { derivativesLog } = input

  const modelLicenseText = `${name} model license record
${'='.repeat(name.length + 22)}

Asset: ${name}
Creator: ${profile.candidate.author}
License: ${context.modelLicense.name} (${context.modelLicense.spdx})
License URL: ${context.modelLicense.url}
Source URL: ${profile.candidate.sourcePage}
Accessed: ${profile.candidate.accessDate}

Attribution:
${context.modelAttribution}

License evidence: ${profile.candidate.licenseEvidence}
${archiveNote}`

  const modelSourceText = `${name} model source and modifications
${'='.repeat(name.length + 31)}

Direct source:
${profile.candidate.sourcePage}

Creator: ${profile.candidate.author}
License: ${context.modelLicense.spdx}
Original downloaded source: ${source?.bytes ?? 0} bytes (${source?.path ?? 'unknown'})
Original SHA-256:
${source?.sha256 ?? ''}

Modifications for the Prehistoric Animal Museum:
${context.modifications.map((line) => `- ${line}`).join('\n')}

Published runtime GLB: ${context.runtimeModel.bytes} bytes
Published SHA-256:
${context.runtimeModel.sha256}
`

  const backgroundText = `${name} background generation record
${'='.repeat(name.length + 29)}

Tool: Blender ${derivativesLog.blender.version.split(' ')[0] ?? ''} (project-authored habitat scene, deterministic seed)
Seed: ${derivativesLog.blender.seed}
Generated: ${context.generatedOn}
Use: project-specific responsive museum backgrounds

The landscape and portrait were rendered as separate deterministic EEVEE Next
passes from the project-authored habitat scene spec
${derivativesLog.blender.specPath} (SHA-256 ${derivativesLog.blender.specSha256}).
No animal, person, text, UI, logo, or watermark appears in the renders.

Landscape runtime WebP: ${context.runtimeLandscape.bytes} bytes (${derivativesLog.backgrounds.landscape.width} × ${derivativesLog.backgrounds.landscape.height})
SHA-256: ${context.runtimeLandscape.sha256}

Portrait runtime WebP: ${context.runtimePortrait.bytes} bytes (${derivativesLog.backgrounds.portrait.width} × ${derivativesLog.backgrounds.portrait.height})
SHA-256: ${context.runtimePortrait.sha256}

The reviewed renders were encoded as lossy WebP at quality ${derivativesLog.webpSettings.quality}.
The project owner approved public distribution on ${input.approval.approvedOn}.
${approvalLine}
`

  const derivedImagesText = `${name} poster and thumbnail derivation record
${'='.repeat(name.length + 41)}

Generated: ${context.generatedOn}

The ${derivativesLog.posters.landscape.width} × ${derivativesLog.posters.landscape.height} poster and the
${derivativesLog.posters.portrait.width} × ${derivativesLog.posters.portrait.height} portrait poster are deterministic
runtime captures of the normalized model without text, controls, logos, or
watermarks. The ${derivativesLog.posters.thumbnail.width} × ${derivativesLog.posters.thumbnail.height} thumbnail was
captured from the accepted desktop review presentation after hiding all
interface chrome.

Poster SHA-256: ${context.runtimePoster.sha256} (${context.runtimePoster.bytes} bytes)
Portrait poster SHA-256: ${context.runtimePosterPortrait.sha256} (${context.runtimePosterPortrait.bytes} bytes)
Thumbnail SHA-256: ${context.runtimeThumbnail.sha256} (${context.runtimeThumbnail.bytes} bytes)

The model attribution and ${context.modelLicense.spdx} terms in model-license.txt
continue to apply. The background generation record is retained separately.
`

  const narrationBlock = (
    locale: 'zh-CN' | 'en',
    language: 'Chinese' | 'English',
    runtime: FileFingerprint,
  ) => `${language} narration approval

Locale: ${locale}
Speaker: Serena
Language: ${language}
Generated: ${input.narrationMetrics[locale].generatedAt.slice(0, 10)}
Runtime bytes: ${runtime.bytes}
Runtime SHA-256: ${runtime.sha256}
Human listening review: approved
Public distribution decision: approved
Approved: project owner ${input.approval.approvedBy} on ${input.approval.approvedOn}

Script: ${input.scripts[locale]}
`

  const narrationRightsText = `Qwen3-TTS Serena narration rights record
Reviewed: ${input.approval.approvedOn}

The Mandarin and English scripts are project-authored. Both audio takes were
generated offline with Qwen3-TTS-12Hz-0.6B-CustomVoice using its built-in
Serena speaker, normalized to 48 kHz mono MP3s, and listened to and approved
by the project owner.

Qwen3-TTS code and the official 0.6B CustomVoice model card are Apache-2.0:
https://github.com/QwenLM/Qwen3-TTS/blob/main/LICENSE
https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice

The official release identifies Serena among the open-sourced timbres:
https://qwen.ai/blog/?id=qwen3tts-0115

The owner approves public distribution of these reviewed MP3s. The public
notice identifies the model, Serena speaker, AI synthesis, and model license.
${approvalLine}

${narrationBlock('zh-CN', 'Chinese', context.runtimeNarrationZh)}
${narrationBlock('en', 'English', context.runtimeNarrationEn)}`

  return {
    'provenance/LICENSES/model-license.txt': modelLicenseText,
    'provenance/LICENSES/model-source.txt': modelSourceText,
    'provenance/LICENSES/background-generation.txt': backgroundText,
    'provenance/LICENSES/derived-images.txt': derivedImagesText,
    'provenance/LICENSES/narration-rights.txt': narrationRightsText,
  }
}

function tsStringLiteral(value: string): string {
  return `'${value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')}'`
}

function tsLiteral(value: unknown, indent: string): string {
  if (typeof value === 'string') {
    return tsStringLiteral(value)
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  const childIndent = `${indent}  `
  if (Array.isArray(value)) {
    const items = value.map((entry) => `${childIndent}${tsLiteral(entry, childIndent)}`)
    return `[\n${items.join(',\n')},\n${indent}]`
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).map(
      ([key, entry]) => `${childIndent}${key}: ${tsLiteral(entry, childIndent)}`,
    )
    return `{\n${entries.join(',\n')},\n${indent}}`
  }
  throw new Error(`cannot render TS literal for ${String(value)}`)
}

function renderProvenanceModule(records: readonly AssetProvenance[]): string {
  return `import type { AssetProvenance } from '../../types'

export const provenance = ${tsLiteral(records, '')} satisfies readonly [
  AssetProvenance,
  ...AssetProvenance[],
]
`
}

async function loadPromotionProvenanceInput(
  loaded: LoadedProfile,
  stagedFiles: Readonly<Record<string, FileFingerprint>>,
): Promise<PromotionProvenanceInput> {
  const { profile, candidateDir } = loaded
  const derivativesLog = (await readJsonFile(
    join(candidateDir, 'qa/derivatives-log.json'),
  )) as DerivativesLogSummary
  const narrationMetrics = {
    'zh-CN': (await readJsonFile(
      join(candidateDir, ...profile.narration['zh-CN'].metricsPath.split('/')),
    )) as NarrationMetricsSummary,
    en: (await readJsonFile(
      join(candidateDir, ...profile.narration.en.metricsPath.split('/')),
    )) as NarrationMetricsSummary,
  }
  const approvalRecord = (await readJsonFile(
    join(candidateDir, APPROVAL_RECORD_FILE),
  )) as ApprovalRecord
  const normalizationLog = await readFile(
    join(candidateDir, 'blender/normalization.log'),
    'utf8',
  )
  const sceneSpec = await hashFile(
    join(candidateDir, ...derivativesLog.blender.specPath.split('/')),
  )

  const scripts: Record<'zh-CN' | 'en', string> = {
    'zh-CN': '',
    en: '',
  }
  for (const locale of ['zh-CN', 'en'] as const) {
    const contentText = await readFile(
      join(candidateDir, `content/content.${locale}.ts`),
      'utf8',
    )
    const sentences = extractNarrationSentences(contentText)
    const script = joinNarrationScript(locale, sentences)
    // Cross-check the exact TTS input: the recorded script file holds one
    // sentence per line and must carry the same text the provenance binds.
    const scriptFile = await readFile(
      join(candidateDir, ...profile.narration[locale].scriptPath.split('/')),
      'utf8',
    )
    const normalize = (value: string) =>
      value.normalize('NFKC').replace(/\s+/g, ' ').trim()
    const scriptLines = scriptFile
      .split('\n')
      .map(normalize)
      .filter((line) => line.length > 0)
    if (
      scriptLines.length !== sentences.length ||
      scriptLines.some((line, index) => line !== normalize(sentences[index] ?? ''))
    ) {
      throw new Error(
        `${profile.id}: ${locale} narration script file does not match the content sentences`,
      )
    }
    scripts[locale] = script
  }

  return {
    profile,
    stagedFiles,
    scripts,
    normalizationLog,
    derivativesLog,
    narrationMetrics,
    sceneSpec,
    approval: {
      approvedBy: approvalRecord.approvedBy,
      approvedOn: approvalRecord.approvedOn,
    },
  }
}

async function runNpmScript(script: string): Promise<string> {
  const { stdout, stderr } = await execFileAsync('npm', ['run', script], {
    cwd: repositoryRoot,
    maxBuffer: 16 * 1024 * 1024,
  })
  return `${stdout}\n${stderr}`
}

export interface BatchResult {
  readonly dryRun: boolean
  readonly collection: string
  readonly animals: ReadonlyArray<{
    readonly id: string
    readonly status: 'planned' | 'installed' | 'updated' | 'identical' | 'blocked'
    readonly deterministicProblems: readonly string[]
    readonly pendingHuman: readonly string[]
    readonly ops: readonly PromotionFileOp[]
  }>
  readonly collectionAppend: readonly string[]
  readonly postSteps: readonly string[]
}

export async function stageAndInstall(
  loadeds: readonly LoadedProfile[],
  options: { readonly collection: string },
): Promise<BatchResult> {
  // Real promotion. Caller has already validated every animal and verified
  // every approval record.
  const stagingRoot = join(
    repositoryRoot,
    'assets/candidates',
    loadeds[0]?.profile.run ?? '',
    'promotion-staging',
  )
  const results: Array<{
    id: string
    status: 'installed' | 'updated' | 'identical'
    deterministicProblems: readonly string[]
    pendingHuman: readonly string[]
    ops: readonly PromotionFileOp[]
  }> = []

  const originalCollection = await readFile(COLLECTION_PATH, 'utf8')
  const installedDirs: string[] = []
  const rollbackRoot = join(stagingRoot, '.rollback')
  const replacedDirs: Array<{ targetDir: string; backupDir: string }> = []
  await rm(rollbackRoot, { recursive: true, force: true })
  const postStepSnapshots: Array<{ path: string; content: string | null }> = []
  for (const relativePath of POST_STEP_SNAPSHOT_PATHS) {
    const path = join(repositoryRoot, relativePath)
    postStepSnapshots.push({
      path,
      content: (await pathExists(path)) ? await readFile(path, 'utf8') : null,
    })
  }

  try {
    for (const loaded of loadeds) {
      const { profile, candidateDir } = loaded
      const stagingDir = join(stagingRoot, profile.id)
      await mkdir(join(stagingDir, 'provenance/LICENSES'), { recursive: true })

      const stagedFiles: Record<string, FileFingerprint> = {}
      const stage = async (source: string, target: string, content?: string | Buffer) => {
        const stagingPath = join(stagingDir, ...target.split('/'))
        await mkdir(dirname(stagingPath), { recursive: true })
        if (content !== undefined) {
          await writeFile(stagingPath, content)
        } else {
          await copyFile(
            join(candidateDir, ...source.split('/')),
            stagingPath,
          )
        }
        stagedFiles[target] = await hashFile(stagingPath)
      }

      await stage('output/model/model.glb', 'model/model.glb')
      await stage('output/poster.webp', 'images/poster.webp')
      await stage('output/images/poster-portrait.webp', 'images/poster-portrait.webp')
      await stage('output/thumbnail.webp', 'images/thumbnail.webp')
      await stage('output/background-landscape.webp', 'backgrounds/landscape.webp')
      await stage('output/background-portrait.webp', 'backgrounds/portrait.webp')
      await stage(profile.narration['zh-CN'].path, 'audio/narration.zh-CN.mp3')
      await stage(profile.narration.en.path, 'audio/narration.en.mp3')
      const zhContent = await readFile(
        join(candidateDir, 'content/content.zh-CN.ts'),
        'utf8',
      )
      await stage(
        'content/content.zh-CN.ts',
        'content.zh-CN.ts',
        zhContent.replace(
          /from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/content\/types'/,
          "from '../../types'",
        ),
      )
      const enContent = await readFile(
        join(candidateDir, 'content/content.en.ts'),
        'utf8',
      )
      await stage(
        'content/content.en.ts',
        'content.en.ts',
        enContent.replace(
          /from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/content\/types'/,
          "from '../../types'",
        ),
      )
      const provenanceInput = await loadPromotionProvenanceInput(
        loaded,
        stagedFiles,
      )
      const provenanceBundle = buildPromotionProvenance(provenanceInput)
      await stage(
        '<generated>',
        'provenance.ts',
        renderProvenanceModule(provenanceBundle.records),
      )
      for (const [target, text] of Object.entries(
        provenanceBundle.evidenceFiles,
      )) {
        await stage('<generated>', target, text)
      }
      await stage(
        '<generated>',
        'package.ts',
        generatePackageModule(profile, profile.presentation.initialYawDegrees),
      )
      // animal.ts is staged last, matching the install order.
      await stage('<generated>', 'animal.ts', generateAnimalModule())
      await writeJsonFile(join(stagingDir, 'staged-manifest.json'), {
        id: profile.id,
        run: profile.run,
        files: stagedFiles,
      })

      // Install: non-catalog files first, animal.ts last.
      const targetDir = join(repositoryRoot, 'src/content/animals', profile.id)
      const nonCatalog = Object.keys(stagedFiles).filter((target) => target !== 'animal.ts')
      const ordered = [...nonCatalog.sort(), 'animal.ts']
      if (await pathExists(targetDir)) {
        const current = await hashDirectory(targetDir)
        const drift = Object.entries(stagedFiles).filter(
          ([target, fingerprint]) =>
            current[target]?.sha256 !== fingerprint.sha256 ||
            current[target]?.bytes !== fingerprint.bytes,
        )
        if (drift.length === 0) {
          results.push({
            id: profile.id,
            status: 'identical',
            deterministicProblems: [],
            pendingHuman: [],
            ops: [],
          })
          continue
        }

        if ((ORIGINAL_12_IDS as readonly string[]).includes(profile.id)) {
          throw new Error(
            `promotion target changed for protected original animal ${profile.id}: ${drift.map(([target]) => target).join(', ')}`,
          )
        }

        // An existing, approved animal may be promoted as a production
        // revision. Move the complete old package aside before exposing any
        // replacement file so rollback can restore it byte-for-byte. The
        // caller has already validated the current review manifest and the
        // hashed owner approval record for this exact profile.
        const backupDir = join(rollbackRoot, profile.id)
        await mkdir(dirname(backupDir), { recursive: true })
        await rename(targetDir, backupDir)
        replacedDirs.push({ targetDir, backupDir })
        for (const target of ordered) {
          const destination = join(targetDir, ...target.split('/'))
          await mkdir(dirname(destination), { recursive: true })
          await copyFile(join(stagingDir, ...target.split('/')), destination)
        }
        results.push({
          id: profile.id,
          status: 'updated',
          deterministicProblems: [],
          pendingHuman: [],
          ops: [],
        })
        continue
      }
      for (const target of ordered) {
        const destination = join(targetDir, ...target.split('/'))
        await mkdir(dirname(destination), { recursive: true })
        await copyFile(join(stagingDir, ...target.split('/')), destination)
      }
      installedDirs.push(targetDir)
      results.push({
        id: profile.id,
        status: 'installed',
        deterministicProblems: [],
        pendingHuman: [],
        ops: [],
      })
    }

    // Append every new id to the collection exactly once, after all
    // existing entries.
    const ids = loadeds.map(({ profile }) => profile.id)
    let collection = originalCollection
    for (const id of ids) {
      if (!collection.includes(`'${id}'`)) {
        collection = collection.replace(
          /(animalIds: \[[\s\S]*?)\n  \]/,
          `$1\n    '${id}',\n  ]`,
        )
      }
    }
    if (collection !== originalCollection) {
      await writeFile(COLLECTION_PATH, collection, 'utf8')
    }

    await runNpmScript('generate:credits')
    await runNpmScript('validate:content')
    await captureBaseline()
    await rm(rollbackRoot, { recursive: true, force: true })
  } catch (error) {
    // Roll the whole batch back: remove installed package dirs and restore
    // the collection file plus everything the post-steps regenerated.
    for (const dir of installedDirs) {
      await rm(dir, { recursive: true, force: true })
    }
    for (const { targetDir, backupDir } of [...replacedDirs].reverse()) {
      await rm(targetDir, { recursive: true, force: true })
      if (await pathExists(backupDir)) {
        await rename(backupDir, targetDir)
      }
    }
    await writeFile(COLLECTION_PATH, originalCollection, 'utf8')
    for (const snapshot of postStepSnapshots) {
      if (snapshot.content === null) {
        await rm(snapshot.path, { force: true })
      } else {
        await writeFile(snapshot.path, snapshot.content, 'utf8')
      }
    }
    throw error
  }

  return {
    dryRun: false,
    collection: options.collection,
    animals: results,
    collectionAppend: loadeds.map(({ profile }) => profile.id),
    postSteps: ['generate:credits', 'validate:content'],
  }
}

export interface PromotionVerifyResult {
  readonly id: string
  readonly promoted: boolean
  readonly problems: readonly string[]
}

// Post-promotion verification: package on disk == staged manifest, the
// collection lists the id exactly once, and the baseline still verifies.
export async function verifyPromotion(
  loaded: LoadedProfile,
): Promise<PromotionVerifyResult> {
  const { profile, candidateDir } = loaded
  const problems: string[] = []
  const targetDir = join(repositoryRoot, 'src/content/animals', profile.id)
  if (!(await pathExists(targetDir))) {
    return {
      id: profile.id,
      promoted: false,
      problems: ['not promoted: no production package on disk'],
    }
  }

  const stagingManifestPath = join(
    repositoryRoot,
    'assets/candidates',
    profile.run,
    'promotion-staging',
    profile.id,
    'staged-manifest.json',
  )
  if (!(await pathExists(stagingManifestPath))) {
    problems.push('promotion staging manifest missing')
  } else {
    const manifest = (await readJsonFile(stagingManifestPath)) as {
      files: Record<string, FileFingerprint>
    }
    const current = await hashDirectory(targetDir)
    for (const [target, fingerprint] of Object.entries(manifest.files)) {
      const actual = current[target]
      if (!actual) {
        problems.push(`installed package missing ${target}`)
      } else if (
        actual.sha256 !== fingerprint.sha256 ||
        actual.bytes !== fingerprint.bytes
      ) {
        problems.push(`installed ${target} differs from the staged hash`)
      }
    }
  }

  const collection = await readFile(COLLECTION_PATH, 'utf8')
  const occurrences = collection.split(`'${profile.id}'`).length - 1
  if (occurrences !== 1) {
    problems.push(`collection lists ${profile.id} ${occurrences} times, expected exactly once`)
  }
  return { id: profile.id, promoted: problems.length === 0, problems }
}
