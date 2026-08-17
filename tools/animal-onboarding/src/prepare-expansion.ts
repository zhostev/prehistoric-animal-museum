import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'

interface ExpansionAnimal {
  id: string
  name: string
  zh: string
  scientific: string
  archetype: string
  feature: string
  length: number
  wingspan?: number
  habitat: 'land' | 'air' | 'water'
  kind: 'dinosaur' | 'pterosaur' | 'marine-reptile' | 'other-prehistoric-animal'
  atmosphere: 'air' | 'forest' | 'ice' | 'plains' | 'underwater'
  diet: 'herbivore' | 'carnivore' | 'omnivore' | 'unknown'
  periodEn: string
  periodZh: string
  regionsEn: string[]
  regionsZh: string[]
}

interface Catalog {
  run: string
  accessDate: string
  license: 'CC0-1.0'
  animals: ExpansionAnimal[]
}

const root = resolve(dirname(new URL(import.meta.url).pathname), '../../..')
const catalogPath = join(root, 'tools/animal-onboarding/expansion-100.json')
const generatorPath = join(root, 'tools/animal-onboarding/blender/build_expansion_animal.py')
const blenderPath = join(root, '../.runtime/blender/blender-4.5.12-linux-x64/blender')

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' })
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${basename(command)} exited ${code}`))
    })
  })
}

async function fingerprint(path: string) {
  const buffer = await readFile(path)
  return {
    path,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    bytes: buffer.byteLength,
  }
}

function escape(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

function visibleFeatureEn(animal: ExpansionAnimal): string {
  const feature = animal.feature.replaceAll('-', ' ')
  return `Look for its ${feature}. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.`
}

function visibleFeatureZh(animal: ExpansionAnimal): string {
  const feature = animal.feature.replaceAll('-', ' ')
  return `看看它醒目的“${feature}”外形，再观察轻轻的呼吸、转头和尾部动作。`
}

function contentEn(animal: ExpansionAnimal): string {
  const sizeKind = animal.wingspan ? 'wingspan' : 'body-length'
  const size = animal.wingspan ?? animal.length
  const sourceTitle = `${animal.name} — Encyclopaedia Britannica`
  return `import type { AnimalContentEn } from '../../../../../src/content/types'

