// @vitest-environment node
import {
  compareFileFingerprints,
  verifyCollectionAgreement,
  type Baseline,
} from '../tools/animal-onboarding/src/lib/baseline'
import {
  BACKGROUND_PAIR_CEILING_BYTES,
  BACKGROUND_PAIR_TARGET_BYTES,
  centerModelRatio,
  evaluateBackgroundPairBytes,
  habitatSceneSpec,
  hexToLinear,
  mulberry32,
  seedFromId,
} from '../tools/animal-onboarding/src/lib/derivatives'
import {
  evaluateCandidate,
  scoreIntake,
} from '../tools/animal-onboarding/src/lib/intake'
import {
  buildPromotionProvenance,
  extractNarrationSentences,
  joinNarrationScript,
  summarizeNormalizationLog,
  type PromotionProvenanceInput,
} from '../tools/animal-onboarding/src/lib/promote'

function fingerprint(sha256: string, bytes = 1) {
  return { sha256, bytes }
}

function baselineFixture(): Baseline {
  return {
    capturedAt: '2026-08-10T00:00:00.000Z',
    collection: ['alpha', 'beta'],
    originalIds: ['alpha'],
    packages: { alpha: { 'animal.ts': fingerprint('aaa', 10) } },
  }
}

const validCandidate = {
  id: 'velociraptor',
  name: 'Velociraptor',
  scientificName: 'Velociraptor mongoliensis',
  sourcePage: 'https://example.com/pack',
  downloadURL: 'https://example.com/model.zip',
  author: 'Quaternius',
  license: 'CC0-1.0',
  animated: 'yes in source pack',
  format: 'GLB',
  redistribution: 'allowed, no attribution required',
  notes: 'Kid-friendly low-poly.',
}

describe('compareFileFingerprints', () => {
  it('reports no problems for identical maps', () => {
    const recorded = { 'a.txt': fingerprint('x', 3), 'b.txt': fingerprint('y') }
    expect(compareFileFingerprints(recorded, { ...recorded })).toEqual([])
  })

  it('reports changed, removed and added files', () => {
    const recorded = {
      'changed.txt': fingerprint('old'),
      'removed.txt': fingerprint('gone'),
    }
    const current = {
      'changed.txt': fingerprint('new'),
      'added.txt': fingerprint('extra'),
    }
    expect(compareFileFingerprints(recorded, current)).toEqual([
      'added: added.txt',
      'changed: changed.txt',
      'removed: removed.txt',
    ])
  })

  it('flags byte-size drift even when hashing matches', () => {
    const recorded = { 'a.txt': fingerprint('x', 10) }
    const current = { 'a.txt': fingerprint('x', 11) }
    expect(compareFileFingerprints(recorded, current)).toEqual([
      'changed: a.txt',
    ])
  })
})

describe('verifyCollectionAgreement', () => {
  it('passes when directories and order match the recording', () => {
    expect(
      verifyCollectionAgreement(baselineFixture(), ['alpha', 'beta'], ['alpha', 'beta']),
    ).toEqual([])
  })

  it('flags collection order changes', () => {
    const problems = verifyCollectionAgreement(
      baselineFixture(),
      ['beta', 'alpha'],
      ['alpha', 'beta'],
    )
    expect(problems.some((p) => p.includes('collection order changed'))).toBe(true)
  })

  it('flags directory/collection set mismatch both ways', () => {
    const problems = verifyCollectionAgreement(
      baselineFixture(),
      ['alpha', 'beta'],
      ['alpha', 'gamma'],
    )
    expect(problems).toContain('package directory not in collection: gamma')
    expect(problems).toContain('collection id has no package directory: beta')
  })
})

