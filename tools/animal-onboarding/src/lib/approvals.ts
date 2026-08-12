import { createHash } from 'node:crypto'
import { join } from 'node:path'

import { readJsonFile, writeJsonFile } from './files'
import {
  APPROVAL_CATEGORIES,
  pathExists,
  type ApprovalCategory,
  type CandidateProfile,
  type HumanApprovals,
  type LoadedProfile,
} from './profile'

export const APPROVAL_RECORD_FILE = 'approval-record.json'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export interface ApprovalGuardInput {
  readonly qaPassed: boolean
  readonly compositionPassed: boolean
  readonly manifestCurrent: boolean
  readonly narrationReady: Readonly<Record<'zh-CN' | 'en', boolean>>
  readonly approveCategories: readonly string[]
  readonly by: string | undefined
  readonly on: string | undefined
}

export interface ApprovalGuardResult {
  readonly ok: boolean
  readonly problems: readonly string[]
  readonly flips: Readonly<Record<ApprovalCategory, boolean>>
}

// Pure guard for `approval record`. An explicit owner decision must cover
// every human-only category; nothing is inferred. Exported for unit tests.
export function evaluateApprovalReadiness(
  input: ApprovalGuardInput,
): ApprovalGuardResult {
  const problems: string[] = []
  if (!input.qaPassed) {
    problems.push('qa report has not passed')
  }
  if (!input.compositionPassed) {
    problems.push('composition report has not passed')
  }
  if (!input.manifestCurrent) {
    problems.push('review manifest is missing or stale; rerun review prepare')
  }
  if (!input.by || input.by.trim().length === 0) {
    problems.push('--by <owner> is required')
  }
  if (!input.on || !ISO_DATE.test(input.on)) {
    problems.push('--on <YYYY-MM-DD> is required')
  }

  const requested = input.approveCategories
  const known = new Set<string>(APPROVAL_CATEGORIES)
  const unknown = requested.filter((category) => !known.has(category))
  if (unknown.length > 0) {
    problems.push(`unknown approval categories: ${unknown.join(', ')}`)
  }
  const duplicates = requested.filter(
    (category, index) => requested.indexOf(category) !== index,
  )
  if (duplicates.length > 0) {
    problems.push(`duplicate approval categories: ${[...new Set(duplicates)].join(', ')}`)
  }
  const missing = APPROVAL_CATEGORIES.filter(
    (category) => !requested.includes(category),
  )
  if (missing.length > 0) {
    problems.push(
      `the owner decision must explicitly cover every category; missing: ${missing.join(', ')}`,
    )
  }

  // Listening approvals are impossible while the audio does not exist.
  if (requested.includes('audioZhCN') && !input.narrationReady['zh-CN']) {
    problems.push('audioZhCN cannot be approved: narration.zh-CN.mp3 does not exist')
  }
  if (requested.includes('audioEn') && !input.narrationReady.en) {
    problems.push('audioEn cannot be approved: narration.en.mp3 does not exist')
  }

  const flips = Object.fromEntries(
    APPROVAL_CATEGORIES.map((category) => [category, requested.includes(category)]),
  ) as Record<ApprovalCategory, boolean>

  return { ok: problems.length === 0, problems, flips }
}

export interface ApprovalRecord {
  readonly id: string
  readonly run: string
  readonly approvedBy: string
  readonly approvedOn: string
  readonly categories: readonly ApprovalCategory[]
  readonly profileSha256: string
  readonly sha256: string
}

// Hashes the canonical record payload (everything except the hash itself).
export function hashApprovalRecord(
  record: Omit<ApprovalRecord, 'sha256'>,
): string {
  return createHash('sha256')
    .update(JSON.stringify(record))
    .digest('hex')
}

export async function readApprovalRecord(
  candidateDir: string,
): Promise<ApprovalRecord | null> {
  const recordPath = join(candidateDir, APPROVAL_RECORD_FILE)
  if (!(await pathExists(recordPath))) {
    return null
  }
  const record = (await readJsonFile(recordPath)) as ApprovalRecord
  return record
}

export interface ApprovalRecordVerification {
  readonly valid: boolean
  readonly problems: readonly string[]
}

// A promotion-grade approval record: file exists, its embedded hash matches
// its payload, it covers every category, and it was taken against the exact
// current profile.json.
export async function verifyApprovalRecord(
  loaded: LoadedProfile,
  currentProfileSha256: string,
): Promise<ApprovalRecordVerification> {
  const record = await readApprovalRecord(loaded.candidateDir)
  if (record === null) {
    return { valid: false, problems: ['approval-record.json missing'] }
  }
  const problems: string[] = []
  const { sha256, ...payload } = record
  if (hashApprovalRecord(payload) !== sha256) {
    problems.push('approval-record.json hash does not match its payload')
  }
  if (record.id !== loaded.profile.id) {
    problems.push(`approval record is for ${record.id}, not ${loaded.profile.id}`)
  }
  const missing = APPROVAL_CATEGORIES.filter(
    (category) => !record.categories.includes(category),
  )
  if (missing.length > 0) {
    problems.push(`approval record does not cover: ${missing.join(', ')}`)
  }
  if (record.profileSha256 !== currentProfileSha256) {
    problems.push('profile.json changed after the approval was recorded')
  }
  return { valid: problems.length === 0, problems }
}

export function applyApprovalFlips(
  profile: CandidateProfile,
  flips: Readonly<Record<ApprovalCategory, boolean>>,
): CandidateProfile {
  const humanApprovals = Object.fromEntries(
    APPROVAL_CATEGORIES.map((category) => [
      category,
      profile.humanApprovals[category] || flips[category],
    ]),
  ) as HumanApprovals
  return {
    ...profile,
    humanApprovals,
    narration: {
      'zh-CN': {
        ...profile.narration['zh-CN'],
        humanReviewStatus: flips.audioZhCN ? 'approved' : profile.narration['zh-CN'].humanReviewStatus,
      },
      en: {
        ...profile.narration.en,
        humanReviewStatus: flips.audioEn ? 'approved' : profile.narration.en.humanReviewStatus,
      },
    },
  }
}