export const en = {
  name: '${escape(animal.name)}',
  classificationLabel: '${escape(animal.scientific)} — ${animal.kind.replaceAll('-', ' ')}',
  visibleFeature: '${escape(visibleFeatureEn(animal))}',
  narration: {
    sentences: [
      'This is ${escape(animal.name)}, a prehistoric animal known as ${escape(animal.scientific)}.',
      '${escape(visibleFeatureEn(animal))}',
    ],
    pronunciation: [{ text: '${escape(animal.name)}', reading: '${escape(animal.name)}' }],
  },
  facts: {
    period: '${escape(animal.periodEn)}',
    discoveryRegions: ${JSON.stringify(animal.regionsEn)},
    size: { kind: '${sizeKind}', minMeters: ${Number((size * 0.9).toFixed(3))}, maxMeters: ${size} },
    diet: '${animal.diet}',
  },
  parentClassificationNote: '${escape(animal.scientific)} is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared ${escape(animal.feature.replaceAll('-', ' '))}; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: '${escape(sourceTitle)}',
    url: 'https://www.britannica.com/animal/${animal.id}',
    accessedOn: '2026-08-13',
  }],
  editorial: {
    uncertaintyNotes: [
      'The size range is rounded for family reading and does not represent one particular specimen.',
      'Body colour, soft tissue and the Idle movement are display reconstructions rather than direct fossil observations.',
      'Scientific wording, anatomy, material appearance and natural motion remain pending owner review.',
    ],
    editedBy: 'Codex-assisted expansion draft',
    reviewedBy: 'pending owner review',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentEn
`
}

function contentZh(animal: ExpansionAnimal): string {
  const sizeKind = animal.wingspan ? 'wingspan' : 'body-length'
  const size = animal.wingspan ?? animal.length
  return `import type { AnimalContentZhCN } from '../../../../../src/content/types'

export const zhCN = {
  name: '${escape(animal.zh)}',
  classificationLabel: '${escape(animal.scientific)}（${animal.kind.replaceAll('-', ' ')}）',
  visibleFeature: '${escape(visibleFeatureZh(animal))}',
  narration: {
    sentences: [
      '这是${escape(animal.zh)}，学名是${escape(animal.scientific)}。',
      '${escape(visibleFeatureZh(animal))}',
    ],
    pronunciation: [{ text: '${escape(animal.zh)}', reading: '${escape(animal.zh)}' }],
  },
  facts: {
    period: '${escape(animal.periodZh)}',
    discoveryRegions: ${JSON.stringify(animal.regionsZh)},
    size: { kind: '${sizeKind}', minMeters: ${Number((size * 0.9).toFixed(3))}, maxMeters: ${size} },
    diet: '${animal.diet}',
  },
  parentClassificationNote: '${escape(animal.scientific)}在这里采用项目自制的风格化复原。轮廓突出“${escape(animal.feature.replaceAll('-', ' '))}”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: '${escape(animal.name)} — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/${animal.id}',
    accessedOn: '2026-08-13',
  }],
  editorial: {
    uncertaintyNotes: [
      '体型范围为亲子阅读而取整，不对应某一件具体标本。',
      '体色、软组织和待机动作属于展陈复原，而不是化石直接观察结果。',
      '科学文字、解剖、材质外观和动作自然度仍待馆主审阅。',
    ],
    editedBy: 'Codex 辅助扩展草稿',
    reviewedBy: '待馆主审阅',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentZhCN
`
}

async function prepare(animal: ExpansionAnimal, catalog: Catalog): Promise<string> {
  const candidateDir = join(root, 'assets/candidates', catalog.run, animal.id)
  const archiveDir = join(candidateDir, 'archive')
  const contentDir = join(candidateDir, 'content')
  await Promise.all([
    mkdir(archiveDir, { recursive: true }),
    mkdir(contentDir, { recursive: true }),
    mkdir(join(candidateDir, 'output/model'), { recursive: true }),
    mkdir(join(candidateDir, 'output/audio'), { recursive: true }),
    mkdir(join(candidateDir, 'output/images'), { recursive: true }),
    mkdir(join(candidateDir, 'blender'), { recursive: true }),
    mkdir(join(candidateDir, 'qa'), { recursive: true }),
  ])
  const generatorCopy = join(archiveDir, 'build_expansion_animal.py')
  const catalogCopy = join(archiveDir, 'expansion-entry.json')
  const sourceModel = join(archiveDir, 'chosen-model.glb')
  const force = process.env.MUSEUM_EXPANSION_FORCE_SOURCE === '1'
  await copyFile(generatorPath, generatorCopy)
  await writeFile(catalogCopy, `${JSON.stringify(animal, null, 2)}\n`)
  try {
    if (force) throw new Error('forced source refresh')
    await readFile(sourceModel)
  } catch {
    await run(blenderPath, [
      '--background', '--factory-startup', '--python', generatorPath, '--',
      '--catalog', catalogPath, '--id', animal.id, '--out', sourceModel,
    ])
  }
  const generator = await fingerprint(generatorCopy)
  const entry = await fingerprint(catalogCopy)
  const chosen = await fingerprint(sourceModel)
  await writeFile(join(contentDir, 'content.en.ts'), contentEn(animal))
  await writeFile(join(contentDir, 'content.zh-CN.ts'), contentZh(animal))
  await writeFile(
    join(candidateDir, 'output/audio/narration.zh-CN.txt'),
    `这是${animal.zh}，学名是${animal.scientific}。\n${visibleFeatureZh(animal)}\n`,
  )
  await writeFile(
    join(candidateDir, 'output/audio/narration.en.txt'),
    `This is ${animal.name}, a prehistoric animal known as ${animal.scientific}.\n${visibleFeatureEn(animal)}\n`,
  )
  const profile = {
    id: animal.id,
    run: catalog.run,
    candidate: {
      name: animal.name,
      scientificName: animal.scientific,
      sourcePage: 'project-authored (no upstream)',
      downloadURL: `assets/candidates/${catalog.run}/${animal.id}/archive/build_expansion_animal.py`,
      author: 'Prehistoric Animal Museum (project-authored)',
      license: catalog.license,
      licenseEvidence: 'Project-authored deterministic Blender primitives; generator and per-animal catalogue entry archived as reproducible source; dedicated animal source GLB archived separately.',
      accessDate: catalog.accessDate,
    },
    archive: {
      sourceDownload: { path: 'archive/chosen-model.glb', sha256: chosen.sha256, bytes: chosen.bytes },
      generatorSource: { path: 'archive/build_expansion_animal.py', sha256: generator.sha256, bytes: generator.bytes },
      catalogEntry: { path: 'archive/expansion-entry.json', sha256: entry.sha256, bytes: entry.bytes },
      chosenModel: { path: 'archive/chosen-model.glb', sha256: chosen.sha256, bytes: chosen.bytes },
    },
    model: {
      animated: true,
      sourceClip: null,
      mouthMotion: {
        mode: 'disabled',
        reason: 'closed-mouth project-authored reconstruction without a weighted jaw or tongue chain; mouth motion intentionally disabled',
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
      habitat: animal.habitat,
      shadow: animal.habitat === 'land' ? 'ground' : 'none',
    },
    landmarks: { head: [0, 0, 0], tailTip: [0, 0, 0], contacts: [] },
    narration: {
      'zh-CN': {
        path: 'output/audio/narration.zh-CN.mp3',
        scriptPath: 'output/audio/narration.zh-CN.txt',
        metricsPath: 'output/audio/narration.zh-CN.metrics.json',
        speaker: 'Serena', language: 'Chinese', humanReviewStatus: 'pending',
      },
      en: {
        path: 'output/audio/narration.en.mp3',
        scriptPath: 'output/audio/narration.en.txt',
        metricsPath: 'output/audio/narration.en.metrics.json',
        speaker: 'Serena', language: 'English', humanReviewStatus: 'pending',
      },
    },
    assets: { posterPortraitPath: 'output/images/poster-portrait.webp' },
    humanApprovals: {
      science: false, anatomy: false, materials: false, background: false,
      naturalMotion: false, mouthComfort: false, contentZhCN: false,
      contentEn: false, audioZhCN: false, audioEn: false,
      redistribution: false, production: false,
    },
    draft: { kind: animal.kind, atmosphere: animal.atmosphere },
  }
  const profilePath = join(candidateDir, 'profile.json')
  await writeFile(profilePath, `${JSON.stringify(profile, null, 2)}\n`)
  return profilePath
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8')) as Catalog
  const requested = process.argv.slice(2)
  const animals = requested.length
    ? catalog.animals.filter((animal) => requested.includes(animal.id))
    : catalog.animals
  if (animals.length !== (requested.length || catalog.animals.length)) {
    throw new Error('one or more requested ids are absent from expansion-100.json')
  }
  for (const [index, animal] of animals.entries()) {
    console.log(`[${index + 1}/${animals.length}] preparing ${animal.id}`)
    console.log(await prepare(animal, catalog))
  }
}

await main()
