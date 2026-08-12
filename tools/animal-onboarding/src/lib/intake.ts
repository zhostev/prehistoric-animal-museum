// Intake scoring per docs/specification/animal-onboarding-standard.md §4.
//
// Hard gates (decision = reject) run first; any single failure rejects the
// candidate. Soft signals only affect the numeric score, never the decision.
// Candidates needing a human decision are held. Everything is a pure function
// of the intake document and the production id set, so scoring is
// deterministic.

// Mirrors publicationLicenseAllowlist in scripts/content-validation.ts. Keep
// the two lists in sync; the validator is the authority at publication time.
export const PUBLICATION_LICENSE_ALLOWLIST: ReadonlySet<string> = new Set([
  'CC0-1.0',
  'CC-BY-4.0',
  'CC-BY-NC-SA-4.0',
  'LicenseRef-Public-Domain',
  'LicenseRef-OpenAI-Output',
  'MIT',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'Apache-2.0',
])

export type IntakeDecision = 'advance' | 'hold' | 'reject'

export interface CandidateEvaluation {
  readonly id: string
  readonly name: string
  readonly decision: IntakeDecision
  readonly score: number
  readonly reasons: readonly string[]
}

export interface IntakeRanking {
  readonly source: string
  readonly recordedOn: string | null
  readonly productionIds: readonly string[]
  readonly summary: {
    readonly advance: number
    readonly hold: number
    readonly reject: number
  }
  readonly decisions: readonly CandidateEvaluation[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null
}

// Simple deterministic habitat inference from free-text notes/name. The
// existing collection is land-dominated, so non-land habitats earn diversity
// points (see scoreSignals).
function inferHabitat(text: string): 'land' | 'air' | 'water' {
  if (/marine|ocean|aquatic|\bsea\b|water/i.test(text)) {
    return 'water'
  }
  if (/flying|flight|winged|\bair\b/i.test(text)) {
    return 'air'
  }
  return 'land'
}

// Soft-signal weights (score only, never the decision):
//   +30  CC0-1.0 / LicenseRef-Public-Domain (no attribution burden)
//   +15  any other allowlisted (attribution) license
//   +20  animated source (animated field starts with "yes")
//   +10  GLB-native format (format field starts with "GLB")
//   +10  habitat diversity vs the land-dominated existing collection
function scoreSignals(fields: {
  license: string | null
  animated: string | null
  format: string | null
  habitatText: string
}): { score: number; signals: string[] } {
  let score = 0
  const signals: string[] = []

  if (
    fields.license === 'CC0-1.0' ||
    fields.license === 'LicenseRef-Public-Domain'
  ) {
    score += 30
    signals.push('public-domain dedication license (+30)')
  } else if (fields.license !== null && PUBLICATION_LICENSE_ALLOWLIST.has(fields.license)) {
    score += 15
    signals.push('allowlisted attribution license (+15)')
  }

  if (fields.animated !== null && /^yes/i.test(fields.animated)) {
    score += 20
    signals.push('animated source (+20)')
  }

  if (fields.format !== null && /^GLB\b/i.test(fields.format)) {
    score += 10
    signals.push('GLB-native format (+10)')
  }

  const habitat = inferHabitat(fields.habitatText)
  if (habitat !== 'land') {
    score += 10
    signals.push(`adds ${habitat} habitat diversity (+10)`)
  }

  return { score, signals }
}

// Evaluate one raw candidate record. Reject reasons always win over hold
// reasons; both are collected for the decision report.
export function evaluateCandidate(
  raw: unknown,
  productionIds: ReadonlySet<string>,
): CandidateEvaluation {
  const record = isRecord(raw) ? raw : {}
  const id = nonEmptyString(record.id) ?? '<missing id>'
  const name = nonEmptyString(record.name) ?? id
  const rejectReasons: string[] = []
  const holdReasons: string[] = []

  // Hard gate: required verifiable fields.
  const author = nonEmptyString(record.author)
  const sourcePage = nonEmptyString(record.sourcePage)
  const license = nonEmptyString(record.license)
  const downloadURL = nonEmptyString(record.downloadURL)
  const redistribution = nonEmptyString(record.redistribution)
  if (author === null) {
    rejectReasons.push('missing or unverifiable author')
  }
  if (sourcePage === null) {
    rejectReasons.push('missing or unverifiable source page')
  }
  if (license === null) {
    rejectReasons.push('missing or unverifiable license')
  }
  if (downloadURL === null) {
    rejectReasons.push('missing or unverifiable download URL')
  }

  // Hard gate: publication allowlist and redistribution terms.
  if (license !== null && !PUBLICATION_LICENSE_ALLOWLIST.has(license)) {
    rejectReasons.push(`license ${license} is not in the publication allowlist`)
  }
  if (redistribution === null) {
    rejectReasons.push('missing or unverifiable redistribution terms')
  } else if (/not allowed|non-?redistributable|prohibit/i.test(redistribution)) {
    rejectReasons.push('license is explicitly non-redistributable')
  }

  // Hard gate: no duplicates of production ids.
  if (nonEmptyString(record.id) !== null && productionIds.has(id)) {
    rejectReasons.push(`id ${id} already exists in the production collection`)
  }

  // Hard gate: scientific identity must be present.
  if (nonEmptyString(record.scientificName) === null) {
    rejectReasons.push('scientific identity absent')
  }

  // Hold: skeleton-only presentation needs an owner decision.
  const notes = nonEmptyString(record.notes) ?? ''
  if (/skeleton/i.test(notes) || /skeleton/i.test(name)) {
    holdReasons.push('skeleton-only presentation needs an owner decision')
  }

  // Hold: notes flagging style/aesthetic/visual review need an owner decision.
  // The word "review" must co-occur with the style cue, so a positive note
  // like "matches museum art style" does not trigger a hold.
  const notesFlagReview = /review/i.test(notes)
  if (notesFlagReview && /art[- ]?style|aesthetic|visual/i.test(notes)) {
    holdReasons.push('notes flag a style/aesthetic review for the owner')
  }

  // Hold: allowlisted ShareAlike (CC-BY-NC-SA-4.0) carries compliance caveats
  // worth a human look. Non-allowlisted ShareAlike (e.g. CC-BY-SA-3.0) already
  // rejected above via the allowlist gate.
  if (license === 'CC-BY-NC-SA-4.0') {
    holdReasons.push('ShareAlike license caveat needs an owner decision')
  }

  const { score, signals } = scoreSignals({
    license,
    animated: nonEmptyString(record.animated),
    format: nonEmptyString(record.format),
    habitatText: `${name} ${notes}`,
  })

  if (rejectReasons.length > 0) {
    return { id, name, decision: 'reject', score, reasons: rejectReasons.sort() }
  }
  if (holdReasons.length > 0) {
    return {
      id,
      name,
      decision: 'hold',
      score,
      reasons: [...holdReasons.sort(), ...signals],
    }
  }
  return {
    id,
    name,
    decision: 'advance',
    score,
    reasons: ['passes every hard gate', ...signals],
  }
}

// Entries already rejected while recording the intake are carried into the
// ranking as rejects with their recorded reason; they are never re-scored.
function evaluatePreRejected(raw: unknown): CandidateEvaluation {
  const record = isRecord(raw) ? raw : {}
  const id = nonEmptyString(record.id) ?? '<missing id>'
  const reason = nonEmptyString(record.reason) ?? 'rejected during intake'
  return {
    id,
    name: id,
    decision: 'reject',
    score: 0,
    reasons: [`rejected during intake recording: ${reason}`],
  }
}

// Decision ordering for the ranking: advance first, then hold, then reject;
// within a group by descending score, then ascending id for determinism.
const decisionRank: Record<IntakeDecision, number> = {
  advance: 0,
  hold: 1,
  reject: 2,
}

export function scoreIntake(
  document: unknown,
  productionIds: readonly string[],
  source: string,
): IntakeRanking {
  const record = isRecord(document) ? document : {}
  const productionIdSet = new Set(productionIds)
  const candidates = Array.isArray(record.candidates) ? record.candidates : []
  const preRejected = Array.isArray(record.rejectedDuringIntake)
    ? record.rejectedDuringIntake
    : []

  const decisions = [
    ...candidates.map((candidate) => evaluateCandidate(candidate, productionIdSet)),
    ...preRejected.map((entry) => evaluatePreRejected(entry)),
  ].sort((a, b) => {
    if (decisionRank[a.decision] !== decisionRank[b.decision]) {
      return decisionRank[a.decision] - decisionRank[b.decision]
    }
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return a.id.localeCompare(b.id)
  })

  const summary = { advance: 0, hold: 0, reject: 0 }
  for (const decision of decisions) {
    summary[decision.decision] += 1
  }

  return {
    source,
    recordedOn: nonEmptyString(record.recordedOn),
    productionIds: [...productionIds],
    summary,
    decisions,
  }
}
