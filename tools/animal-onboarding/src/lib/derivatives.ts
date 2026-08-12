import { execFile } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'

import { chromium, type Page } from 'playwright'
import sharp from 'sharp'
import { createServer, type ViteDevServer } from 'vite'

import { hashFile, repositoryRoot, writeJsonFile, type FileFingerprint } from './files'
import { pathExists, type CandidateProfile, type LoadedProfile } from './profile'
import { prepareReviewDraft } from './review-prepare'

const execFileAsync = promisify(execFile)

export const DERIVATIVES_LOG_PATH = 'qa/derivatives-log.json'
export const SCENE_SPEC_PATH = 'qa/derivatives-scene-spec.json'
export const BLENDER_REPORT_PATH = 'qa/derivatives-blender-report.json'

// Budgets mirrored from scripts/content-validation.ts and
// ANIMAL_AUTHORING_GUIDE.md §5; keep in sync.
export const BACKGROUND_PAIR_TARGET_BYTES = Math.round(1.2 * 1024 * 1024)
export const BACKGROUND_PAIR_CEILING_BYTES = 2 * 1024 * 1024
export const POSTER_CEILING_BYTES = 500 * 1024
export const THUMBNAIL_CEILING_BYTES = 120 * 1024

// A poster must provably contain the model: within the central 50%×50% of
// the frame at least this fraction of pixels must be model (alpha > 24 in
// the isolated canvas capture). Guards against shipping a blank poster.
export const POSTER_MIN_CENTER_MODEL_RATIO = 0.02
export const POSTER_CENTER_REGION_FRACTION = 0.5

export const WEBP_SETTINGS = { quality: 82, effort: 6 } as const

export const POSTER_VIEWPORTS = [
  { key: 'landscape', width: 1200, height: 675 },
  { key: 'portrait', width: 390, height: 844 },
] as const

// Runtime environments live outside the repository (standard §2); the env
// override keeps the stage testable.
export function blenderExecutable(): string {
  return (
    process.env.MUSEUM_ONBOARDING_BLENDER ??
    resolve(repositoryRoot, '../.runtime/blender/blender-4.5.12-linux-x64/blender')
  )
}

// --- Pure, deterministic scene-spec authoring ------------------------------

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Stable FNV-1a hash of the animal id; the scene spec is fully determined by
// the profile, so reruns produce byte-identical scene graphs.
export function seedFromId(id: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 0x01000193) >>> 0
  }
  return hash
}

export type RgbLinear = readonly [number, number, number]

// sRGB hex -> Blender linear float triple, so palette constants mean the
// same thing as the hex values in the museum's existing backgrounds.
export function hexToLinear(hex: string): RgbLinear {
  const value = Number.parseInt(hex.slice(1), 16)
  const channel = (shift: number) => {
    const srgb = ((value >> shift) & 0xff) / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return [channel(16), channel(8), channel(0)]
}

export interface HabitatSceneSpec {
  readonly animal: string
  readonly habitat: 'land' | 'water'
  readonly seed: number
  readonly world: {
    readonly stops: ReadonlyArray<readonly [number, RgbLinear]>
    readonly strength: number
  }
  readonly sun: {
    readonly rotationEuler: readonly [number, number, number]
    readonly energy: number
    readonly color: RgbLinear
    readonly angle: number
  }
  readonly ground: {
    readonly z: number
    readonly size: number
    readonly material: string
  }
  readonly materials: Readonly<
    Record<
      string,
      {
        readonly kind?: 'ray'
        readonly color: RgbLinear
        readonly roughness?: number
        readonly emissionStrength?: number
        readonly opacity?: number
      }
    >
  >
  readonly hills: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly scale: readonly [number, number, number]
    readonly material: string
  }>
  readonly trees: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly trunkHeight: number
    readonly trunkRadius: number
    readonly canopyRadius: number
    readonly canopyHeight: number
    readonly trunkMaterial: string
    readonly canopyMaterial: string
  }>
  readonly rocks: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly scale: readonly [number, number, number]
    readonly material: string
  }>
  readonly patches: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly radius: number
    readonly height: number
    readonly material: string
  }>
  readonly rays: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly rotationEuler: readonly [number, number, number]
    readonly width: number
    readonly height: number
    readonly material: string
  }>
  readonly particles: ReadonlyArray<{
    readonly location: readonly [number, number, number]
    readonly radius: number
    readonly material: string
  }>
  readonly cameras: {
    readonly landscape: CameraSpec
    readonly portrait: CameraSpec
  }
  readonly reportPath: string
}