describe('evaluateCandidate', () => {
  const productionIds = new Set(['stegosaurus'])

  it('advances a complete CC0 GLB candidate with the documented score', () => {
    const result = evaluateCandidate(validCandidate, productionIds)
    expect(result.decision).toBe('advance')
    // 30 CC0 + 20 animated + 10 GLB-native; land habitat adds nothing.
    expect(result.score).toBe(60)
  })

  it('rejects a license outside the publication allowlist', () => {
    const result = evaluateCandidate(
      { ...validCandidate, id: 'diplodocus', license: 'CC-BY-3.0' },
      productionIds,
    )
    expect(result.decision).toBe('reject')
    expect(result.reasons.join(' ')).toContain('not in the publication allowlist')
  })

  it('rejects a candidate without scientific identity', () => {
    const result = evaluateCandidate(
      { ...validCandidate, id: 'mystery', scientificName: null },
      productionIds,
    )
    expect(result.decision).toBe('reject')
    expect(result.reasons).toContain('scientific identity absent')
  })

  it('rejects a duplicate of a production id', () => {
    const result = evaluateCandidate(
      { ...validCandidate, id: 'stegosaurus' },
      productionIds,
    )
    expect(result.decision).toBe('reject')
    expect(result.reasons.join(' ')).toContain('already exists')
  })

  it('holds skeleton-only exhibits for an owner decision', () => {
    const result = evaluateCandidate(
      {
        ...validCandidate,
        id: 'dunkleosteus-skeleton',
        name: 'Dunkleosteus (skeleton)',
        animated: 'no',
        format: 'STL',
        notes: 'Possible skeleton exhibit pairing.',
      },
      productionIds,
    )
    expect(result.decision).toBe('hold')
    expect(result.reasons.join(' ')).toContain('skeleton-only')
  })

  it('holds candidates whose notes flag a style review', () => {
    const result = evaluateCandidate(
      {
        ...validCandidate,
        id: 'dimetrodon',
        notes: 'Blocky style — art-style fit needs owner review.',
      },
      productionIds,
    )
    expect(result.decision).toBe('hold')
  })

  it('awards habitat diversity points for marine candidates', () => {
    const result = evaluateCandidate(
      {
        ...validCandidate,
        id: 'dunkleosteus',
        animated: 'no',
        format: 'STL',
        notes: 'Armored placoderm; adds Paleozoic marine predator.',
      },
      productionIds,
    )
    expect(result.decision).toBe('advance')
    // 30 CC0 + 10 water habitat diversity.
    expect(result.score).toBe(40)
  })
})

describe('scoreIntake', () => {
  it('carries pre-rejected entries into the ranking as rejects', () => {
    const ranking = scoreIntake(
      {
        recordedOn: '2026-08-10',
        candidates: [validCandidate],
        rejectedDuringIntake: [
          { id: 'dromaeosaur-oga', reason: 'upstream license unverifiable' },
        ],
      },
      ['stegosaurus'],
      'intake.json',
    )
    expect(ranking.summary).toEqual({ advance: 1, hold: 0, reject: 1 })
    const rejected = ranking.decisions.find((d) => d.id === 'dromaeosaur-oga')
    expect(rejected?.decision).toBe('reject')
    expect(rejected?.reasons.join(' ')).toContain('upstream license unverifiable')
    // Advance entries sort before rejects.
    expect(ranking.decisions[0]?.id).toBe('velociraptor')
  })
})

import {
  evaluateApprovalReadiness,
  hashApprovalRecord,
} from '../tools/animal-onboarding/src/lib/approvals'
import {
  evaluateIdleClip,
  inspectCandidateGlb,
} from '../tools/animal-onboarding/src/lib/glb'
import { buildPromotionPlan } from '../tools/animal-onboarding/src/lib/promote'
import {
  evaluateHeadSideGate,
  evaluateMouthMotion,
  parseMotionRenderEvidence,
  rotateInitialYaw,
  type HeadSideEvaluation,
} from '../tools/animal-onboarding/src/lib/qa'
import {
  APPROVAL_CATEGORIES,
  type CandidateProfile,
} from '../tools/animal-onboarding/src/lib/profile'

describe('rotateInitialYaw', () => {
  it('matches the runtime rotation: glTF -Z maps to +x at yaw -90', () => {
    const [x, y, z] = rotateInitialYaw([0, 0.5, -1], -90)
    expect(x).toBeCloseTo(1)
    expect(y).toBeCloseTo(0.5)
    expect(z).toBeCloseTo(0)
  })

  it('maps glTF -Z to -x at yaw 90', () => {
    const [x, , z] = rotateInitialYaw([0, 0.5, -1], 90)
    expect(x).toBeCloseTo(-1)
    expect(z).toBeCloseTo(0)
  })
})

describe('evaluateHeadSideGate', () => {
  // Measured velociraptor landmarks: head toward glTF -Z, tail toward +Z.
  const landmarks = {
    head: [0.03191, 0.64733, -0.78784],
    tailTip: [-0.0763, 0.91924, 1.12795],
  } as const

  function evaluate(yaw: number, side: 'left' | 'right'): HeadSideEvaluation {
    return evaluateHeadSideGate(landmarks, {
      initialYawDegrees: yaw,
      initialHeadSide: side,
    })
  }

  it('passes a left-facing side view at yaw 90', () => {
    const result = evaluate(90, 'left')
    expect(result.ok).toBe(true)
    expect(result.projectedSide).toBe('left')
    expect(result.horizontalSeparation).toBeGreaterThan(0.9)
  })

  it('rejects the wrong declared side at yaw -90', () => {
    const result = evaluate(-90, 'left')
    expect(result.ok).toBe(false)
    expect(result.projectedSide).toBe('right')
    expect(result.problems.join(' ')).toContain("viewer's right")
  })

  it('rejects a near-frontal projection below 35% separation', () => {
    const result = evaluate(10, 'left')
    expect(result.ok).toBe(false)
    expect(result.horizontalSeparation).toBeLessThan(0.35)
    expect(result.problems.join(' ')).toContain('near-frontal')
  })
})

