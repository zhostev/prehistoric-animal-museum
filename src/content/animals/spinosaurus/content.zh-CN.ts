import type { AnimalContentZhCN } from '../../types'

export const zhCN = {
  name: '棘龙',
  classificationLabel: '棘龙科兽脚类恐龙',
  visibleFeature: '看看它背上高高的帆和细长的吻部，像不像一只为河岸生活特别改造的大型猎手？',
  narration: {
    sentences: [
      '这是棘龙，一种生活在晚白垩世北非河流环境附近的大型肉食性恐龙。',
      '看看它背上高高的帆和细长的吻部，像不像一只为河岸生活特别改造的大型猎手？',
    ],
    pronunciation: [
      { text: '棘龙', reading: 'jí lóng' },
      { text: '白垩世', reading: 'bái è shì' },
    ],
  },
  facts: {
    period: '晚白垩世早期（约 9900 万至 9400 万年前）',
    discoveryRegions: ['摩洛哥（卡玛卡玛群）', '埃及（历史模式材料）'],
    size: {
      kind: 'body-length',
      minMeters: 13,
      maxMeters: 14.5,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    '埃及棘龙（Spinosaurus aegyptiacus）是棘龙科兽脚类。它有细长吻部、圆锥形牙齿、高大的背部神经棘和纵向加深的尾巴。2020 年的尾部化石与水动力实验支持尾巴能在水中产生推进力，但它究竟多常游泳、是否会追逐水下猎物，仍在持续讨论。',
  sources: [
    {
      title: 'Semiaquatic adaptations in a giant predatory dinosaur — Science',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25213375/',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Tail-propelled aquatic locomotion in a theropod dinosaur — Nature',
      url: 'https://doi.org/10.1038/s41586-020-2190-3',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Spinosaurus is not an aquatic dinosaur — eLife',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36448670/',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      '棘龙化石并不组成一具完整成年骨架，13–14.5 米体长来自复合重建与比例估计；当前模型固定为 13.0 米，采用范围的保守端。',
      '水生能力仍有争论：尾部产生水中推进力的证据不等于证明它是高度水生、持续潜水追猎的动物。',
      '当前项目自制低多边形模型加厚了腿部并强化帆—尾凹口，但没有完整表现已知尾部的纵向深度；馆主已在保留该限制说明的前提下复核解剖表现。',
      '体色、帆缘颜色、姿态和 Idle 自然度属于展示设计，不是化石直接证据。',
    ],
    editedBy: 'Codex',
    reviewedBy: 'zho',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentZhCN
