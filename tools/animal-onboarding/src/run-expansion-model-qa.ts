import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

interface Catalog {
  run: string
  animals: Array<{ id: string }>
}

const root = resolve(dirname(new URL(import.meta.url).pathname), '../../..')
const catalogPath = join(root, 'tools/animal-onboarding/expansion-100.json')
const blenderPath = join(root, '../.runtime/blender/blender-4.5.12-linux-x64/blender')
const normalizer = join(root, 'tools/animal-onboarding/blender/normalize_animal.py')

function run(command: string, args: string[], logPath: string): Promise<number> {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, { cwd: root })
    const chunks: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk))
    child.on('exit', async (code) => {
      await writeFile(logPath, Buffer.concat(chunks))
      resolvePromise(code ?? 1)
    })
  })
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8')) as Catalog
  const requested = process.argv.slice(2)
  const ids = requested.length ? requested : catalog.animals.map((animal) => animal.id)
  const runRoot = join(root, 'assets/candidates', catalog.run)
  const reportDir = join(runRoot, 'batch-reports')
  await mkdir(reportDir, { recursive: true })
  const results: Array<{ id: string; normalize: number; qa: number }> = []
  for (const [index, id] of ids.entries()) {
    const profile = join(runRoot, id, 'profile.json')
    process.stdout.write(`[${index + 1}/${ids.length}] ${id}: normalize `)
    const normalize = await run(
      blenderPath,
      ['--background', '--factory-startup', '--python', normalizer, '--', '--profile', profile],
      join(reportDir, `${id}.normalize.log`),
    )
    let qa = 1
    if (normalize === 0) {
      process.stdout.write('pass, qa ')
      qa = await run(
        process.execPath,
        ['--import', 'tsx', 'tools/animal-onboarding/src/cli.ts', 'qa', profile, '--model-only', '--autofix'],
        join(reportDir, `${id}.qa.log`),
      )
    } else {
      process.stdout.write('FAIL, qa skipped ')
    }
    console.log(qa === 0 ? 'pass' : 'FAIL')
    results.push({ id, normalize, qa })
  }
  const summary = {
    run: catalog.run,
    requested: ids.length,
    passed: results.filter((item) => item.normalize === 0 && item.qa === 0).length,
    failed: results.filter((item) => item.normalize !== 0 || item.qa !== 0),
    results,
  }
  await writeFile(join(reportDir, 'model-qa-summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
  console.log(JSON.stringify({ requested: summary.requested, passed: summary.passed, failed: summary.failed.length }))
  process.exitCode = summary.failed.length ? 1 : 0
}

await main()
