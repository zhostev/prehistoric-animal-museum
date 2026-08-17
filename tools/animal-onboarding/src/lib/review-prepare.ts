import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

import {
  hashFile,
  readJsonFile,
  repositoryRoot,
  writeJsonFile,
  type FileFingerprint,
} from './files'
import { encodeGradientPng, type Rgb } from './png'
import { pathExists, type CandidateProfile, type LoadedProfile } from './profile'

export const REVIEW_MANIFEST_PATH = 'qa/review-manifest.json'

const REVIEW_ASSETS_PATH = join(repositoryRoot, 'src/review/assets.ts')
const REVIEW_CATALOG_PATH = join(repositoryRoot, 'src/review/catalog.ts')
const REVIEW_ROUTES_PATH = join(repositoryRoot, 'scripts/review-assets.ts')
const REVIEW_SPEC_PATH = join(repositoryRoot, 'review-e2e/local-review.spec.ts')

function camelCase(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase())
}

// Deterministic kind/atmosphere defaults for this batch; drafts stay
// human-gated, so a wrong guess is caught in local review, never published.
function kindFor(habitat: string): string {
  if (habitat === 'water') {
    return 'other-prehistoric-animal'
  }
  return 'dinosaur'
}

function atmosphereFor(habitat: string): string {
  if (habitat === 'water') {
    return 'underwater'
  }
  if (habitat === 'air') {
    return 'air'
  }
  return 'plains'
}

const LICENSE_TEXT: Record<string, { name: string; url: string }> = {
  'CC0-1.0': {
    name: 'CC0 1.0 Universal Public Domain Dedication',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'CC-BY-4.0': {
    name: 'Creative Commons Attribution 4.0 International',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
}

interface BackgroundPlan {
  readonly landscape: string
  readonly portrait: string
  readonly placeholder: boolean
}

const PLACEHOLDER_GRADIENTS: Record<string, { top: Rgb; bottom: Rgb }> = {
  land: { top: { r: 0xcf, g: 0xe3, b: 0xef }, bottom: { r: 0xb8, g: 0xa7, b: 0x7e } },
  air: { top: { r: 0xd7, g: 0xe4, b: 0xf2 }, bottom: { r: 0x9f, g: 0xb3, b: 0xcc } },
  water: { top: { r: 0x2c, g: 0x5d, b: 0x7c }, bottom: { r: 0x16, g: 0x32, b: 0x4a } },
}

// The local review surface cannot commit a model without a background image
// (src/App.tsx disposes the staged model when the background rejects). When
// the candidate has no authored background yet, synthesize a deliberately
// plain deterministic gradient so the draft renders; the review note and
// draft notes mark it as a placeholder and the background approval stays
// human-only.
export async function ensureBackgrounds(loaded: LoadedProfile): Promise<BackgroundPlan> {
  const { profile, candidateDir } = loaded
  const landscapeWebp = join(candidateDir, 'output/background-landscape.webp')
  const portraitWebp = join(candidateDir, 'output/background-portrait.webp')
  const landscapePng = join(candidateDir, 'output/background-landscape.png')
  const portraitPng = join(candidateDir, 'output/background-portrait.png')

  const landscapeReady =
    (await pathExists(landscapeWebp)) || (await pathExists(landscapePng))
  const portraitReady =
    (await pathExists(portraitWebp)) || (await pathExists(portraitPng))
  if (!landscapeReady || !portraitReady) {
    const gradient =
      PLACEHOLDER_GRADIENTS[profile.presentation.habitat] ??
      ({ top: { r: 0xcf, g: 0xe3, b: 0xef }, bottom: { r: 0xb8, g: 0xa7, b: 0x7e } } as const)
    if (!landscapeReady) {
      await writeFileText(
        landscapePng,
        encodeGradientPng(1920, 1080, gradient.top, gradient.bottom),
      )
    }
    if (!portraitReady) {
      await writeFileText(
        portraitPng,
        encodeGradientPng(1080, 1920, gradient.top, gradient.bottom),
      )
    }
  }

  const landscape = (await pathExists(landscapeWebp))
    ? 'output/background-landscape.webp'
    : 'output/background-landscape.png'
  const portrait = (await pathExists(portraitWebp))
    ? 'output/background-portrait.webp'
    : 'output/background-portrait.png'
  return {
    landscape,
    portrait,
    placeholder: !(await pathExists(landscapeWebp)) || !(await pathExists(portraitWebp)),
  }
}

function accentFor(habitat: string): { strong: string; soft: string } {
  if (habitat === 'water') {
    return { strong: '#2f5d7a', soft: '#bcd9e8' }
  }
  if (habitat === 'air') {
    return { strong: '#5d6b8a', soft: '#d3dcef' }
  }
  return { strong: '#7a5a3a', soft: '#e8d3a5' }
}

async function readZhName(candidateDir: string): Promise<string> {
  const source = await readFile(join(candidateDir, 'content/content.zh-CN.ts'), 'utf8')
  const match = /name:\s*'([^']+)'/.exec(source) ?? /"name":\s*"([^"]+)"/.exec(source)
  if (!match) {
    throw new Error('content/content.zh-CN.ts has no readable name field')
  }
  return match[1] ?? ''
}

