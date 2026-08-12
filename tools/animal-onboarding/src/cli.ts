// Animal onboarding CLI. Contract: docs/specification/animal-onboarding-standard.md.
//
//   node --import tsx tools/animal-onboarding/src/cli.ts <group> <action> [args]
//
// Exit codes: 0 pass · 1 automated hard gate failed · 2 invalid invocation ·
// 3 required human-only approval absent ·
// 4 baseline, golden sample or promotion target changed.
//
// Adding a subcommand is one entry in the `commands` table below. Groups with
// a '*' handler take the first positional argument as the action (profiles).

import { access } from 'node:fs/promises'
import { join } from 'node:path'

import { mainCollection } from '../../../src/content/collections/main'
import {
  APPROVAL_RECORD_FILE,
  applyApprovalFlips,
  evaluateApprovalReadiness,
  hashApprovalRecord,
  verifyApprovalRecord,
  type ApprovalRecord,
} from './lib/approvals'
import {
  baselinePath,
  captureBaseline,
  verifyBaseline,
} from './lib/baseline'
import { runComposition } from './lib/composition'
import { runDerivatives } from './lib/derivatives'
import {
  hashFile,
  readJsonFile,
  repositoryRoot,
  writeJsonFile,
} from './lib/files'
import {
  GOLDEN_SAMPLE_IDS,
  captureGoldenSample,
  goldenSamplePath,
  regressGoldenSample,
} from './lib/golden'
import { scoreIntake } from './lib/intake'
import { loadProfile, pathExists as profilePathExists, type LoadedProfile } from './lib/profile'
import {
  buildPromotionPlan,
  stageAndInstall,
  validateForPromotion,
  verifyPromotion,
  type BatchResult,
} from './lib/promote'
import { runQa } from './lib/qa'
import {
  checkReviewManifestCurrent,
  prepareReviewDraft,
} from './lib/review-prepare'

const EXIT_PASS = 0
const EXIT_GATE_FAILED = 1
const EXIT_INVALID_INVOCATION = 2
const EXIT_APPROVAL_ABSENT = 3
const EXIT_BASELINE_CHANGED = 4

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function baselineCapture(): Promise<number> {
  if (await pathExists(baselinePath)) {
    console.error(`baseline capture: ${baselinePath} already exists; refusing to overwrite`)
    return EXIT_BASELINE_CHANGED
  }
  await captureBaseline()
  console.log(`baseline capture: wrote ${baselinePath}`)
  return EXIT_PASS
}

async function baselineVerify(): Promise<number> {
  if (!(await pathExists(baselinePath))) {
    console.error(`baseline verify: ${baselinePath} is missing; run baseline capture first`)
    return EXIT_INVALID_INVOCATION
  }
  const result = await verifyBaseline()
  if (!result.ok) {
    console.error('baseline verify: FAILED')
    for (const problem of result.problems) {
      console.error(`  ${problem}`)
    }
    return EXIT_BASELINE_CHANGED
  }
  console.log('baseline verify: OK')
  return EXIT_PASS
}

async function goldenCapture(): Promise<number> {
  const existing: string[] = []
  for (const id of GOLDEN_SAMPLE_IDS) {
    if (await pathExists(goldenSamplePath(id))) {
      existing.push(id)
    }
  }
  if (existing.length > 0) {
    console.error(
      `golden capture: golden files already exist for ${existing.join(', ')}; refusing to overwrite`,
    )
    return EXIT_BASELINE_CHANGED
  }
  for (const id of GOLDEN_SAMPLE_IDS) {
    await captureGoldenSample(id)
    console.log(`golden capture: wrote ${goldenSamplePath(id)}`)
  }
  return EXIT_PASS
}

async function goldenRegress(): Promise<number> {
  const problems: string[] = []
  for (const id of GOLDEN_SAMPLE_IDS) {
    if (!(await pathExists(goldenSamplePath(id)))) {
      console.error(`golden regress: ${goldenSamplePath(id)} is missing; run golden capture first`)
      return EXIT_INVALID_INVOCATION
    }
    const result = await regressGoldenSample(id)
    problems.push(...result.problems)
  }
  if (problems.length > 0) {
    console.error('golden regress: FAILED')
    for (const problem of problems.sort()) {
      console.error(`  ${problem}`)
    }
    return EXIT_BASELINE_CHANGED
  }
  console.log('golden regress: OK')
  return EXIT_PASS
}