export interface CameraSpec {
  readonly location: readonly [number, number, number]
  readonly target: readonly [number, number, number]
  readonly focalLength: number
  readonly width: number
  readonly height: number
  readonly output: string
}

export interface SceneSpecPaths {
  readonly landscapeOutput: string
  readonly portraitOutput: string
  readonly reportPath: string
}

const DEG = Math.PI / 180

// Land palette measured against src/content/animals/maiasaura backgrounds and
// the deterministic placeholder gradients: cream horizon, soft blue sky,
// warm tan ground, muted sage vegetation kept away from the quiet centre.
function landSceneSpec(
  id: string,
  paths: SceneSpecPaths,
): HabitatSceneSpec {
  const seed = seedFromId(id)
  const random = mulberry32(seed)
  const pick = (min: number, max: number) => min + random() * (max - min)
  const side = () => (random() < 0.5 ? -1 : 1)

  const hills = Array.from({ length: 6 }, () => ({
    location: [side() * pick(18, 55), pick(30, 60), -1] as const,
    scale: [pick(10, 20), pick(8, 14), pick(3.2, 6.4)] as const,
    material: random() < 0.5 ? 'hillFar' : 'hillNear',
  }))
  // Two depth bands framing the landscape/portrait edges, plus a distant,
  // hazy tree line along the horizon like the maiasaura production
  // background. The central column (|x| < 10 in view, y < 35) stays quiet.
  const treeAt = (band: 'near' | 'mid' | 'far') => {
    const far = band === 'far'
    const canopyRadius = far ? pick(0.9, 1.6) : pick(1.3, 2.3)
    return {
      location:
        band === 'near'
          ? ([side() * pick(13, 22), pick(8, 15), 0] as const)
          : band === 'mid'
            ? ([side() * pick(10, 17), pick(16, 30), 0] as const)
            : ([side() * pick(5, 34), pick(44, 68), 0] as const),
      trunkHeight: far ? pick(1.6, 2.6) : pick(2.2, 3.8),
      trunkRadius: pick(0.16, 0.3),
      canopyRadius,
      canopyHeight: canopyRadius * pick(1.5, 1.9),
      trunkMaterial: 'trunk',
      canopyMaterial: random() < 0.5 ? 'canopyA' : 'canopyB',
    }
  }
  const trees = [
    ...Array.from({ length: 5 }, () => treeAt('near')),
    ...Array.from({ length: 4 }, () => treeAt('mid')),
    ...Array.from({ length: 8 }, () => treeAt('far')),
  ]
  const rocks = Array.from({ length: 4 }, () => ({
    location: [side() * pick(6.5, 18), pick(3, 16), 0] as const,
    scale: [pick(0.5, 1.2), pick(0.4, 0.9), pick(0.25, 0.5)] as const,
    material: 'rock',
  }))
  // Large, very flat, low-contrast tone discs keep the ground from reading as
  // flat desert while staying well inside the composition ground-continuity
  // gate (their luminance step is ~5/255, gate is 40/255).
  const patches = Array.from({ length: 7 }, () => ({
    location: [pick(-38, 38), pick(2, 45), 0.01] as const,
    radius: pick(5, 10),
    height: 0.015,
    material: random() < 0.5 ? 'grassPatch' : 'sandPatch',
  }))

  return {
    animal: id,
    habitat: 'land',
    seed,
    world: {
      stops: [
        [0, hexToLinear('#f2e9d2')],
        [0.5, hexToLinear('#f2e9d2')],
        [0.545, hexToLinear('#cfe0f2')],
        [0.6, hexToLinear('#a9c6de')],
        [0.68, hexToLinear('#7fa8cc')],
        [1, hexToLinear('#7fa8cc')],
      ],
      strength: 0.85,
    },
    sun: {
      rotationEuler: [35 * DEG, 8 * DEG, 15 * DEG],
      energy: 2.3,
      color: hexToLinear('#fff2dd'),
      angle: 0.6,
    },
    ground: { z: 0, size: 220, material: 'ground' },
    materials: {
      ground: { color: hexToLinear('#b8a77e'), roughness: 1 },
      grassPatch: { color: hexToLinear('#ada87b'), roughness: 1 },
      sandPatch: { color: hexToLinear('#bdae85'), roughness: 1 },
      hillFar: { color: hexToLinear('#a8ad8f'), roughness: 1 },
      hillNear: { color: hexToLinear('#93a07c'), roughness: 1 },
      trunk: { color: hexToLinear('#7a5f48'), roughness: 1 },
      canopyA: { color: hexToLinear('#8fa876'), roughness: 1 },
      canopyB: { color: hexToLinear('#7c9a6b'), roughness: 1 },
      rock: { color: hexToLinear('#9a938a'), roughness: 1 },
    },
    hills,
    trees,
    rocks,
    patches,
    rays: [],
    particles: [],
    cameras: {
      landscape: {
        location: [0, -16, 2.6],
        target: [0, 10, 1.6],
        focalLength: 32,
        width: 1920,
        height: 1080,
        output: paths.landscapeOutput,
      },
      portrait: {
        location: [0, -14, 4.2],
        target: [0, 14, 2.0],
        focalLength: 40,
        width: 1080,
        height: 1920,
        output: paths.portraitOutput,
      },
    },
    reportPath: paths.reportPath,
  }
}

