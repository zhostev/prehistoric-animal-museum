import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '披毛犀',
  classificationLabel: 'Coelodonta antiquitatis（other prehistoric animal）',
  visibleFeature: '看看它醒目的“rhino horns”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是披毛犀，学名是Coelodonta antiquitatis。',
      '看看它醒目的“rhino horns”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '披毛犀', reading: '披毛犀' }],
  },
  facts: {
    period: '更新世（约35万至1万年前）',
    discoveryRegions: ["欧亚大陆"],
    size: { kind: 'body-length', minMeters: 3.42, maxMeters: 3.8 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Coelodonta antiquitatis在这里采用项目自制的风格化复原。轮廓突出“rhino horns”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Woolly rhinoceros — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/woolly-rhinoceros',
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