async function intakeScore(args: readonly string[]): Promise<number> {
  const candidatesPath = args[0]
  const outFlagIndex = args.indexOf('--out')
  const outPath = outFlagIndex === -1 ? undefined : args[outFlagIndex + 1]
  if (candidatesPath === undefined || candidatesPath.startsWith('--') || outPath === undefined) {
    console.error('usage: intake score <candidates.json> --out <ranking.json>')
    return EXIT_INVALID_INVOCATION
  }

  const resolvedCandidates = join(repositoryRoot, candidatesPath)
  const resolvedOut = join(repositoryRoot, outPath)

  let document: unknown
  try {
    document = await readJsonFile(resolvedCandidates)
  } catch (error) {
    console.error(`intake score: cannot read ${candidatesPath}: ${String(error)}`)
    return EXIT_INVALID_INVOCATION
  }

  const ranking = scoreIntake(document, [...mainCollection.animalIds], candidatesPath)
  await writeJsonFile(resolvedOut, ranking)

  for (const decision of ranking.decisions) {
    console.log(
      `${decision.decision.padEnd(7)} ${String(decision.score).padStart(3)}  ${decision.id}`,
    )
  }
  console.log(
    `intake score: ${ranking.summary.advance} advance, ${ranking.summary.hold} hold, ${ranking.summary.reject} reject -> ${outPath}`,
  )

  return ranking.summary.hold === 0 && ranking.summary.reject === 0
    ? EXIT_PASS
    : EXIT_GATE_FAILED
}

async function loadProfilesOrNull(
  arguments_: readonly string[],
): Promise<LoadedProfile[] | null> {
  const loadeds: LoadedProfile[] = []
  for (const argument of arguments_) {
    try {
      loadeds.push(await loadProfile(argument))
    } catch (error) {
      console.error(String(error))
      return null
    }
  }
  return loadeds
}

function flagValue(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag)
  return index === -1 ? undefined : args[index + 1]
}

function positionalArgs(args: readonly string[]): string[] {
  const positionals: string[] = []
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index] ?? ''
    if (argument.startsWith('--')) {
      index += 1 // skip the flag's value slot; boolean flags are filtered below
      if (['--model-only', '--autofix', '--dry-run'].includes(argument)) {
        index -= 1
      }
      continue
    }
    positionals.push(argument)
  }
  return positionals
}

async function qaCommand(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined) {
    console.error('usage: qa <profile.json> [--model-only] [--autofix]')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const { report, exitCode } = await runQa(loaded, {
    modelOnly: args.includes('--model-only'),
    autofix: args.includes('--autofix'),
  })
  for (const gate of report.gates) {
    console.log(`${gate.status.padEnd(7)} ${gate.id}: ${gate.detail}`)
  }
  for (const warning of report.warnings) {
    console.log(`warning ${warning}`)
  }
  console.log(
    `qa ${report.id}: automatedPass=${report.automatedPass} -> qa/qa-report.json`,
  )
  return exitCode
}

async function compositionCommand(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined) {
    console.error('usage: composition <profile.json>')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const { report, exitCode } = await runComposition(loaded)
  for (const viewport of report.viewports) {
    const animation = viewport.animation
    const ratio =
      animation === null ? 'n/a' : `${(animation.changedRatio * 100).toFixed(2)}%`
    const ground = viewport.ground
    const shadow =
      ground === null ? 'n/a' : `${(ground.shadowCoverage * 100).toFixed(1)}%`
    console.log(
      `${viewport.problems.length === 0 ? 'pass' : 'FAIL'} ${viewport.viewport}: yaw=${viewport.runtimeYawDegrees} 0s/2s=${ratio} shadow=${shadow}`,
    )
    for (const problem of viewport.problems) {
      console.log(`  ${problem}`)
    }
  }
  console.log(
    `composition ${report.id}: automatedPass=${report.automatedPass} -> qa/composition-report.json`,
  )
  return exitCode
}