// Water palette measured against the mosasaurus production background: light
// surface teal at the top, deep blue at depth, darker floor, god-ray planes
// and drifting motes kept out of the quiet centre.
function waterSceneSpec(
  id: string,
  paths: SceneSpecPaths,
): HabitatSceneSpec {
  const seed = seedFromId(id)
  const random = mulberry32(seed)
  const pick = (min: number, max: number) => min + random() * (max - min)
  const side = () => (random() < 0.5 ? -1 : 1)

  const rocks = Array.from({ length: 5 }, () => ({
    location: [side() * pick(8, 22), pick(4, 24), -6.6] as const,
    scale: [pick(1.2, 3.2), pick(1.0, 2.4), pick(0.5, 1.1)] as const,
    material: 'floorRock',
  }))
  const rays = Array.from({ length: 5 }, () => {
    // Bottom edge always below the seabed plane (z = -7) so no ray ends
    // visibly mid-frame.
    const z = pick(4, 7)
    return {
      location: [side() * pick(4.5, 14), pick(8, 22), z] as const,
      rotationEuler: [90 * DEG, 0, side() * pick(8, 18) * DEG] as const,
      width: pick(0.8, 2.0),
      height: 2 * (z + 9),
      material: 'ray',
    }
  })
  const particles = Array.from({ length: 70 }, () => {
    // Keep the quiet centre free: resample into the outer band.
    let x = pick(-15, 15)
    const z = pick(-6, 8)
    if (Math.abs(x) < 4 && Math.abs(z) < 2.5) {
      x = side() * pick(4, 15)
    }
    return {
      location: [x, pick(-4, 16), z] as const,
      radius: pick(0.03, 0.08),
      material: 'mote',
    }
  })

  return {
    animal: id,
    habitat: 'water',
    seed,
    world: {
      // The 0.5 stop matches the rendered seabed colour at the horizon so the
      // floor's far edge dissolves into the water column instead of seaming.
      stops: [
        [0, hexToLinear('#0e2434')],
        [0.35, hexToLinear('#1d4e68')],
        [0.5, hexToLinear('#2e5671')],
        [0.6, hexToLinear('#69b4cf')],
        [0.68, hexToLinear('#7ec3d9')],
        [1, hexToLinear('#7ec3d9')],
      ],
      strength: 1.0,
    },
    sun: {
      rotationEuler: [14 * DEG, 6 * DEG, 10 * DEG],
      energy: 2.2,
      color: hexToLinear('#dff2f8'),
      angle: 0.5,
    },
    ground: { z: -7, size: 600, material: 'floor' },
    materials: {
      floor: { color: hexToLinear('#22465c'), roughness: 1 },
      floorRock: { color: hexToLinear('#1b3a4e'), roughness: 1 },
      ray: {
        kind: 'ray',
        color: hexToLinear('#bfe6ef'),
        opacity: 0.055,
        emissionStrength: 0.35,
      },
      mote: {
        color: hexToLinear('#cfeef5'),
        roughness: 0.6,
        emissionStrength: 0.3,
      },
    },
    hills: [],
    trees: [],
    rocks,
    patches: [],
    rays,
    particles,
    cameras: {
      landscape: {
        location: [0, -16, 0.6],
        target: [0, 10, 0.2],
        focalLength: 32,
        width: 1920,
        height: 1080,
        output: paths.landscapeOutput,
      },
      portrait: {
        location: [0, -13, 1.4],
        target: [0, 12, 0.4],
        focalLength: 40,
        width: 1080,
        height: 1920,
        output: paths.portraitOutput,
      },
    },
    reportPath: paths.reportPath,
  }
}