async function transformContentFile(
  candidateDir: string,
  fileName: 'content.zh-CN.ts' | 'content.en.ts',
): Promise<string | null> {
  const sourcePath = join(candidateDir, 'content', fileName)
  if (!(await pathExists(sourcePath))) {
    return null
  }
  const source = await readFile(sourcePath, 'utf8')
  const transformed = source.replace(
    /from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/content\/types'/,
    "from '../../../content/types'",
  )
  if (transformed === source) {
    throw new Error(`${fileName}: could not rewrite the types import path`)
  }
  return transformed
}

interface NarrationReadiness {
  readonly zhCN: boolean
  readonly en: boolean
}

function packageSource(
  loaded: LoadedProfile,
  zhName: string,
  narration: NarrationReadiness,
  hasEnglishContent: boolean,
  modelBytes: number,
  background: BackgroundPlan,
  reviewRevision: boolean,
): string {
  const { profile } = loaded
  const draftMetadata = (profile as CandidateProfile & {
    readonly draft?: { readonly kind?: string; readonly atmosphere?: string }
  }).draft
  const id = profile.id
  const habitat = profile.presentation.habitat
  const shadowGround = profile.presentation.shadow === 'ground'
  const accent = accentFor(habitat)
  const license = LICENSE_TEXT[profile.candidate.license] ?? {
    name: profile.candidate.license,
    url: profile.candidate.sourcePage,
  }
  const pendingNote =
    narration.zhCN && narration.en
      ? ''
      : ' 旁白 MP3 尚未生成，听审保持 pending。'
  const backgroundNote = background.placeholder
    ? ' 背景是自动化占位渐变，等待背景阶段与人工确认。'
    : ''
  const ownerApproved = Object.values(profile.humanApprovals).every(Boolean)
  const reviewBadge = ownerApproved ? '已验收' : '自动 QA 通过'
  const reviewStatus = ownerApproved
    ? `${zhName}已完成人工验收，等待或已完成生产晋升`
    : `${zhName}完整本地草稿，等待科学、视觉、动作与听审`
  const reviewNote = ownerApproved
    ? `${profile.candidate.author} 发布的 ${profile.candidate.license} 模型，源档案、许可证据、自包含 GLB、预算、八秒 Idle、landmarks 投影与五视口证据均通过自动化核对；科学、解剖、材质、动作、背景、双语文案、双语听审、公开分发与生产决定已由产品负责人明确验收。`
    : `${profile.candidate.author} 发布的 ${profile.candidate.license} 模型，源档案、许可证据、自包含 GLB、预算、八秒 Idle、landmarks 投影与五视口证据由自动化核对。${pendingNote}${backgroundNote} 科学身份、解剖、材质、动作自然度、背景、文案、听审与公开分发决定全部仍是 human-only。`
  const draftNotes = ownerApproved
    ? `    '全部 human-only 类别已由产品负责人明确验收并写入哈希审批记录。',
    '本包可以通过受保护的原子生产事务晋升；生产集合始终是运行时权威。',`
    : `    '${reviewRevision ? '这是已有生产动物的待审修订；本地 review 使用候选资产，线上生产集合和资产保持不变。' : '仅加入显式本地 review allowlist；没有进入 src/content/animals 或生产集合。'}',
    '自动 hard gates 已通过，但科学身份、解剖、材质、动作自然度、背景、中文内容、完整听审和公开分发决定仍是 human-only。',
    '只有产品负责人明确批准后才能记录 approval 并执行生产晋升。',`

  const narrationPlan = (locale: 'zh-CN' | 'en', ready: boolean): string => {
    const key = locale === 'en' ? 'en' : `'${locale}'`
    return ready
      ? `    ${key}: {
      status: 'ready',
      sourcePath: 'audio/narration.${locale}.mp3',
      mimeType: 'audio/mpeg',
    },`
      : `    ${key}: {
      status: 'pending-review',
      expectedPath: 'audio/narration.${locale}.mp3',
      message: '旁白 MP3 尚未生成，等待 Qwen3-TTS Serena 生成与完整听审。',
      gate: {
        id: 'final-narration',
        locale: '${locale}',
        reason: 'narration audio not generated yet; listening review stays human-only',
      },
    },`
  }

  const narrationAsset = (locale: 'zh-CN' | 'en', ready: boolean): string =>
    ready
      ? `    '${locale}': {
      status: 'ready',
      sourcePath: 'audio/narration.${locale}.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('${id}', 'narration.mp3'),
    },`
      : narrationPlan(locale, false)

  return `import type { CompleteDraftAnimalPackage } from '../../types'
import { reviewAssetUrl } from '../../assets'
import { zhCN } from './content.zh-CN'
${hasEnglishContent ? `import { en } from './content.en'\n` : ''}
export const animal = {
  id: '${id}',
  status: 'draft',
${reviewRevision ? "  reviewRevision: true,\n" : ''}  kind: '${draftMetadata?.kind ?? kindFor(habitat)}',
  habitat: '${habitat}',
  atmosphere: '${draftMetadata?.atmosphere ?? atmosphereFor(habitat)}',
  content: {
    'zh-CN': zhCN,${hasEnglishContent ? '\n    en,' : ''}
  },
  presentation: {
    initialYawDegrees: ${profile.presentation.initialYawDegrees},
    safeAreaPadding: 0.12,
    preciseBounds: true,
    shadow: '${profile.presentation.shadow}',${shadowGround ? '\n    shadowOpacity: 0.5,\n    shadowScale: 0.5,' : ''}
  },
  animation: {
    clip: 'Idle',
    loop: 'repeat',
    speed: 1,
  },
  narration: {
${narrationPlan('zh-CN', narration.zhCN)}
${narrationPlan('en', narration.en)}
  },
  provenance: [],
  assets: {
    model: reviewAssetUrl('${id}', 'model.glb'),
    modelBytes: ${modelBytes},
    poster: reviewAssetUrl('${id}', 'poster.webp'),
    posterPortrait: reviewAssetUrl('${id}', 'poster-portrait.webp'),
    thumbnail: reviewAssetUrl('${id}', 'thumbnail.webp'),
    backgrounds: {
      landscape: reviewAssetUrl('${id}', 'background-landscape'),
      portrait: reviewAssetUrl('${id}', 'background-portrait'),
    },
    narration: {
${narrationAsset('zh-CN', narration.zhCN)}
${narrationAsset('en', narration.en)}
    },
  },
  review: {
    badge: '${reviewBadge}',
    status: '${reviewStatus}',
    note:
      '${reviewNote}',
    checks: [
      '恢复初始视角，确认头部清楚位于画面左侧；再 360° 核对轮廓与附件结构。',
      '完整观看两个八秒循环，确认 Idle 可读、无断裂或穿插。',
      '在横版与竖版背景复看材质、眼睛和轮廓的对比度。',
      '完整听审 Serena 中文与英文旁白（生成后）。',
    ],
    accent: {
      strong: '${accent.strong}',
      soft: '${accent.soft}',
    },
    modelCredit: {
      attribution:
        '"${profile.candidate.name}" by ${profile.candidate.author}, ${license.name}. Normalized by the Prehistoric Animal Museum project for local review.',
      licenseName: '${license.name}',
      licenseUrl: '${license.url}',
      sourceTitle: '${profile.candidate.name}',
      sourceUrl: '${profile.candidate.sourcePage}',
    },
  },
  draftNotes: [
${draftNotes}${!ownerApproved && background.placeholder ? "\n    '当前背景是自动化占位渐变，不是 art direction；背景人工验收前不得晋升。'," : ''}
  ],
} satisfies CompleteDraftAnimalPackage
`
}

function routeEntrySource(
  loaded: LoadedProfile,
  narrationReady: boolean,
  background: BackgroundPlan,
): string {
  const { profile, candidateDir } = loaded
  const relativeDir = relative(repositoryRoot, candidateDir).split('\\').join('/')
  const route = (path: string) =>
    `repositoryFile(\n      '${relativeDir}/${path}',\n    )`
  const lines = [
    `  ${profile.id.includes('-') ? `'${profile.id}'` : profile.id}: {`,
    `    model: ${route('output/model/model.glb')},`,
    `    backgroundLandscape: ${route(background.landscape)},`,
    `    backgroundPortrait: ${route(background.portrait)},`,
  ]
  if (narrationReady) {
    lines.push(`    narration: ${route('output/audio/narration.zh-CN.mp3')},`)
  }
  lines.push(
    `    poster: ${route('output/poster.webp')},`,
    `    posterPortrait: ${route('output/images/poster-portrait.webp')},`,
    `    thumbnail: ${route('output/thumbnail.webp')},`,
    '  },',
  )
  return lines.join('\n')
}

async function insertOnce(
  filePath: string,
  marker: string,
  apply: (source: string) => string,
): Promise<boolean> {
  const source = await readFile(filePath, 'utf8')
  if (source.includes(marker)) {
    return false
  }
  const updated = apply(source)
  if (updated === source) {
    throw new Error(`${filePath}: insert anchor not found`)
  }
  await writeFile(filePath, updated, 'utf8')
  return true
}

async function writeFileText(
  filePath: string,
  content: string | Buffer,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf8')
}

// Extends scripts/review-assets.ts. The historical table resolves
// poster-portrait from the production package, which only works for promoted
// animals, so the table gains an explicit per-animal override first.
async function ensurePosterPortraitOverride(): Promise<void> {
  const source = await readFile(REVIEW_ROUTES_PATH, 'utf8')
  let updated = source
  if (!updated.includes('readonly posterPortrait?: string')) {
    updated = updated.replace(
      '  readonly narration?: string\n',
      '  readonly narration?: string\n  readonly posterPortrait?: string\n',
    )
  }
  if (!updated.includes('files.posterPortrait ??')) {
    updated = updated.replace(
      '    const posterPortrait = productionAnimalAsset(\n      animalId as LocalReviewAnimalId,\n      \'images/poster-portrait.webp\',\n    )',
      '    const posterPortrait =\n      files.posterPortrait ??\n      productionAnimalAsset(\n        animalId as LocalReviewAnimalId,\n        \'images/poster-portrait.webp\',\n      )',
    )
  }
  if (updated !== source) {
    await writeFileText(REVIEW_ROUTES_PATH, updated)
  }
}

export interface ReviewManifest {
  readonly id: string
  readonly run: string
  readonly narrationReady: NarrationReadiness
  readonly registeredFiles: Readonly<Record<string, FileFingerprint>>
  readonly registeredAssets: Readonly<
    Record<string, (FileFingerprint & { path: string }) | { missing: true; path: string }>
  >
}

