import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { chromium, type Page } from 'playwright'
import sharp from 'sharp'
import { createServer, type ViteDevServer } from 'vite'

import { repositoryRoot, writeJsonFile } from './files'
import { pathExists, type LoadedProfile } from './profile'

export const COMPOSITION_REPORT_PATH = 'qa/composition-report.json'
export const ANIMATION_MIN_CHANGED_RATIO = 0.03

export const COMPOSITION_VIEWPORTS = [
  { label: '360x640', width: 360, height: 640 },
  { label: '390x844', width: 390, height: 844 },
  { label: '844x390', width: 844, height: 390 },
  { label: '768x1024', width: 768, height: 1024 },
  { label: '1440x900', width: 1440, height: 900 },
] as const

// Hides every UI layer so the omitBackground screenshot contains only the
// WebGL model on transparency (same approach as scripts/render-model-previews.ts).
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

const HIDE_CANVAS_STYLE = `
  .museum-experience * {
    visibility: hidden !important;
  }
  .museum-experience,
  .scene-background,
  .scene-background img {
    visibility: visible !important;
  }
`

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

function luminance(frame: RawFrame, offset: number): number {
  return (
    0.2126 * (frame.data[offset] ?? 0) +
    0.7152 * (frame.data[offset + 1] ?? 0) +
    0.0722 * (frame.data[offset + 2] ?? 0)
  )
}

export interface AnimationPixelDiff {
  readonly modelPixels: number
  readonly changedPixels: number
  readonly changedRatio: number
}

// Changed-pixel ratio over the union of the two frames' measured model
// pixel regions (alpha > 24 in either frame; any RGB channel moves > 8/255).
export function measureAnimationPixelDiff(
  first: RawFrame,
  second: RawFrame,
): AnimationPixelDiff {
  if (first.width !== second.width || first.height !== second.height) {
    throw new Error('frame size mismatch')
  }
  let modelPixels = 0
  let changedPixels = 0
  for (let offset = 0; offset < first.data.length; offset += 4) {
    const visible =
      (first.data[offset + 3] ?? 0) > 24 || (second.data[offset + 3] ?? 0) > 24
    if (!visible) {
      continue
    }
    modelPixels += 1
    const changed =
      Math.abs((first.data[offset] ?? 0) - (second.data[offset] ?? 0)) > 8 ||
      Math.abs((first.data[offset + 1] ?? 0) - (second.data[offset + 1] ?? 0)) > 8 ||
      Math.abs((first.data[offset + 2] ?? 0) - (second.data[offset + 2] ?? 0)) > 8
    if (changed) {
      changedPixels += 1
    }
  }
  return {
    modelPixels,
    changedPixels,
    changedRatio: modelPixels === 0 ? 0 : changedPixels / modelPixels,
  }
}

export interface GroundEvaluation {
  readonly feetBottomFraction: number
  readonly shadowPresence: number
  readonly shadowCoverage: number
  readonly maxGroundStep: number
  readonly problems: readonly string[]
}