describe('evaluateMouthMotion', () => {
  const base = {
    jawBone: null,
    tongueBones: [],
    hinge: null,
    componentCount: null,
    vertexCount: null,
    softMaskCount: null,
  } as const

  it('accepts disabled with a reason', () => {
    expect(
      evaluateMouthMotion({ ...base, mode: 'disabled', reason: 'no jaw rig' }),
    ).toEqual([])
  })

  it('rejects disabled without a reason', () => {
    expect(
      evaluateMouthMotion({ ...base, mode: 'disabled', reason: '' }),
    ).toHaveLength(1)
  })

  it('hard-fails enabled modes as not evidenced', () => {
    const problems = evaluateMouthMotion({
      ...base,
      mode: 'source-rig',
      reason: null,
    })
    expect(problems.join(' ')).toContain('not evidenced')
  })
})

describe('parseMotionRenderEvidence', () => {
  it('passes a log with >=1% mid-clip change and a PASS gate line', () => {
    const evidence = parseMotionRenderEvidence(
      'motion render pixel diff (changed-pixel ratio, threshold 8/255): 0s vs 4s = 8.1753%, 4s vs 8s = 8.1753%, 0s vs 8s = 0.0000%\nmotion render pixel gate (>=1% at Blender level): PASS\n',
    )
    expect(evidence).not.toBeNull()
    expect(evidence?.pass).toBe(true)
    expect(evidence?.ratios['0s vs 4s']).toBeCloseTo(0.081753)
  })

  it('fails a log below the threshold even with a recorded gate', () => {
    const evidence = parseMotionRenderEvidence(
      'motion render pixel diff: 0s vs 4s = 0.5000%, 4s vs 8s = 0.5000%, 0s vs 8s = 0.0000%\nmotion render pixel gate (>=1% at Blender level): FAIL\n',
    )
    expect(evidence?.pass).toBe(false)
  })

  it('returns null when the log records no evidence', () => {
    expect(parseMotionRenderEvidence('nothing here')).toBeNull()
  })
})

describe('evaluateIdleClip', () => {
  const inspection = {
    animationNames: ['Idle'],
    animationDurations: { Idle: 8 },
    cubicSplineRotationTracks: 0,
    externalUris: [],
    triangles: 1000,
    drawCalls: 2,
    bones: 10,
  }

  it('passes exactly one 8.0 s Idle clip', () => {
    expect(evaluateIdleClip(inspection, true)).toEqual([])
  })

  it('rejects extra clips, wrong duration and CUBICSPLINE rotations', () => {
    expect(
      evaluateIdleClip(
        { ...inspection, animationNames: ['Idle', 'Run'] },
        true,
      ).join(' '),
    ).toContain('exactly one animation')
    expect(
      evaluateIdleClip(
        { ...inspection, animationDurations: { Idle: 7.5 } },
        true,
      ).join(' '),
    ).toContain('8.0 s')
    expect(
      evaluateIdleClip(
        { ...inspection, cubicSplineRotationTracks: 2 },
        true,
      ).join(' '),
    ).toContain('CUBICSPLINE')
  })
})

describe('evaluateApprovalReadiness', () => {
  const readyInput = {
    qaPassed: true,
    compositionPassed: true,
    manifestCurrent: true,
    narrationReady: { 'zh-CN': true, en: true },
    approveCategories: [...APPROVAL_CATEGORIES],
    by: 'owner',
    on: '2026-08-10',
  }

  it('passes a complete explicit decision against passing reports', () => {
    const result = evaluateApprovalReadiness(readyInput)
    expect(result.ok).toBe(true)
    expect(Object.values(result.flips).every(Boolean)).toBe(true)
  })

  it('refuses when deterministic reports have not passed', () => {
    const result = evaluateApprovalReadiness({
      ...readyInput,
      qaPassed: false,
      manifestCurrent: false,
    })
    expect(result.ok).toBe(false)
    expect(result.problems.join(' ')).toContain('qa report')
    expect(result.problems.join(' ')).toContain('review manifest')
  })

  it('refuses a partial category list; nothing is inferred', () => {
    const result = evaluateApprovalReadiness({
      ...readyInput,
      approveCategories: ['science', 'anatomy'],
    })
    expect(result.ok).toBe(false)
    expect(result.problems.join(' ')).toContain('missing:')
  })

  it('refuses unknown or duplicated categories', () => {
    expect(
      evaluateApprovalReadiness({
        ...readyInput,
        approveCategories: [...APPROVAL_CATEGORIES, 'vibes'],
      }).problems.join(' '),
    ).toContain('unknown approval categories: vibes')
    expect(
      evaluateApprovalReadiness({
        ...readyInput,
        approveCategories: [
          ...APPROVAL_CATEGORIES.slice(1),
          'science',
          'science',
        ],
      }).problems.join(' '),
    ).toContain('duplicate approval categories: science')
  })

  it('refuses audio approvals while the MP3s do not exist', () => {
    const result = evaluateApprovalReadiness({
      ...readyInput,
      narrationReady: { 'zh-CN': false, en: true },
    })
    expect(result.ok).toBe(false)
    expect(result.problems.join(' ')).toContain('audioZhCN')
  })

  it('requires an explicit owner and ISO date', () => {
    const result = evaluateApprovalReadiness({
      ...readyInput,
      by: undefined,
      on: '10/08/2026',
    })
    expect(result.ok).toBe(false)
    expect(result.problems.join(' ')).toContain('--by')
    expect(result.problems.join(' ')).toContain('--on')
  })
})