export async function prepareReviewDraft(loaded: LoadedProfile): Promise<ReviewManifest> {
  const { profile, candidateDir } = loaded

  const zhCN = await transformContentFile(candidateDir, 'content.zh-CN.ts')
  if (zhCN === null) {
    throw new Error('content/content.zh-CN.ts missing; review prepare needs the zh-CN draft')
  }
  const en = await transformContentFile(candidateDir, 'content.en.ts')
  const zhName = await readZhName(candidateDir)

  const background = await ensureBackgrounds(loaded)
  const zhMp3 = join(candidateDir, ...profile.narration['zh-CN'].path.split('/'))
  const enMp3 = join(candidateDir, ...profile.narration.en.path.split('/'))
  const narrationReady: NarrationReadiness = {
    zhCN: await pathExists(zhMp3),
    en: await pathExists(enMp3),
  }

  const modelStat = await stat(join(candidateDir, 'output/model/model.glb'))
  const reviewRevision =
    !profile.humanApprovals.production &&
    (await pathExists(join(repositoryRoot, 'src/content/animals', profile.id, 'animal.ts')))

  // 1. The draft package itself.
  const packageDir = join(repositoryRoot, 'src/review/animals', profile.id)
  await writeFileText(
    join(packageDir, 'content.zh-CN.ts'),
    zhCN,
  )
  if (en !== null) {
    await writeFileText(join(packageDir, 'content.en.ts'), en)
  }
  await writeFileText(
    join(packageDir, 'package.ts'),
    packageSource(
      loaded,
      zhName,
      narrationReady,
      en !== null,
      modelStat.size,
      background,
      reviewRevision,
    ),
  )

  // 2. src/review/assets.ts id union.
  await insertOnce(REVIEW_ASSETS_PATH, `| '${profile.id}'`, (source) =>
    source.replace(
      /(export type LocalReviewAnimalId =(?:\n  \| '[^']+')+)/,
      `$1\n  | '${profile.id}'`,
    ),
  )

  // 3. src/review/catalog.ts import + onboardingDrafts entry.
  const importName = `${camelCase(profile.id)}Draft`
  await insertOnce(REVIEW_CATALOG_PATH, importName, (source) =>
    source
      .replace(
        /((?:import \{ animal as \w+Draft \} from '\.\/animals\/[\w-]+\/package'\n)+)/,
        `$1import { animal as ${importName} } from './animals/${profile.id}/package'\n`,
      )
      .replace(
        /(const onboardingDrafts[^=]*= \[[^\]]*)\]/,
        `$1  ${importName},\n]`,
      ),
  )

  // 4. scripts/review-assets.ts asset routes. The entry is regenerated on
  // every run so route targets track the current candidate outputs.
  await ensurePosterPortraitOverride()
  {
    const source = await readFile(REVIEW_ROUTES_PATH, 'utf8')
    const entry = routeEntrySource(loaded, narrationReady.zhCN, background)
    const key = profile.id.includes('-') ? `'${profile.id}'` : profile.id
    const existingBlock = new RegExp(
      `  ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: \\{[\\s\\S]*?\\n  \\},\\n`,
    )
    let updated: string
    if (existingBlock.test(source)) {
      updated = source.replace(existingBlock, `${entry}\n`)
    } else {
      updated = source.replace(
        /\n\}\n\nconst routeFilePairs/,
        `\n${entry}\n}\n\nconst routeFilePairs`,
      )
      if (updated === source) {
        throw new Error('scripts/review-assets.ts: route insert anchor not found')
      }
    }
    if (updated !== source) {
      await writeFileText(REVIEW_ROUTES_PATH, updated)
    }
  }

  // 5. review-e2e/local-review.spec.ts reviewAnimals entry (refreshed so the
  // narration flag tracks the actual MP3s).
  {
    const source = await readFile(REVIEW_SPEC_PATH, 'utf8')
    const entry = `  { id: '${profile.id}', name: '${zhName}', narrationReady: ${narrationReady.zhCN} },`
    const existingLine = new RegExp(`\\n  \\{ id: '${profile.id}',[^\\n]*\\},`)
    let updated: string
    if (existingLine.test(source)) {
      updated = source.replace(existingLine, `\n${entry}`)
    } else {
      updated = source.replace(
        /(const reviewAnimals = \[[\s\S]*?)\n\] as const/,
        `$1\n${entry}\n] as const`,
      )
      if (updated === source) {
        throw new Error('review-e2e/local-review.spec.ts: insert anchor not found')
      }
    }
    if (updated !== source) {
      await writeFileText(REVIEW_SPEC_PATH, updated)
    }
  }

  // 6. The hashed review manifest.
  const manifest = await writeReviewManifest(loaded, narrationReady, background)
  return manifest
}