async function derivativesCommand(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined) {
    console.error('usage: derivatives <profile.json>')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const { report, exitCode } = await runDerivatives(loaded)
  const records = [
    report.backgrounds.landscape,
    report.backgrounds.portrait,
    report.posters.landscape,
    report.posters.portrait,
    report.posters.thumbnail,
  ]
  for (const record of records) {
    console.log(
      `  ${record.width}x${record.height} ${String(record.bytes).padStart(8)} B  ${record.path}`,
    )
  }
  console.log(
    `  background pair: ${report.backgrounds.pairBytes} B (${report.backgrounds.budget})`,
  )
  console.log(
    `  poster center model ratio: landscape=${(report.posters.landscape.centerModelRatio * 100).toFixed(2)}% portrait=${(report.posters.portrait.centerModelRatio * 100).toFixed(2)}%`,
  )
  for (const problem of report.problems) {
    console.error(`  gate: ${problem}`)
  }
  console.log(
    `derivatives ${report.id}: ${report.problems.length === 0 ? 'automated pass' : 'FAILED'} -> qa/derivatives-log.json`,
  )
  return exitCode
}

async function reviewPrepare(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined) {
    console.error('usage: review prepare <profile.json>')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const qaReportPath = join(loaded.candidateDir, 'qa/qa-report.json')
  if (!(await profilePathExists(qaReportPath))) {
    console.error('review prepare: qa report missing; run qa first')
    return EXIT_GATE_FAILED
  }
  const qaReport = (await readJsonFile(qaReportPath)) as { automatedPass: boolean }
  if (!qaReport.automatedPass) {
    console.error('review prepare: qa report has failing gates')
    return EXIT_GATE_FAILED
  }
  const manifest = await prepareReviewDraft(loaded)
  console.log(
    `review prepare ${loaded.profile.id}: draft registered on the local-review allowlist`,
  )
  console.log(
    `  narration: zh-CN=${manifest.narrationReady.zhCN ? 'ready' : 'pending'} en=${manifest.narrationReady.en ? 'ready' : 'pending'}`,
  )
  const missing = Object.entries(manifest.registeredAssets)
    .filter(([, entry]) => 'missing' in entry)
    .map(([name]) => name)
  if (missing.length > 0) {
    console.log(`  assets pending generation: ${missing.join(', ')}`)
  }
  console.log('  -> qa/review-manifest.json')
  return EXIT_PASS
}

async function promoteDryRun(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined || !args.includes('--dry-run')) {
    console.error('usage: promote <profile.json> --dry-run')
    console.error('(real promotion runs only as promote-batch --collection main)')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const validation = await validateForPromotion(loaded)
  console.log(`promote --dry-run ${validation.id}: would install:`)
  for (const op of validation.plan.ops) {
    console.log(`  ${op.status.padEnd(8)} ${op.target}  <-  ${op.source}`)
  }
  console.log(`  append to collection main: ${validation.plan.collectionAppend.join(', ')}`)
  for (const problem of validation.deterministicProblems) {
    console.error(`  gate: ${problem}`)
  }
  if (validation.deterministicProblems.length > 0) {
    return EXIT_GATE_FAILED
  }
  if (validation.pendingHuman.length > 0) {
    console.log('  pending before promotion:')
    for (const pending of validation.pendingHuman) {
      console.log(`    ${pending}`)
    }
    return EXIT_APPROVAL_ABSENT
  }
  return EXIT_PASS
}

async function promoteVerifyCommand(args: readonly string[]): Promise<number> {
  const [profileArgument] = positionalArgs(args)
  if (profileArgument === undefined) {
    console.error('usage: promote verify <profile.json>')
    return EXIT_INVALID_INVOCATION
  }
  let loaded: LoadedProfile
  try {
    loaded = await loadProfile(profileArgument)
  } catch (error) {
    console.error(String(error))
    return EXIT_INVALID_INVOCATION
  }
  const result = await verifyPromotion(loaded)
  if (!result.promoted) {
    for (const problem of result.problems) {
      console.log(`  ${problem}`)
    }
    console.log(`promote verify ${result.id}: not promoted`)
    return EXIT_APPROVAL_ABSENT
  }
  console.log(`promote verify ${result.id}: package matches the staged manifest`)
  return EXIT_PASS
}

