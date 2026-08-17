import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '欧巴宾海蝎',
  classificationLabel: 'Opabinia regalis（other prehistoric animal）',
  visibleFeature: '看看它醒目的“five eyes proboscis”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是欧巴宾海蝎，学名是Opabinia regalis。',
      '看看它醒目的“five eyes proboscis”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '欧巴宾海蝎', reading: '欧巴宾海蝎' }],
  },
  facts: {
    period: '寒武纪（约5.08亿年前）',
    discoveryRegions: ["加拿大不列颠哥伦比亚省"],
    size: { kind: 'body-length', minMeters: 0.09, maxMeters: 0.1 },
    diet: 'unknown',
  },
  parentClassificationNote: 'Opabinia regalis在这里采用项目自制的风格化复原。轮廓突出“five eyes proboscis”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Opabinia — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/opabinia',
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
