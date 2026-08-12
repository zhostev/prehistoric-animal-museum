import { join } from 'node:path'

import {
  animalsRoot,
  hashDirectory,
  readJsonFile,
  toolsRoot,
  writeJsonFile,
  type FileFingerprintMap,
} from './files'
import { compareFileFingerprints } from './baseline'

export const goldenDirectory = join(toolsRoot, 'golden')

// Read-only golden samples pinned by the rebuilt contract.
export const GOLDEN_SAMPLE_IDS = [
  'maiasaura',
  'plesiosaurus',
  'megalodon',
] as const

export interface GoldenSample {
  readonly id: string
  readonly capturedAt: string
  readonly files: FileFingerprintMap
}

export function goldenSamplePath(id: string): string {
  return join(goldenDirectory, `${id}.json`)
}

export async function captureGoldenSample(id: string): Promise<void> {
  const sample: GoldenSample = {
    id,
    capturedAt: new Date().toISOString(),
    files: await hashDirectory(join(animalsRoot, id)),
  }
  await writeJsonFile(goldenSamplePath(id), sample)
}

export interface GoldenRegression {
  readonly ok: boolean
  readonly problems: readonly string[]
}

export async function regressGoldenSample(id: string): Promise<GoldenRegression> {
  const recorded = (await readJsonFile(goldenSamplePath(id))) as GoldenSample
  const current = await hashDirectory(join(animalsRoot, id))
  const problems = compareFileFingerprints(recorded.files, current).map(
    (problem) => `${id}/${problem}`,
  )
  return { ok: problems.length === 0, problems }
}
