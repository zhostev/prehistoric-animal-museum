import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '异齿龙',
  classificationLabel: 'Heterodontosaurus tucki（dinosaur）',
  visibleFeature: '看看它醒目的“tusks”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是异齿龙，学名是Heterodontosaurus tucki。',
      '看看它醒目的“tusks”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '异齿龙', reading: '异齿龙' }],
  },
  facts: {
    period: '早侏罗世（约2亿至1.9亿年前）',
    discoveryRegions: ["南非"],
    size: { kind: 'body-length', minMeters: 1.08, maxMeters: 1.2 },
    diet: 'omnivore',
  },
  parentClassificationNote: 'Heterodontosaurus tucki在这里采用项目自制的风格化复原。轮廓突出“tusks”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Heterodontosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/heterodontosaurus',
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
