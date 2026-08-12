import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface FileFingerprint {
  readonly sha256: string
  readonly bytes: number
}

export type FileFingerprintMap = Record<string, FileFingerprint>

// tools/animal-onboarding/src/lib/files.ts -> repository root is four levels up.
export const repositoryRoot = fileURLToPath(new URL('../../../../', import.meta.url))
export const toolsRoot = join(repositoryRoot, 'tools/animal-onboarding')
export const animalsRoot = join(repositoryRoot, 'src/content/animals')

export async function hashFile(filePath: string): Promise<FileFingerprint> {
  const content = await readFile(filePath)
  return {
    sha256: createHash('sha256').update(content).digest('hex'),
    bytes: content.length,
  }
}

// sha256 + bytes of every file under directoryPath, keyed by sorted
// POSIX-style relative path so the map is stable across platforms.
export async function hashDirectory(
  directoryPath: string,
): Promise<FileFingerprintMap> {
  const absoluteFiles: string[] = []

  async function walk(current: string): Promise<void> {
    const children = await readdir(current, { withFileTypes: true })
    for (const child of children) {
      const childPath = join(current, child.name)
      if (child.isDirectory()) {
        await walk(childPath)
      } else if (child.isFile()) {
        absoluteFiles.push(childPath)
      }
    }
  }

  await walk(directoryPath)

  const relativePaths = absoluteFiles
    .map((filePath) => relative(directoryPath, filePath).split(sep).join('/'))
    .sort()

  const fingerprints: FileFingerprintMap = {}
  for (const relativePath of relativePaths) {
    fingerprints[relativePath] = await hashFile(
      join(directoryPath, ...relativePath.split('/')),
    )
  }
  return fingerprints
}

// Same directory discovery as scripts/content-data.ts loadAnimalDefinitions:
// direct subdirectories of src/content/animals, sorted.
export async function listPackageDirectoryNames(): Promise<string[]> {
  const entries = await readdir(animalsRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

export async function readJsonFile(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, 'utf8')) as unknown
}

export async function writeJsonFile(
  filePath: string,
  value: unknown,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
