import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '剑齿虎',
  classificationLabel: '剑齿猫亚科猫科动物',
  visibleFeature: '看看它上颌伸出的两枚扁长犬齿，像不像两把收在嘴边的弯刀？',
  narration: {
    sentences: [
      '这是剑齿虎，一类生活在美洲、长着扁长上犬齿的肉食性猫科动物。',
      '看看它上颌伸出的两枚扁长犬齿，像不像两把收在嘴边的弯刀？',
    ],
    pronunciation: [
      { text: '剑齿虎', reading: 'jiàn chǐ hǔ', note: '并不是真正的虎' },
      { text: '猫科', reading: 'māo kē' },
    ],
  },
  facts: {
    period: '上新世晚期至更新世末（约 250 万年前至约 1.3 万年前，属级范围）',
    discoveryRegions: ['北美洲', '南美洲'],
    size: {
      kind: 'body-length',
      minMeters: 1.7,
      maxMeters: 2.1,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    '剑齿虎属（Smilodon）属于猫科的剑齿猫亚科，并不是真正的虎。研究显示北美致命剑齿虎（S. fatalis）的前肢骨特别粗壮，适合压住大型猎物，再让细长的上犬齿完成咬击；这些犬齿很醒目，却也需要避免承受不合方向的冲击。',
  sources: [
    {
      title: 'The Big Cats — Tule Springs Fossil Beds, National Park Service',
      url: 'https://www.nps.gov/articles/000/the-big-cats.htm',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Body size of Smilodon (Mammalia: Felidae) — Annales Zoologici Fennici',
      url: 'https://pubmed.ncbi.nlm.nih.gov/16235255/',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Radiographs Reveal Exceptional Forelimb Strength in the Sabertooth Cat, Smilodon fatalis — PLOS ONE',
      url: 'https://doi.org/10.1371/journal.pone.0011412',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      '来源只把模型标为“smilodon”，没有指定 S. gracilis、S. fatalis 或 S. populator；属级时代、分布和体型范围不等于种级鉴定。',
      '当前模型按 2.1 米总长展示，靠近大型个体范围；不同种和个体的体型差异显著。',
      '毛色、耳朵软组织、鼻部和肌肉轮廓没有直接化石证据；本模型是风格化雕塑。',
      '来源网格确认只有一个身体连通组件、没有独立底座；新增的呼吸和摆头展示动作已经馆主复核。',
    ],
    editedBy: 'Codex',
    reviewedBy: 'museum-owner',
    reviewedOn: '2026-08-11',
  },
} satisfies AnimalContentZhCN