// The deterministic "prompt equivalent" for the Blender stage. Landscape and
// portrait are separate camera compositions over one scene, never crops.
export function habitatSceneSpec(
  profile: {
    readonly id: string
    readonly presentation: Pick<CandidateProfile['presentation'], 'habitat'>
  },
  paths: SceneSpecPaths,
): HabitatSceneSpec {
  if (profile.presentation.habitat === 'water') {
    return waterSceneSpec(profile.id, paths)
  }
  if (profile.presentation.habitat === 'air') {
    throw new Error(`derivatives: no air habitat scene authored yet (${profile.id})`)
  }
  return landSceneSpec(profile.id, paths)
}

// --- Pure evaluation helpers ------------------------------------------------

export type BackgroundBudget = 'ok' | 'warning' | 'over'

export function evaluateBackgroundPairBytes(
  landscapeBytes: number,
  portraitBytes: number,
): BackgroundBudget {
  const total = landscapeBytes + portraitBytes
  if (total > BACKGROUND_PAIR_CEILING_BYTES) {
    return 'over'
  }
  if (total > BACKGROUND_PAIR_TARGET_BYTES) {
    return 'warning'
  }
  return 'ok'
}

export interface RawFrameLike {
  readonly data: Buffer
  readonly width: number
  readonly height: number
}

// Fraction of pixels inside the central region of the frame that belong to
// the model (alpha > 24 in the isolated canvas capture).
export function centerModelRatio(
  frame: RawFrameLike,
  regionFraction: number = POSTER_CENTER_REGION_FRACTION,
): number {
  const marginX = Math.round((frame.width * (1 - regionFraction)) / 2)
  const marginY = Math.round((frame.height * (1 - regionFraction)) / 2)
  const regionWidth = frame.width - marginX * 2
  const regionHeight = frame.height - marginY * 2
  let modelPixels = 0
  for (let y = marginY; y < marginY + regionHeight; y += 1) {
    for (let x = marginX; x < marginX + regionWidth; x += 1) {
      if ((frame.data[(y * frame.width + x) * 4 + 3] ?? 0) > 24) {
        modelPixels += 1
      }
    }
  }
  return modelPixels / (regionWidth * regionHeight)
}

// --- Stage runner -------------------------------------------------------------

interface RawFrame {
  readonly data: Buffer
  readonly width: number
  readonly height: number
}

async function rawFrame(png: Buffer): Promise<RawFrame> {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

// Hides every UI layer except the scene background and the WebGL canvas, so
// the poster is the accepted runtime presentation with nothing else baked in.
const POSTER_STYLE = `
  .museum-experience > :not(.stage-panel):not(.scene-background),
  .stage-panel > :not(.viewer-stage),
  .model-composition-frame > * {
    visibility: hidden !important;
  }
  .viewer-host::after {
    opacity: 0 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
`

const ISOLATE_MODEL_STYLE = `
  html, body, #root, .museum-experience, .stage-panel, .viewer-stage,
  .model-viewport, .viewer-host {
    background: transparent !important;
  }
  .museum-experience > :not(.stage-panel),
  .stage-panel > :not(.viewer-stage) {
    visibility: hidden !important;
  }
  .model-composition-frame > * {
    visibility: hidden !important;
  }
  .viewer-host::after {
    opacity: 0 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
`

async function freezeClock(page: Page, seconds: number): Promise<boolean> {
  return page.evaluate<boolean>(
    `document.querySelector('.viewer-canvas')?.__museumReviewSetAnimationTime?.(${seconds}) ?? false`,
  )
}

async function waitForSettled(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.viewer-canvas')
    const frame = document.querySelector<HTMLElement>('.model-composition-frame')
    return Boolean(
      canvas &&
        frame &&
        Number(canvas.dataset.compositionWidth) === Math.round(frame.clientWidth) &&
        Number(canvas.dataset.compositionHeight) === Math.round(frame.clientHeight),
    )
  })
  await page.evaluate(
    () =>
      new Promise<void>((resolveFrame) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame()))
      }),
  )
}

