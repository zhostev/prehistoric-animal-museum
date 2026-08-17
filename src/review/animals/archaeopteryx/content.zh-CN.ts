import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '始祖鸟',
  classificationLabel: 'Archaeopteryx lithographica（other prehistoric animal）',
  visibleFeature: '看看它醒目的“wing feathers”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是始祖鸟，学名是Archaeopteryx lithographica。',
      '看看它醒目的“wing feathers”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '始祖鸟', reading: '始祖鸟' }],
  },
  facts: {
    period: '晚侏罗世（约1.5亿年前）',
    discoveryRegions: ["德国巴伐利亚"],
    size: { kind: 'body-length', minMeters: 0.45, maxMeters: 0.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Archaeopteryx lithographica在这里采用项目自制的风格化复原。轮廓突出“wing feathers”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Archaeopteryx — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/archaeopteryx',
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