describe('hashApprovalRecord', () => {
  it('is stable for the same payload and changes with it', () => {
    const payload = {
      id: 'velociraptor',
      run: 'animal-onboarding-2026-08-10',
      approvedBy: 'owner',
      approvedOn: '2026-08-10',
      categories: ['science' as const],
      profileSha256: 'a'.repeat(64),
    }
    expect(hashApprovalRecord(payload)).toBe(hashApprovalRecord(payload))
    expect(hashApprovalRecord(payload)).not.toBe(
      hashApprovalRecord({ ...payload, approvedOn: '2026-08-11' }),
    )
  })
})

describe('buildPromotionPlan', () => {
  function fakeProfile(id: string): Pick<
    { profile: CandidateProfile },
    'profile'
  > {
    return {
      profile: {
        id,
        run: 'animal-onboarding-2026-08-10',
        narration: {
          'zh-CN': { path: 'output/audio/narration.zh-CN.mp3' },
          en: { path: 'output/audio/narration.en.mp3' },
        },
      } as CandidateProfile,
    }
  }

  it('installs non-catalog files first and animal.ts last per animal', () => {
    const plan = buildPromotionPlan([fakeProfile('alpha'), fakeProfile('beta')])
    for (const id of ['alpha', 'beta']) {
      const ops = plan.ops.filter((op) => op.animalId === id)
      expect(ops.at(-1)?.target).toBe(`src/content/animals/${id}/animal.ts`)
      expect(ops[0]?.target).toBe(`src/content/animals/${id}/model/model.glb`)
      const catalogIndex = ops.findIndex((op) => op.target.endsWith('animal.ts'))
      expect(catalogIndex).toBe(ops.length - 1)
    }
  })

  it('appends every id to the collection exactly once, after all ops', () => {
    const plan = buildPromotionPlan([fakeProfile('alpha'), fakeProfile('beta')])
    expect(plan.collectionAppend).toEqual(['alpha', 'beta'])
    expect(plan.postSteps).toEqual(['generate:credits', 'validate:content'])
  })

  it('marks missing sources and generated files explicitly', () => {
    const plan = buildPromotionPlan([fakeProfile('alpha')], {
      alpha: ['model/model.glb'],
    })
    const byTarget = new Map(plan.ops.map((op) => [op.target, op.status]))
    expect(byTarget.get('src/content/animals/alpha/model/model.glb')).toBe('ready')
    expect(byTarget.get('src/content/animals/alpha/images/poster.webp')).toBe('missing')
    expect(byTarget.get('src/content/animals/alpha/animal.ts')).toBe('generate')
  })
})

describe('inspectCandidateGlb', () => {
  it('rejects non-GLB buffers', () => {
    expect(() => inspectCandidateGlb(Buffer.from('not a glb'))).toThrow(
      'not a GLB container',
    )
  })
})