export async function writeReviewManifest(
  loaded: LoadedProfile,
  narrationReady: NarrationReadiness,
  background: BackgroundPlan,
): Promise<ReviewManifest> {
  const { profile, candidateDir } = loaded

  const registeredFiles: Record<string, FileFingerprint> = {}
  const sourceFiles = [
    `src/review/animals/${profile.id}/package.ts`,
    `src/review/animals/${profile.id}/content.zh-CN.ts`,
    `src/review/animals/${profile.id}/content.en.ts`,
    `content/content.zh-CN.ts`,
    `content/content.en.ts`,
    'approval-record.json',
  ]
  for (const relativePath of sourceFiles) {
    const absolutePath = relativePath.startsWith('src/')
      ? join(repositoryRoot, ...relativePath.split('/'))
      : join(candidateDir, ...relativePath.split('/'))
    if (await pathExists(absolutePath)) {
      registeredFiles[relativePath] = await hashFile(absolutePath)
    }
  }

  const registeredAssets: Record<
    string,
    (FileFingerprint & { path: string }) | { missing: true; path: string }
  > = {}
  const assets: Array<readonly [string, string]> = [
    ['model.glb', 'output/model/model.glb'],
    ['background-landscape', background.landscape],
    ['background-portrait', background.portrait],
    ['poster.webp', 'output/poster.webp'],
    ['poster-portrait.webp', 'output/images/poster-portrait.webp'],
    ['thumbnail.webp', 'output/thumbnail.webp'],
  ]
  if (narrationReady.zhCN) {
    assets.push(['narration.mp3', profile.narration['zh-CN'].path])
  }
  for (const [fileName, relativePath] of assets) {
    const absolutePath = join(candidateDir, ...relativePath.split('/'))
    registeredAssets[fileName] = (await pathExists(absolutePath))
      ? { ...(await hashFile(absolutePath)), path: relativePath }
      : { missing: true, path: relativePath }
  }

  const manifest: ReviewManifest = {
    id: profile.id,
    run: profile.run,
    narrationReady,
    registeredFiles,
    registeredAssets,
  }
  await writeJsonFile(join(candidateDir, REVIEW_MANIFEST_PATH), manifest)
  return manifest
}

export interface ManifestCurrency {
  readonly current: boolean
  readonly problems: readonly string[]
}

// Recomputes every hash recorded in the manifest and reports drift.
export async function checkReviewManifestCurrent(
  loaded: LoadedProfile,
): Promise<ManifestCurrency> {
  const manifestPath = join(loaded.candidateDir, REVIEW_MANIFEST_PATH)
  if (!(await pathExists(manifestPath))) {
    return { current: false, problems: ['qa/review-manifest.json missing; run review prepare'] }
  }
  const manifest = (await readJsonFile(manifestPath)) as ReviewManifest
  const problems: string[] = []

  for (const [relativePath, recorded] of Object.entries(manifest.registeredFiles)) {
    const absolutePath = relativePath.startsWith('src/')
      ? join(repositoryRoot, ...relativePath.split('/'))
      : join(loaded.candidateDir, ...relativePath.split('/'))
    if (!(await pathExists(absolutePath))) {
      problems.push(`registered file missing: ${relativePath}`)
      continue
    }
    const actual = await hashFile(absolutePath)
    if (actual.sha256 !== recorded.sha256 || actual.bytes !== recorded.bytes) {
      problems.push(`registered file changed: ${relativePath}`)
    }
  }
  for (const [fileName, recorded] of Object.entries(manifest.registeredAssets)) {
    if ('missing' in recorded) {
      continue
    }
    const relativePath = recorded.path
    const absolutePath = join(loaded.candidateDir, ...relativePath.split('/'))
    if (!(await pathExists(absolutePath))) {
      problems.push(`registered asset missing: ${fileName}`)
      continue
    }
    const actual = await hashFile(absolutePath)
    if (actual.sha256 !== recorded.sha256 || actual.bytes !== recorded.bytes) {
      problems.push(`registered asset changed: ${fileName}`)
    }
  }
  return { current: problems.length === 0, problems }
}
