import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { mainCollection } from '../../../../src/content/collections/main'
import {
  animalsRoot,
  hashDirectory,
  listPackageDirectoryNames,
  readJsonFile,
  toolsRoot,
  writeJsonFile,
  type FileFingerprintMap,
} from './files'

export const baselinePath = join(toolsRoot, 'baseline.json')
const COLLECTION_PATH = join(
  toolsRoot,
  '../../src/content/collections/main.ts',
)

// Reads the collection ids straight from disk. captureBaseline runs in the
// same process as promote-batch, where the static mainCollection import was
// evaluated before the collection append and would record the stale 18-id
// list instead of the promoted collection.
async function readCollectionIdsFromDisk(): Promise<string[]> {
  const text = await readFile(COLLECTION_PATH, 'utf8')
  const arrayMatch = /animalIds:\s*\[([\s\S]*?)\n  \]/.exec(text)
  if (arrayMatch === null) {
    throw new Error('cannot parse animalIds from the main collection module')
  }
  const arrayBody = arrayMatch[1]
  if (arrayBody === undefined) {
    throw new Error('cannot parse animalIds from the main collection module')
  }
  return [...arrayBody.matchAll(/'([a-z0-9-]+)'/g)].map(
    (match) => match[1] ?? '',
  )
}

// The immutable original-12 production set, per the rebuilt contract. Later
// additions (rhamphorhynchus, tupandactylus, sauropelta, meganeura,
// dilophosaurus, mosasaurus) are interleaved in display order, so the rule is
// enforced as this recorded set plus exact recorded collection order.
export const ORIGINAL_12_IDS = [
  'stegosaurus',
  'pteranodon',
  'pachycephalosaurus',
  'ichthyosaur',
  'tyrannosaurus-rex',
  'triceratops',
  'apatosaurus',
  'plesiosaurus',
  'gigantoraptor',
  'mammoth',
  'megalodon',
  'maiasaura',
] as const

export interface Baseline {
  readonly capturedAt: string
  readonly collection: readonly string[]
  readonly originalIds: readonly string[]
  readonly packages: Readonly<Record<string, FileFingerprintMap>>
}

// Pure comparison of two fingerprint maps: reports changed, removed and added
// paths, sorted for deterministic output. Exported for unit tests.
export function compareFileFingerprints(
  recorded: FileFingerprintMap,
  current: FileFingerprintMap,
): string[] {
  const problems: string[] = []
  for (const path of Object.keys(recorded)) {
    const before = recorded[path]
    const after = current[path]
    if (!before) {
      continue
    }
    if (!after) {
      problems.push(`removed: ${path}`)
    } else if (after.sha256 !== before.sha256 || after.bytes !== before.bytes) {
      problems.push(`changed: ${path}`)
    }
  }
  for (const path of Object.keys(current)) {
    if (!(path in recorded)) {
      problems.push(`added: ${path}`)
    }
  }
  return problems.sort()
}

// Pure collection agreement check: (a) the set of package directories equals
// the collection id set and (b) the collection order equals the recorded
// list. Exported for unit tests.
export function verifyCollectionAgreement(
  recorded: Baseline,
  collectionIds: readonly string[],
  directoryNames: readonly string[],
): string[] {
  const problems: string[] = []

  const directorySet = new Set(directoryNames)
  const collectionSet = new Set(collectionIds)
  for (const name of directoryNames) {
    if (!collectionSet.has(name)) {
      problems.push(`package directory not in collection: ${name}`)
    }
  }
  for (const id of collectionIds) {
    if (!directorySet.has(id)) {
      problems.push(`collection id has no package directory: ${id}`)
    }
  }

  if (collectionIds.length !== recorded.collection.length) {
    problems.push(
      `collection length changed: recorded ${recorded.collection.length}, current ${collectionIds.length}`,
    )
  } else {
    for (const [index, recordedId] of recorded.collection.entries()) {
      const currentId = collectionIds[index]
      if (currentId !== recordedId) {
        problems.push(
          `collection order changed at index ${index}: recorded ${recordedId}, current ${currentId ?? '<missing>'}`,
        )
      }
    }
  }

  return problems.sort()
}

// Pure original-12 hash check against already-collected current fingerprints.
export function verifyOriginalPackages(
  recorded: Baseline,
  currentPackages: Readonly<Record<string, FileFingerprintMap>>,
): string[] {
  const problems: string[] = []
  for (const id of recorded.originalIds) {
    const recordedFiles = recorded.packages[id]
    const currentFiles = currentPackages[id]
    if (!recordedFiles) {
      problems.push(`baseline has no recorded package for original id: ${id}`)
      continue
    }
    if (!currentFiles) {
      problems.push(`original package missing on disk: ${id}`)
      continue
    }
    for (const problem of compareFileFingerprints(recordedFiles, currentFiles)) {
      problems.push(`${id}/${problem}`)
    }
  }
  return problems.sort()
}

export async function captureBaseline(): Promise<void> {
  const packages: Record<string, FileFingerprintMap> = {}
  for (const id of ORIGINAL_12_IDS) {
    packages[id] = await hashDirectory(join(animalsRoot, id))
  }

  const baseline: Baseline = {
    capturedAt: new Date().toISOString(),
    collection: await readCollectionIdsFromDisk(),
    originalIds: [...ORIGINAL_12_IDS],
    packages,
  }
  await writeJsonFile(baselinePath, baseline)
}

export interface BaselineVerification {
  readonly ok: boolean
  readonly problems: readonly string[]
}

export async function verifyBaseline(): Promise<BaselineVerification> {
  const recorded = (await readJsonFile(baselinePath)) as Baseline
  const directoryNames = await listPackageDirectoryNames()
  const collectionIds = [...mainCollection.animalIds]

  const currentPackages: Record<string, FileFingerprintMap> = {}
  for (const id of recorded.originalIds) {
    if (directoryNames.includes(id)) {
      currentPackages[id] = await hashDirectory(join(animalsRoot, id))
    }
  }

  const problems = [
    ...verifyCollectionAgreement(recorded, collectionIds, directoryNames),
    ...verifyOriginalPackages(recorded, currentPackages),
  ]
  return { ok: problems.length === 0, problems }
}