describe('derivatives pure logic', () => {
  const specPaths = {
    landscapeOutput: '/tmp/landscape.png',
    portraitOutput: '/tmp/portrait.png',
    reportPath: '/tmp/report.json',
  }
  const landProfile = {
    id: 'velociraptor',
    presentation: { habitat: 'land' as const },
  }
  const waterProfile = {
    id: 'dunkleosteus',
    presentation: { habitat: 'water' as const },
  }

  describe('seedFromId / mulberry32', () => {
    it('is deterministic per id and differs across ids', () => {
      expect(seedFromId('velociraptor')).toBe(seedFromId('velociraptor'))
      expect(seedFromId('velociraptor')).not.toBe(seedFromId('parasaurolophus'))
      const first = mulberry32(seedFromId('velociraptor'))
      const second = mulberry32(seedFromId('velociraptor'))
      expect([first(), first(), first()]).toEqual([second(), second(), second()])
    })
  })

  describe('hexToLinear', () => {
    it('maps black/white exactly and mid-gray below 0.5 (linear)', () => {
      expect(hexToLinear('#000000')).toEqual([0, 0, 0])
      const white = hexToLinear('#ffffff')
      expect(white[0]).toBeCloseTo(1, 5)
      const mid = hexToLinear('#808080')
      expect(mid[0]).toBeCloseTo(0.2158, 3)
    })
  })

  describe('habitatSceneSpec', () => {
    it('is byte-identical across runs for the same profile', () => {
      const a = habitatSceneSpec(landProfile, specPaths)
      const b = habitatSceneSpec(landProfile, specPaths)
      expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    })

    it('varies object placement across animals but keeps the palette', () => {
      const a = habitatSceneSpec(landProfile, specPaths)
      const b = habitatSceneSpec(
        { id: 'parasaurolophus', presentation: { habitat: 'land' as const } },
        specPaths,
      )
      expect(JSON.stringify(a.trees)).not.toBe(JSON.stringify(b.trees))
      expect(a.materials).toEqual(b.materials)
      expect(a.world.stops).toEqual(b.world.stops)
    })

    it('renders landscape and portrait as separate camera compositions', () => {
      const spec = habitatSceneSpec(landProfile, specPaths)
      expect(spec.cameras.landscape.width).toBe(1920)
      expect(spec.cameras.landscape.height).toBe(1080)
      expect(spec.cameras.portrait.width).toBe(1080)
      expect(spec.cameras.portrait.height).toBe(1920)
      expect(spec.cameras.landscape.focalLength).not.toBe(
        spec.cameras.portrait.focalLength,
      )
    })

    it('keeps the quiet central model area free of land props', () => {
      const spec = habitatSceneSpec(landProfile, specPaths)
      for (const prop of [...spec.hills, ...spec.trees, ...spec.rocks]) {
        const [x, y] = prop.location
        // Nothing near the camera-centre column where the model stands.
        expect(Math.abs(x) >= 6.5 || y > 35).toBe(true)
      }
      expect(spec.rays).toEqual([])
      expect(spec.particles).toEqual([])
    })

    it('keeps water motes out of the quiet centre box', () => {
      const spec = habitatSceneSpec(waterProfile, specPaths)
      expect(spec.habitat).toBe('water')
      expect(spec.particles.length).toBeGreaterThan(0)
      for (const mote of spec.particles) {
        const [x, , z] = mote.location
        expect(Math.abs(x) >= 4 || Math.abs(z) >= 2.5).toBe(true)
      }
      expect(spec.rays.length).toBeGreaterThan(0)
    })

    it('gives the air habitat the quiet sky composition of the land scene', () => {
      const spec = habitatSceneSpec(
        { id: 'pteranodon', presentation: { habitat: 'air' as const } },
        specPaths,
      )
      expect(spec.habitat).toBe('land')
      expect(spec.rays).toEqual([])
      expect(spec.particles).toEqual([])
      expect(spec.cameras.landscape.width).toBe(1920)
      expect(spec.cameras.portrait.height).toBe(1920)
    })
  })

  describe('evaluateBackgroundPairBytes', () => {
    it('classifies against the 1.2 MiB target and 2 MiB ceiling', () => {
      expect(evaluateBackgroundPairBytes(100, 100)).toBe('ok')
      expect(
        evaluateBackgroundPairBytes(
          BACKGROUND_PAIR_TARGET_BYTES,
          1,
        ),
      ).toBe('warning')
      expect(
        evaluateBackgroundPairBytes(
          BACKGROUND_PAIR_CEILING_BYTES - 10,
          11,
        ),
      ).toBe('over')
    })
  })

  describe('centerModelRatio', () => {
    function frame(
      width: number,
      height: number,
      alphaAt: (x: number, y: number) => number,
    ) {
      const data = Buffer.alloc(width * height * 4)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          data[(y * width + x) * 4 + 3] = alphaAt(x, y)
        }
      }
      return { data, width, height }
    }

    it('is 0 for a blank frame and 1 for a full one', () => {
      expect(centerModelRatio(frame(100, 100, () => 0))).toBe(0)
      expect(centerModelRatio(frame(100, 100, () => 255))).toBe(1)
    })

    it('ignores model pixels outside the central region', () => {
      // Model fills only the outer left band; the centre stays empty.
      const edgeOnly = frame(100, 100, (x) => (x < 20 ? 255 : 0))
      expect(centerModelRatio(edgeOnly, 0.5)).toBe(0)
      // A centred 50x50 blob fills the whole central 50% region.
      const centred = frame(100, 100, (x, y) =>
        x >= 25 && x < 75 && y >= 25 && y < 75 ? 255 : 0,
      )
      expect(centerModelRatio(centred, 0.5)).toBeCloseTo(1, 5)
    })
  })
})