async function promoteBatch(args: readonly string[]): Promise<number> {
  const profileArguments = positionalArgs(args)
  const outPath = flagValue(args, '--out')
  const collection = flagValue(args, '--collection')
  const dryRun = args.includes('--dry-run')
  if (profileArguments.length === 0 || outPath === undefined) {
    console.error(
      'usage: promote-batch <profile.json...> [--dry-run] --collection main --out <result.json>',
    )
    return EXIT_INVALID_INVOCATION
  }
  if (!dryRun && collection !== 'main') {
    console.error('promote-batch: real promotion requires --collection main')
    return EXIT_INVALID_INVOCATION
  }
  const loadeds = await loadProfilesOrNull(profileArguments)
  if (loadeds === null) {
    return EXIT_INVALID_INVOCATION
  }

  const animals: BatchResult['animals'][number][] = []
  let gateFailures = 0
  const pending: string[] = []
  for (const loaded of loadeds) {
    const validation = await validateForPromotion(loaded)
    gateFailures += validation.deterministicProblems.length
    pending.push(
      ...validation.pendingHuman.map((entry) => `${loaded.profile.id}: ${entry}`),
    )
    animals.push({
      id: validation.id,
      status:
        validation.deterministicProblems.length > 0 || validation.pendingHuman.length > 0
          ? 'blocked'
          : 'planned',
      deterministicProblems: validation.deterministicProblems,
      pendingHuman: validation.pendingHuman,
      ops: validation.plan.ops,
    })
  }

  const plan = buildPromotionPlan(loadeds)
  const result: BatchResult = {
    dryRun,
    collection: collection ?? 'main',
    animals,
    collectionAppend: plan.collectionAppend,
    postSteps: plan.postSteps,
  }
  const resolvedOut = join(repositoryRoot, outPath)
  await writeJsonFile(resolvedOut, result)

  for (const animal of animals) {
    console.log(
      `${animal.status.padEnd(8)} ${animal.id} (${animal.ops.length} install ops)`,
    )
    for (const problem of animal.deterministicProblems) {
      console.error(`  gate: ${problem}`)
    }
  }
  console.log(
    `staging plan: ${plan.ops.length} file ops across ${loadeds.length} animal(s), one collection append (${plan.collectionAppend.join(', ')}), then ${plan.postSteps.join(' + ')}`,
  )
  console.log(`-> ${outPath}`)

  if (gateFailures > 0) {
    return EXIT_GATE_FAILED
  }
  if (pending.length > 0) {
    console.log('pending before promotion:')
    for (const entry of pending) {
      console.log(`  ${entry}`)
    }
    return EXIT_APPROVAL_ABSENT
  }
  if (dryRun) {
    return EXIT_PASS
  }

  // Real promotion: every profile needs a valid approval record.
  let approvalProblems = 0
  for (const loaded of loadeds) {
    const profileHash = await hashFile(loaded.profilePath)
    const verification = await verifyApprovalRecord(loaded, profileHash.sha256)
    if (!verification.valid) {
      approvalProblems += 1
      for (const problem of verification.problems) {
        console.error(`  ${loaded.profile.id}: ${problem}`)
      }
    }
  }
  if (approvalProblems > 0) {
    return EXIT_APPROVAL_ABSENT
  }

  try {
    const installed = await stageAndInstall(loadeds, { collection: collection ?? 'main' })
    await writeJsonFile(resolvedOut, installed)
    for (const animal of installed.animals) {
      console.log(`${animal.status} ${animal.id}`)
    }
    return EXIT_PASS
  } catch (error) {
    console.error(`promote-batch failed and rolled back: ${String(error)}`)
    return String(error).includes('promotion target changed')
      ? EXIT_BASELINE_CHANGED
      : EXIT_GATE_FAILED
  }
}