export interface DerivativeFileRecord extends FileFingerprint {
  readonly path: string
  readonly width: number
  readonly height: number
}

export interface PosterRecord extends DerivativeFileRecord {
  readonly centerModelRatio: number
}

export interface DerivativesReport {
  readonly id: string
  readonly run: string
  readonly blender: {
    readonly executable: string
    readonly version: string
    readonly engine: string
    readonly viewTransform: string
    readonly seed: number
    readonly specPath: string
    readonly specSha256: string
    readonly reportPath: string
  }
  readonly webpSettings: typeof WEBP_SETTINGS
  readonly backgrounds: {
    readonly landscape: DerivativeFileRecord
    readonly portrait: DerivativeFileRecord
    readonly pairBytes: number
    readonly budget: BackgroundBudget
  }
  readonly posters: {
    readonly landscape: PosterRecord
    readonly portrait: PosterRecord
    readonly thumbnail: DerivativeFileRecord
  }
  readonly problems: readonly string[]
}

async function encodeWebp(
  source: Buffer | string,
  target: string,
): Promise<DerivativeFileRecord> {
  const encoded = await sharp(source)
    .webp({ ...WEBP_SETTINGS })
    .toBuffer()
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, encoded)
  const metadata = await sharp(encoded).metadata()
  return {
    path: target,
    ...(await hashFile(target)),
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  }
}

interface BlenderStageResult {
  readonly version: string
  readonly engine: string
  readonly viewTransform: string
}

async function renderHabitatBackgrounds(
  loaded: LoadedProfile,
  problems: string[],
): Promise<BlenderStageResult | null> {
  const { profile, candidateDir } = loaded
  const executable = blenderExecutable()
  if (!(await pathExists(executable))) {
    problems.push(`blender executable missing: ${executable}`)
    return null
  }

  const paths: SceneSpecPaths = {
    landscapeOutput: join(candidateDir, 'output/background-landscape.png'),
    portraitOutput: join(candidateDir, 'output/background-portrait.png'),
    reportPath: join(candidateDir, BLENDER_REPORT_PATH),
  }
  const spec = habitatSceneSpec(profile, paths)
  const specPath = join(candidateDir, SCENE_SPEC_PATH)
  await writeJsonFile(specPath, spec)

  const scriptPath = join(
    repositoryRoot,
    'tools/animal-onboarding/blender/render_habitat.py',
  )
  try {
    await execFileAsync(
      executable,
      [
        '--background',
        '--factory-startup',
        '--python',
        scriptPath,
        '--',
        '--spec',
        specPath,
      ],
      { maxBuffer: 16 * 1024 * 1024 },
    )
  } catch (error) {
    problems.push(`blender habitat render failed: ${String(error)}`)
    return null
  }
  if (!(await pathExists(paths.reportPath))) {
    problems.push('blender report missing after render')
    return null
  }
  const report = JSON.parse(await readFile(paths.reportPath, 'utf8')) as {
    blenderVersion: string
    engine: string
    viewTransform: string
  }
  return {
    version: report.blenderVersion,
    engine: report.engine,
    viewTransform: report.viewTransform,
  }
}