// Deterministic land-composition gate, documented method:
// - solid model pixels are alpha > 200 (the meshes are opaque); the contact
//   shadow is the translucent rest (24 < alpha <= 200) around the feet plane;
// - the feet cluster is the bottom 3% of solid rows; feet-over-ground
//   requires the cluster bottom in the lower half of the composition frame;
// - the shadow must visibly exist (>=0.5% of the contact band pixels) and its
//   horizontal span must cover >=90% of the feet span (equivalent to covering
//   the measured foot contacts after the initial yaw);
// - the background inside the contact band must be continuous: no
//   adjacent-row mean luminance step above 40/255 (sky edges, vegetation
//   borders and strong light/dark seams all exceed it).
export function evaluateGroundContact(
  model: RawFrame,
  visible: RawFrame,
  background: RawFrame,
): GroundEvaluation {
  const { width, height } = model
  const problems: string[] = []
  if (visible.width !== width || visible.height !== height) {
    throw new Error('visible frame size mismatch')
  }

  let maxY = -1
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if ((model.data[(y * width + x) * 4 + 3] ?? 0) > 200) {
        maxY = y
      }
    }
  }
  if (maxY < 0) {
    return {
      feetBottomFraction: 0,
      shadowPresence: 0,
      shadowCoverage: 0,
      maxGroundStep: 0,
      problems: ['model frame has no visible pixels'],
    }
  }

  const feetTop = Math.max(0, maxY - Math.round(height * 0.03))
  let feetMinX = width
  let feetMaxX = 0
  for (let y = feetTop; y <= maxY; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if ((model.data[(y * width + x) * 4 + 3] ?? 0) > 200) {
        feetMinX = Math.min(feetMinX, x)
        feetMaxX = Math.max(feetMaxX, x)
      }
    }
  }

  const feetBottomFraction = maxY / height
  if (feetBottomFraction < 0.45) {
    problems.push(
      `feet cluster bottom at ${(feetBottomFraction * 100).toFixed(1)}% of frame height; feet must sit in the lower half`,
    )
  }

  const bandTop = Math.max(0, maxY - Math.round(height * 0.04))
  const bandBottom = Math.min(height - 1, maxY + Math.round(height * 0.04))
  let shadowPixels = 0
  let shadowMinX = width
  let shadowMaxX = 0
  for (let y = bandTop; y <= bandBottom; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = model.data[(y * width + x) * 4 + 3] ?? 0
      if (alpha > 24 && alpha <= 200) {
        shadowPixels += 1
        shadowMinX = Math.min(shadowMinX, x)
        shadowMaxX = Math.max(shadowMaxX, x)
      }
    }
  }
  const bandArea = (bandBottom - bandTop + 1) * width
  const shadowPresence = bandArea === 0 ? 0 : shadowPixels / bandArea
  const feetSpan = Math.max(1, feetMaxX - feetMinX)
  const shadowCoverage =
    shadowPixels === 0
      ? 0
      : (Math.min(shadowMaxX, feetMaxX) - Math.max(shadowMinX, feetMinX)) /
        feetSpan
  if (shadowPresence < 0.005) {
    problems.push(
      `contact shadow is not visibly present under the feet (${(shadowPresence * 100).toFixed(2)}% of the contact band)`,
    )
  }
  if (shadowCoverage < 0.9) {
    problems.push(
      `contact shadow covers ${(shadowCoverage * 100).toFixed(1)}% of the feet span; need >=90%`,
    )
  }

  const rowMeans: number[] = []
  for (let y = bandTop; y <= bandBottom; y += 1) {
    let rowSum = 0
    let rowCount = 0
    for (let x = feetMinX; x <= feetMaxX; x += 1) {
      const offset = (y * width + x) * 4
      rowSum += luminance(background, offset)
      rowCount += 1
    }
    rowMeans.push(rowCount === 0 ? 0 : rowSum / rowCount)
  }
  let maxGroundStep = 0
  for (let index = 1; index < rowMeans.length; index += 1) {
    maxGroundStep = Math.max(
      maxGroundStep,
      Math.abs((rowMeans[index] ?? 0) - (rowMeans[index - 1] ?? 0)),
    )
  }
  if (maxGroundStep > 40) {
    problems.push(
      `ground patch under the feet is discontinuous (row luminance step ${maxGroundStep.toFixed(1)}/255)`,
    )
  }

  return {
    feetBottomFraction,
    shadowPresence,
    shadowCoverage,
    maxGroundStep,
    problems,
  }
}

export interface ViewportEvidence {
  readonly viewport: string
  readonly visiblePath: string
  readonly hiddenPath: string
  readonly contactSheetPath: string
  readonly runtimeYawDegrees: number
  readonly animation: {
    readonly frozenAtZero: boolean
    readonly pausedStateRecorded: boolean
    readonly changedRatio: number
    readonly modelPixels: number
  } | null
  readonly ground: GroundEvaluation | null
  readonly problems: readonly string[]
}