async function approvalRecord(args: readonly string[]): Promise<number> {
  const profileArguments = positionalArgs(args)
  const by = flagValue(args, '--by')
  const on = flagValue(args, '--on')
  const approveFlag = flagValue(args, '--approve')
  const approveCategories =
    approveFlag === undefined
      ? []
      : approveFlag.split(',').map((entry) => entry.trim()).filter(Boolean)
  if (profileArguments.length === 0) {
    console.error(
      'usage: approval record <profile.json...> --by <owner> --on <YYYY-MM-DD> --approve <category,...>',
    )
    return EXIT_INVALID_INVOCATION
  }
  const loadeds = await loadProfilesOrNull(profileArguments)
  if (loadeds === null) {
    return EXIT_INVALID_INVOCATION
  }

  let blocked = 0
  for (const loaded of loadeds) {
    const qaReportPath = join(loaded.candidateDir, 'qa/qa-report.json')
    const compositionReportPath = join(loaded.candidateDir, 'qa/composition-report.json')
    const qaReport = (await profilePathExists(qaReportPath))
      ? ((await readJsonFile(qaReportPath)) as { automatedPass: boolean })
      : null
    const compositionReport = (await profilePathExists(compositionReportPath))
      ? ((await readJsonFile(compositionReportPath)) as { automatedPass: boolean })
      : null
    const manifest = await checkReviewManifestCurrent(loaded)
    const narrationReady = {
      'zh-CN': await profilePathExists(
        join(loaded.candidateDir, ...loaded.profile.narration['zh-CN'].path.split('/')),
      ),
      en: await profilePathExists(
        join(loaded.candidateDir, ...loaded.profile.narration.en.path.split('/')),
      ),
    }
    const guard = evaluateApprovalReadiness({
      qaPassed: qaReport?.automatedPass === true,
      compositionPassed: compositionReport?.automatedPass === true,
      manifestCurrent: manifest.current,
      narrationReady,
      approveCategories,
      by,
      on,
    })
    if (!guard.ok) {
      blocked += 1
      console.error(`approval record ${loaded.profile.id}: refused`)
      for (const problem of guard.problems) {
        console.error(`  ${problem}`)
      }
      continue
    }

    const updated = applyApprovalFlips(loaded.profile, guard.flips)
    await writeJsonFile(loaded.profilePath, updated)
    const profileHash = await hashFile(loaded.profilePath)
    const categories = Object.entries(guard.flips)
      .filter(([, approved]) => approved)
      .map(([category]) => category as ApprovalRecord['categories'][number])
    const payload = {
      id: loaded.profile.id,
      run: loaded.profile.run,
      approvedBy: by ?? '',
      approvedOn: on ?? '',
      categories,
      profileSha256: profileHash.sha256,
    }
    const record: ApprovalRecord = {
      ...payload,
      sha256: hashApprovalRecord(payload),
    }
    await writeJsonFile(join(loaded.candidateDir, APPROVAL_RECORD_FILE), record)
    console.log(
      `approval record ${loaded.profile.id}: recorded ${record.categories.length} categories by ${record.approvedBy} on ${record.approvedOn}; rerun review prepare to rehash the manifest`,
    )
  }
  return blocked > 0 ? EXIT_APPROVAL_ABSENT : EXIT_PASS
}

type CommandHandler = (args: readonly string[]) => Promise<number>

const commands: Record<string, Record<string, CommandHandler>> = {
  approval: {
    record: approvalRecord,
  },
  baseline: {
    capture: () => baselineCapture(),
    verify: () => baselineVerify(),
  },
  composition: {
    '*': compositionCommand,
  },
  derivatives: {
    '*': derivativesCommand,
  },
  golden: {
    capture: () => goldenCapture(),
    regress: () => goldenRegress(),
  },
  intake: {
    score: intakeScore,
  },
  promote: {
    '*': promoteDryRun,
    verify: promoteVerifyCommand,
  },
  'promote-batch': {
    '*': promoteBatch,
  },
  qa: {
    '*': qaCommand,
  },
  review: {
    prepare: reviewPrepare,
  },
}

async function main(argv: readonly string[]): Promise<number> {
  const group = argv[0]
  const action = argv[1]
  const handlers = group === undefined ? undefined : commands[group]
  const wildcard =
    handlers !== undefined &&
    action !== undefined &&
    !(action in handlers) &&
    '*' in handlers
  const handler =
    handlers === undefined || action === undefined
      ? undefined
      : action in handlers
        ? handlers[action]
        : handlers['*']
  if (handler === undefined) {
    console.error('usage: cli.ts <group> <action> [args]')
    console.error('  baseline capture | baseline verify')
    console.error('  golden capture | golden regress')
    console.error('  intake score <candidates.json> --out <ranking.json>')
    console.error('  qa <profile.json> [--model-only] [--autofix]')
    console.error('  composition <profile.json>')
    console.error('  derivatives <profile.json>')
    console.error('  review prepare <profile.json>')
    console.error('  promote <profile.json> --dry-run')
    console.error('  promote-batch <profile.json...> [--dry-run] --collection main --out <result.json>')
    console.error('  approval record <profile.json...> --by <owner> --on <YYYY-MM-DD> --approve <categories>')
    console.error('  promote verify <profile.json>')
    return EXIT_INVALID_INVOCATION
  }
  return handler(argv.slice(wildcard ? 1 : 2))
}

try {
  process.exitCode = await main(process.argv.slice(2))
} catch (error) {
  // Unexpected failure: treat as an invalid invocation/profile, never a pass.
  console.error(`fatal: ${String(error)}`)
  process.exitCode = EXIT_INVALID_INVOCATION
}