describe('extractNarrationSentences', () => {
  it('parses the JSON-style zh-CN content module', () => {
    const moduleText = `import type { AnimalContentZhCN } from '../../types'

export const zhCN = {
  "narration": {
    "sentences": [
      "这是伶盗龙。",
      "看看它的爪子？"
    ]
  }
} satisfies AnimalContentZhCN
`
    expect(extractNarrationSentences(moduleText)).toEqual([
      '这是伶盗龙。',
      '看看它的爪子？',
    ])
  })

  it('parses the single-quoted en content module with escapes', () => {
    const moduleText = `import type { AnimalContentEn } from '../../types'

export const en = {
  narration: {
    sentences: [
      'This is Velociraptor, a feathered meat-eating dinosaur.',
      'Look at its claw. Doesn\\'t it look like a sickle?',
    ],
  },
} satisfies AnimalContentEn
`
    expect(extractNarrationSentences(moduleText)).toEqual([
      'This is Velociraptor, a feathered meat-eating dinosaur.',
      "Look at its claw. Doesn't it look like a sickle?",
    ])
  })

  it('throws when fewer than two sentence literals exist', () => {
    expect(() =>
      extractNarrationSentences('export const en = { narration: {} }'),
    ).toThrow('no narration sentences')
    expect(() =>
      extractNarrationSentences("sentences: ['only one']"),
    ).toThrow('two string literals')
  })
})

describe('joinNarrationScript', () => {
  const sentences = ['第一句。', '第二句？'] as const

  it('joins zh-CN sentences without a separator and en with a space', () => {
    expect(joinNarrationScript('zh-CN', [sentences[0], sentences[1]])).toBe(
      '第一句。第二句？',
    )
    expect(
      joinNarrationScript('en', ['First sentence.', 'Second sentence?']),
    ).toBe('First sentence. Second sentence?')
  })
})

describe('summarizeNormalizationLog', () => {
  const log = `normalization run: velociraptor
pipeline: rigged .blend source, keeping only 'Velociraptor_Idle' retimed to 8 s
action 'Velociraptor_Idle' (0..60 f, BEZIER) resampled to 'Idle': frames 0..192 at 24 fps = 8.0 s
removed source clip 'Velociraptor_Attack' (frames 0..20)
removed source clip 'Velociraptor_Run' (frames 0..13)
velociraptor: source faces Blender -Y; 180 deg Z rotation kept on object node(s) ['Armature'] -> head now toward +Y (glTF -Z)
scale: source body length 13.2763 Blender units -> 2.0 m
grounding (land): shifted z by +0.00797 m so the lowest vertex rests at z=0 (object node translation)
mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only
render neutral front: /tmp/render.png
`

  it('keeps the modification narrative and counts removed clips', () => {
    const summary = summarizeNormalizationLog(log)
    expect(summary[0]).toContain('pipeline:')
    expect(summary.some((line) => line.startsWith('scale:'))).toBe(true)
    expect(summary.some((line) => line.startsWith('grounding (land):'))).toBe(true)
    expect(summary.some((line) => line.includes('head now toward +Y'))).toBe(true)
    expect(summary.some((line) => line.startsWith('mouth motion stays DISABLED'))).toBe(true)
    expect(summary.at(-1)).toBe(
      'Removed 2 unused source clips after retiming the Idle take.',
    )
    expect(summary.some((line) => line.includes('render neutral front'))).toBe(false)
  })

  it('falls back to a default modification line for an empty log', () => {
    expect(summarizeNormalizationLog('')).toEqual([
      'Normalized orientation, scale and grounding; retimed to one closed eight-second LINEAR Idle.',
    ])
  })
})