async function capturePoster(
  page: Page,
  origin: string,
  id: string,
  viewport: (typeof POSTER_VIEWPORTS)[number],
): Promise<{ poster: Buffer; model: RawFrame }> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  await page.goto(`${origin}?animal=${encodeURIComponent(id)}`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForFunction(
    (expectedId) =>
      document
        .querySelector('#museum-experience')
        ?.getAttribute('data-ready-animal-id') === expectedId,
    id,
    { timeout: 60_000 },
  )
  const frozen = await freezeClock(page, 0)
  if (!frozen) {
    throw new Error(`${id}: review animation clock hook unavailable`)
  }
  await waitForSettled(page)

  const posterStyle = await page.addStyleTag({ content: POSTER_STYLE })
  const poster = await page.screenshot({ animations: 'disabled', type: 'png' })
  await posterStyle.evaluate((element) => element.parentNode?.removeChild(element))

  const isolateStyle = await page.addStyleTag({ content: ISOLATE_MODEL_STYLE })
  const model = await rawFrame(
    await page.screenshot({
      animations: 'disabled',
      omitBackground: true,
      type: 'png',
    }),
  )
  await isolateStyle.evaluate((element) => element.parentNode?.removeChild(element))
  return { poster, model }
}

export interface DerivativesRunResult {
  readonly report: DerivativesReport
  readonly exitCode: 0 | 1
}