export interface CompositionReport {
  readonly id: string
  readonly run: string
  readonly automatedPass: boolean
  readonly expectedYawDegrees: number
  readonly viewports: readonly ViewportEvidence[]
}

async function freezeClock(page: Page, seconds: number): Promise<boolean> {
  return page.evaluate<boolean>(
    `document.querySelector('.viewer-canvas')?.__museumReviewSetAnimationTime?.(${seconds}) ?? false`,
  )
}

async function waitForCompositionSettled(page: Page): Promise<void> {
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

export interface CompositionRunResult {
  readonly report: CompositionReport
  readonly exitCode: 0 | 1
}

export async function runComposition(
  loaded: LoadedProfile,
): Promise<CompositionRunResult> {
  const { profile, candidateDir } = loaded
  const reviewPackage = join(
    repositoryRoot,
    'src/review/animals',
    profile.id,
    'package.ts',
  )
  if (!(await pathExists(reviewPackage))) {
    throw new Error(
      `review draft not registered for ${profile.id}; run 'review prepare' first`,
    )
  }

  const outputRoot = join(candidateDir, 'qa/composition')
  await mkdir(outputRoot, { recursive: true })

  let server: ViteDevServer | undefined
  const browser = await chromium.launch({ headless: true })
  const viewports: ViewportEvidence[] = []

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
    for (const viewport of COMPOSITION_VIEWPORTS) {
      const problems: string[] = []
      const evidenceDir = join(outputRoot, viewport.label)
      await mkdir(evidenceDir, { recursive: true })

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await page.goto(`${origin}?animal=${encodeURIComponent(profile.id)}`, {
        waitUntil: 'domcontentloaded',
      })
      await page.waitForFunction(
        (expectedId) =>
          document
            .querySelector('#museum-experience')
            ?.getAttribute('data-ready-animal-id') === expectedId,
        profile.id,
        { timeout: 60_000 },
      )

      // Deterministic runtime yaw proof: the canvas carries the full
      // presentation signature, which includes initialYawDegrees.
      const signatureText = await page
        .locator('.viewer-canvas')
        .getAttribute('data-preview-presentation-signature')
      if (!signatureText) {
        throw new Error(`${profile.id}: renderer exposed no presentation signature`)
      }
      const signature = JSON.parse(signatureText) as {
        presentation: { initialYawDegrees: number }
      }
      const runtimeYaw = signature.presentation.initialYawDegrees
      if (runtimeYaw !== profile.presentation.initialYawDegrees) {
        problems.push(
          `runtime initial yaw ${runtimeYaw} != profile ${profile.presentation.initialYawDegrees}`,
        )
      }

      // Freeze the review clock at exactly 0 s and capture the model-only frame.
      const frozenAtZero = await freezeClock(page, 0)
      if (!frozenAtZero) {
        throw new Error(`${profile.id}: review animation clock hook unavailable`)
      }
      const pausedAtZero = await page.evaluate<boolean>(
        `document.querySelector('.viewer-canvas')?.dataset.animationPaused === 'true' && document.querySelector('.viewer-canvas')?.dataset.reviewAnimationTime === '0'`,
      )
      await waitForCompositionSettled(page)

      // All captures share one integer clip box so pixel comparisons align.
      const viewportLocator = page.locator('.model-viewport')
      const regionBox = await viewportLocator.boundingBox()
      if (!regionBox) {
        throw new Error(`${profile.id}: model viewport has no layout box`)
      }
      const clip = {
        x: Math.floor(regionBox.x),
        y: Math.floor(regionBox.y),
        width: Math.round(regionBox.width),
        height: Math.round(regionBox.height),
      }

      const isolateStyle = await page.addStyleTag({ content: ISOLATE_MODEL_STYLE })
      const frameZero = await rawFrame(
        await page.screenshot({
          animations: 'disabled',
          clip,
          omitBackground: true,
          type: 'png',
        }),
      )

      let animation: ViewportEvidence['animation'] = null
      if (profile.model.animated) {
        const frozenAtTwo = await freezeClock(page, 2)
        const pausedAtTwo = await page.evaluate<boolean>(
          `document.querySelector('.viewer-canvas')?.dataset.animationPaused === 'true' && document.querySelector('.viewer-canvas')?.dataset.reviewAnimationTime === '2'`,
        )
        await waitForCompositionSettled(page)
        const frameTwo = await rawFrame(
          await page.screenshot({
            animations: 'disabled',
            clip,
            omitBackground: true,
            type: 'png',
          }),
        )
        await writeFile(join(evidenceDir, 'model-0s.png'), await sharp(frameZero.data, { raw: { width: frameZero.width, height: frameZero.height, channels: 4 } }).png().toBuffer())
        await writeFile(join(evidenceDir, 'model-2s.png'), await sharp(frameTwo.data, { raw: { width: frameTwo.width, height: frameTwo.height, channels: 4 } }).png().toBuffer())
        const diff = measureAnimationPixelDiff(frameZero, frameTwo)
        if (!frozenAtTwo || !pausedAtTwo) {
          problems.push('the paused 2 s clock state was not recorded on the canvas')
        }
        if (diff.changedRatio < ANIMATION_MIN_CHANGED_RATIO) {
          problems.push(
            `0s/2s changed-pixel ratio ${(diff.changedRatio * 100).toFixed(2)}% < ${ANIMATION_MIN_CHANGED_RATIO * 100}% of measured model pixels`,
          )
        }
        animation = {
          frozenAtZero,
          pausedStateRecorded: pausedAtZero && pausedAtTwo,
          changedRatio: diff.changedRatio,
          modelPixels: diff.modelPixels,
        }
      }
      await isolateStyle.evaluate((element) => element.parentNode?.removeChild(element))

      // Paired canvas-visible / canvas-hidden captures of the same region.
      // The hidden capture blanks the whole UI, so both are clipped page
      // screenshots (element screenshots wait for visibility).
      const visiblePng = await page.screenshot({ clip, type: 'png' })
      const hideStyle = await page.addStyleTag({ content: HIDE_CANVAS_STYLE })
      const hiddenPng = await page.screenshot({ clip, type: 'png' })
      await hideStyle.evaluate((element) => element.parentNode?.removeChild(element))

      const visiblePath = join(evidenceDir, 'canvas-visible.png')
      const hiddenPath = join(evidenceDir, 'canvas-hidden.png')
      await writeFile(visiblePath, visiblePng)
      await writeFile(hiddenPath, hiddenPng)
      const contactSheetPath = join(evidenceDir, 'contact-sheet.png')
      await sharp({
        create: {
          width: clip.width * 2,
          height: clip.height,
          channels: 4,
          background: { r: 24, g: 24, b: 24, alpha: 1 },
        },
      })
        .composite([
          { input: visiblePng, left: 0, top: 0 },
          { input: hiddenPng, left: clip.width, top: 0 },
        ])
        .png()
        .toFile(contactSheetPath)

      let ground: GroundEvaluation | null = null
      if (profile.presentation.habitat === 'land') {
        ground = evaluateGroundContact(
          frameZero,
          await rawFrame(visiblePng),
          await rawFrame(hiddenPng),
        )
        problems.push(...ground.problems)
      }

      viewports.push({
        viewport: viewport.label,
        visiblePath,
        hiddenPath,
        contactSheetPath,
        runtimeYawDegrees: runtimeYaw,
        animation,
        ground,
        problems,
      })
    }
    await page.close()
  } finally {
    await browser.close()
    await server?.close()
  }

  const automatedPass = viewports.every((entry) => entry.problems.length === 0)
  const report: CompositionReport = {
    id: profile.id,
    run: profile.run,
    automatedPass,
    expectedYawDegrees: profile.presentation.initialYawDegrees,
    viewports,
  }
  await writeJsonFile(join(candidateDir, COMPOSITION_REPORT_PATH), report)
  return { report, exitCode: automatedPass ? 0 : 1 }
}