describe('buildPromotionProvenance', () => {
  const sha = (letter: string) => letter.repeat(64)

  function fixture(): PromotionProvenanceInput {
    const stagedFiles = {
      'model/model.glb': fingerprint(sha('a'), 204040),
      'backgrounds/landscape.webp': fingerprint(sha('b'), 16184),
      'backgrounds/portrait.webp': fingerprint(sha('c'), 10138),
      'images/poster.webp': fingerprint(sha('d'), 14076),
      'images/poster-portrait.webp': fingerprint(sha('e'), 4162),
      'images/thumbnail.webp': fingerprint(sha('f'), 3350),
      'audio/narration.zh-CN.mp3': fingerprint(sha('1'), 99116),
      'audio/narration.en.mp3': fingerprint(sha('2'), 115052),
    }
    const image = (
      entry: { sha256: string; bytes: number },
      width: number,
      height: number,
    ) => ({ ...entry, width, height })
    return {
      profile: {
        id: 'velociraptor',
        run: 'animal-onboarding-2026-08-10',
        candidate: {
          name: 'Velociraptor',
          scientificName: 'Velociraptor mongoliensis',
          sourcePage: 'https://quaternius.com/packs/animateddinosaurs.html',
          downloadURL: 'https://example.com/download',
          author: 'Quaternius',
          license: 'CC0-1.0',
          licenseEvidence: 'archived License.txt states CC0 1.0',
          accessDate: '2026-08-10',
        },
        archive: {
          sourceDownload: {
            path: 'archive/Velociraptor.blend',
            sha256: sha('9'),
            bytes: 1078640,
          },
        },
        model: {
          animated: true,
          sourceClip: 'Velociraptor_Idle',
          mouthMotion: {
            mode: 'disabled',
            reason: null,
            jawBone: null,
            tongueBones: [],
            hinge: null,
            componentCount: null,
            vertexCount: null,
            softMaskCount: null,
          },
        },
        presentation: {
          initialYawDegrees: 90,
          initialHeadSide: 'left',
          habitat: 'land',
          shadow: 'ground',
        },
        landmarks: {
          head: [0, 0.6, -0.7],
          tailTip: [0, 0.9, 1.1],
          contacts: [
            [0.1, 0, 0],
            [-0.1, 0, -0.1],
          ],
        },
        narration: {
          'zh-CN': {
            path: 'output/audio/narration.zh-CN.mp3',
            scriptPath: 'output/audio/narration.zh-CN.txt',
            metricsPath: 'output/audio/narration.zh-CN.metrics.json',
            speaker: 'Serena',
            language: 'Chinese',
            humanReviewStatus: 'approved',
          },
          en: {
            path: 'output/audio/narration.en.mp3',
            scriptPath: 'output/audio/narration.en.txt',
            metricsPath: 'output/audio/narration.en.metrics.json',
            speaker: 'Serena',
            language: 'English',
            humanReviewStatus: 'approved',
          },
        },
        assets: {},
        humanApprovals: {
          science: true,
          anatomy: true,
          materials: true,
          background: true,
          naturalMotion: true,
          mouthComfort: true,
          contentZhCN: true,
          contentEn: true,
          audioZhCN: true,
          audioEn: true,
          redistribution: true,
          production: true,
        },
      },
      stagedFiles,
      scripts: {
        'zh-CN': joinNarrationScript('zh-CN', ['这是伶盗龙。', '看看它的爪子？']),
        en: joinNarrationScript('en', [
          'This is Velociraptor.',
          'Look at its claws?',
        ]),
      },
      normalizationLog: `pipeline: rigged .blend source, keeping only 'Velociraptor_Idle' retimed to 8 s
scale: source body length 13.2763 Blender units -> 2.0 m
grounding (land): shifted z by +0.00797 m so the lowest vertex rests at z=0
`,
      derivativesLog: {
        blender: {
          version: '4.5.12 LTS',
          seed: 4036161673,
          specPath: 'qa/derivatives-scene-spec.json',
          specSha256: sha('8'),
        },
        webpSettings: { quality: 82 },
        backgrounds: {
          landscape: image(stagedFiles['backgrounds/landscape.webp'], 1920, 1080),
          portrait: image(stagedFiles['backgrounds/portrait.webp'], 1080, 1920),
        },
        posters: {
          landscape: image(stagedFiles['images/poster.webp'], 1200, 675),
          portrait: image(stagedFiles['images/poster-portrait.webp'], 390, 844),
          thumbnail: image(stagedFiles['images/thumbnail.webp'], 320, 320),
        },
      },
      narrationMetrics: {
        'zh-CN': {
          model: {
            repoId: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
            revision: sha('7'),
          },
          speaker: 'Serena',
          generatedAt: '2026-08-10T09:39:54.135717+00:00',
          mp3: stagedFiles['audio/narration.zh-CN.mp3'],
        },
        en: {
          model: {
            repoId: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
            revision: sha('7'),
          },
          speaker: 'Serena',
          generatedAt: '2026-08-10T09:41:43.192160+00:00',
          mp3: stagedFiles['audio/narration.en.mp3'],
        },
      },
      sceneSpec: fingerprint(sha('8'), 18958),
      approval: { approvedBy: 'zhostev', approvedOn: '2026-08-10' },
    }
  }

  it('emits exactly 8 records covering every canonical runtime asset', () => {
    const { records } = buildPromotionProvenance(fixture())
    expect(records.map((record) => record.assetPath).sort()).toEqual(
      [
        'model/model.glb',
        'backgrounds/landscape.webp',
        'backgrounds/portrait.webp',
        'images/poster.webp',
        'images/poster-portrait.webp',
        'images/thumbnail.webp',
        'audio/narration.zh-CN.mp3',
        'audio/narration.en.mp3',
      ].sort(),
    )
    for (const record of records) {
      expect(record.evidencePaths.length).toBeGreaterThan(0)
      expect(record.redistributionAllowed).toBe(true)
      expect(record.runtime.sha256).toMatch(/^[a-f0-9]{64}$/)
      expect(record.runtime.bytes).toBeGreaterThan(0)
    }
  })

  it('keeps every license inside the publication allowlist', () => {
    const allowlist = new Set([
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
    const { records } = buildPromotionProvenance(fixture())
    for (const record of records) {
      expect(allowlist.has(record.license.spdx)).toBe(true)
    }
  })

  it('emits the allowlisted ShareAlike candidate license', () => {
    const input = fixture()
    const shareAlikeInput = {
      ...input,
      profile: {
        ...input.profile,
        candidate: {
          ...input.profile.candidate,
          license: 'CC-BY-NC-SA-4.0',
        },
      },
    }
    const { records, evidenceFiles } = buildPromotionProvenance(shareAlikeInput)
    const model = records.find((record) => record.assetPath === 'model/model.glb')
    expect(model?.license).toEqual({
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    })
    expect(evidenceFiles['provenance/LICENSES/model-license.txt']).toContain(
      'CC-BY-NC-SA-4.0',
    )
  })

  it('records a project-authored procedural model as generated source', () => {
    const input = fixture()
    const projectAuthoredInput = {
      ...input,
      profile: {
        ...input.profile,
        candidate: {
          ...input.profile.candidate,
          sourcePage: 'project-authored (no upstream)',
          downloadURL: 'assets/candidates/run/spinosaurus/build_spinosaurus.py',
          author: 'Prehistoric Animal Museum (project-authored)',
          license: 'CC-BY-NC-SA-4.0',
        },
      },
    }
    const { records } = buildPromotionProvenance(projectAuthoredInput)
    const model = records.find((record) => record.assetPath === 'model/model.glb')
    expect(model?.source.type).toBe('generated')
    if (model?.source.type !== 'generated') {
      throw new Error('project-authored model source must be generated')
    }
    expect(model.source.tool).toContain('Blender Python generator')
    expect(model.source.sha256).toBe(sha('9'))
    expect(model.source.bytes).toBe(1078640)
  })

  it('records Qwen3-TTS Serena generation bound to the joined scripts', () => {
    const input = fixture()
    const { records } = buildPromotionProvenance(input)
    const zh = records.find(
      (record) => record.assetPath === 'audio/narration.zh-CN.mp3',
    )
    const en = records.find(
      (record) => record.assetPath === 'audio/narration.en.mp3',
    )
    expect(zh?.source.type).toBe('generated')
    expect(en?.source.type).toBe('generated')
    if (zh?.source.type !== 'generated' || en?.source.type !== 'generated') {
      throw new Error('narration sources must be generated records')
    }
    expect(zh.source.tool).toContain('Qwen3-TTS')
    expect(en.source.tool).toContain('Qwen3-TTS')
    expect(zh.source.revision).toContain('Serena')
    expect(en.source.revision).toContain('Serena')
    expect(zh.source.prompt).toBe('这是伶盗龙。看看它的爪子？')
    expect(en.source.prompt).toBe('This is Velociraptor. Look at its claws?')
    expect(zh.runtime.sha256).not.toBe(en.runtime.sha256)
  })

  it('emits the five evidence files with the validator listening phrases', () => {
    const { records, evidenceFiles } = buildPromotionProvenance(fixture())
    expect(Object.keys(evidenceFiles).sort()).toEqual(
      [
        'provenance/LICENSES/model-license.txt',
        'provenance/LICENSES/model-source.txt',
        'provenance/LICENSES/background-generation.txt',
        'provenance/LICENSES/derived-images.txt',
        'provenance/LICENSES/narration-rights.txt',
      ].sort(),
    )
    for (const record of records) {
      for (const evidencePath of record.evidencePaths) {
        expect(evidenceFiles[evidencePath]).toBeDefined()
      }
    }
    const narrationRights = evidenceFiles['provenance/LICENSES/narration-rights.txt']
    expect(narrationRights).toMatch(/Serena/i)
    expect(narrationRights).toMatch(/human listening review:\s*approved/i)
    expect(narrationRights).toMatch(/project owner/i)
    expect(narrationRights).toMatch(/language:\s*Chinese/i)
    expect(narrationRights).toMatch(/language:\s*English/i)
    expect(narrationRights).toContain('zhostev')
    expect(narrationRights).toContain('2026-08-10')
    expect(narrationRights).toContain(sha('1'))
    expect(narrationRights).toContain(sha('2'))
    const modelLicense = evidenceFiles['provenance/LICENSES/model-license.txt']
    expect(modelLicense).toContain('Quaternius')
    expect(modelLicense).toContain('CC0-1.0')
    const modelSource = evidenceFiles['provenance/LICENSES/model-source.txt']
    expect(modelSource).toContain(sha('9'))
    expect(modelSource).toContain(sha('a'))
  })

  it('throws when a staged asset drifts from the derivatives log', () => {
    const input = fixture()
    const drifted = {
      ...input,
      stagedFiles: {
        ...input.stagedFiles,
        'images/thumbnail.webp': fingerprint(sha('0'), 9999),
      },
    }
    expect(() => buildPromotionProvenance(drifted)).toThrow(
      'thumbnail fingerprint drift',
    )
  })
})