export async function runDerivatives(
  loaded: LoadedProfile,
): Promise<DerivativesRunResult> {
  const { profile, candidateDir } = loaded
  const problems: string[] = []

  const blender = await renderHabitatBackgrounds(loaded, problems)
  if (blender === null) {
    throw new Error(`derivatives ${profile.id}: ${problems.join('; ')}`)
  }

  const landscapeWebp = await encodeWebp(
    join(candidateDir, 'output/background-landscape.png'),
    join(candidateDir, 'output/background-landscape.webp'),
  )
  const portraitWebp = await encodeWebp(
    join(candidateDir, 'output/background-portrait.png'),
    join(candidateDir, 'output/background-portrait.webp'),
  )
  for (const [label, record, width, height] of [
    ['landscape background', landscapeWebp, 1920, 1080],
    ['portrait background', portraitWebp, 1080, 1920],
  ] as const) {
    if (record.width !== width || record.height !== height) {
      problems.push(
        `${label} is ${record.width}x${record.height}, expected ${width}x${height}`,
      )
    }
  }
  const budget = evaluateBackgroundPairBytes(landscapeWebp.bytes, portraitWebp.bytes)
  if (budget === 'over') {
    problems.push(
      `background pair ${landscapeWebp.bytes + portraitWebp.bytes} B exceeds the 2 MiB ceiling`,
    )
  }

  // Repoint the review asset routes at the new .webp backgrounds and rehash
  // the manifest before the poster capture, so the poster provably shows the
  // same background the runtime serves.
  await prepareReviewDraft(loaded)

  const specFingerprint = await hashFile(join(candidateDir, SCENE_SPEC_PATH))

  let posterRecord: PosterRecord | undefined
  let portraitPosterRecord: PosterRecord | undefined
  let thumbnailRecord: DerivativeFileRecord | undefined
  let server: ViteDevServer | undefined
  const browser = await chromium.launch({ headless: true })
  try {
    server = await createServer({
      configFile: resolve(repositoryRoot, 'vite.config.ts'),
      mode: 'review',
      server: { host: '127.0.0.1', port: 0, strictPort: false },
    })
    await server.listen()
    const origin = server.resolvedUrls?.local[0]
    if (!origin) {
      throw new Error('vite review server did not expose a local URL')
    }
    const page = await browser.newPage()

    const captures = new Map<string, { poster: Buffer; model: RawFrame }>()
    for (const viewport of POSTER_VIEWPORTS) {
      captures.set(viewport.key, await capturePoster(page, origin, profile.id, viewport))
    }
    await page.close()

    const landscape = captures.get('landscape')
    const portrait = captures.get('portrait')
    if (!landscape || !portrait) {
      throw new Error('poster captures incomplete')
    }

    const landscapeTarget = join(candidateDir, 'output/poster.webp')
    const landscapeEncoded = await encodeWebp(landscape.poster, landscapeTarget)
    posterRecord = {
      ...landscapeEncoded,
      centerModelRatio: centerModelRatio(landscape.model),
    }

    const portraitTarget = join(candidateDir, 'output/images/poster-portrait.webp')
    const portraitEncoded = await encodeWebp(portrait.poster, portraitTarget)
    portraitPosterRecord = {
      ...portraitEncoded,
      centerModelRatio: centerModelRatio(portrait.model),
    }

    // Readable square thumbnail: centre crop of the landscape poster.
    const thumbnailTarget = join(candidateDir, 'output/thumbnail.webp')
    const side = Math.min(landscapeEncoded.width, landscapeEncoded.height)
    const thumbnail = await sharp(
      await readFile(landscapeTarget),
    )
      .extract({
        left: Math.round((landscapeEncoded.width - side) / 2),
        top: Math.round((landscapeEncoded.height - side) / 2),
        width: side,
        height: side,
      })
      .resize(320, 320)
      .webp({ ...WEBP_SETTINGS })
      .toBuffer()
    await writeFile(thumbnailTarget, thumbnail)
    const thumbnailMetadata = await sharp(thumbnail).metadata()
    thumbnailRecord = {
      path: thumbnailTarget,
      ...(await hashFile(thumbnailTarget)),
      width: thumbnailMetadata.width ?? 0,
      height: thumbnailMetadata.height ?? 0,
    }
  } finally {
    await browser.close()
    await server?.close()
  }
  if (!posterRecord || !portraitPosterRecord || !thumbnailRecord) {
    throw new Error(`derivatives ${profile.id}: poster capture did not complete`)
  }

  if (posterRecord.width !== 1200 || posterRecord.height !== 675) {
    problems.push(
      `poster is ${posterRecord.width}x${posterRecord.height}, expected 1200x675`,
    )
  }
  if (portraitPosterRecord.width !== 390 || portraitPosterRecord.height !== 844) {
    problems.push(
      `portrait poster is ${portraitPosterRecord.width}x${portraitPosterRecord.height}, expected 390x844`,
    )
  }
  if (thumbnailRecord.width !== 320 || thumbnailRecord.height !== 320) {
    problems.push(
      `thumbnail is ${thumbnailRecord.width}x${thumbnailRecord.height}, expected 320x320`,
    )
  }
  if (posterRecord.bytes > POSTER_CEILING_BYTES) {
    problems.push(`poster ${posterRecord.bytes} B exceeds the 500 KiB ceiling`)
  }
  if (portraitPosterRecord.bytes > POSTER_CEILING_BYTES) {
    problems.push(
      `portrait poster ${portraitPosterRecord.bytes} B exceeds the 500 KiB ceiling`,
    )
  }
  if (thumbnailRecord.bytes > THUMBNAIL_CEILING_BYTES) {
    problems.push(`thumbnail ${thumbnailRecord.bytes} B exceeds the 120 KiB ceiling`)
  }
  for (const [label, record] of [
    ['landscape poster', posterRecord],
    ['portrait poster', portraitPosterRecord],
  ] as const) {
    if (record.centerModelRatio < POSTER_MIN_CENTER_MODEL_RATIO) {
      problems.push(
        `${label} center model ratio ${(record.centerModelRatio * 100).toFixed(2)}% < ${POSTER_MIN_CENTER_MODEL_RATIO * 100}% floor; refusing to ship a blank poster`,
      )
    }
  }

  const report: DerivativesReport = {
    id: profile.id,
    run: profile.run,
    blender: {
      executable: blenderExecutable(),
      version: blender.version,
      engine: blender.engine,
      viewTransform: blender.viewTransform,
      seed: seedFromId(profile.id),
      specPath: SCENE_SPEC_PATH,
      specSha256: specFingerprint.sha256,
      reportPath: BLENDER_REPORT_PATH,
    },
    webpSettings: WEBP_SETTINGS,
    backgrounds: {
      landscape: landscapeWebp,
      portrait: portraitWebp,
      pairBytes: landscapeWebp.bytes + portraitWebp.bytes,
      budget,
    },
    posters: {
      landscape: posterRecord,
      portrait: portraitPosterRecord,
      thumbnail: thumbnailRecord,
    },
    problems,
  }
  await writeJsonFile(join(candidateDir, DERIVATIVES_LOG_PATH), report)
  return { report, exitCode: problems.length === 0 ? 0 : 1 }
}
