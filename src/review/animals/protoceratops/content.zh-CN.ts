import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '原角龙',
  classificationLabel: 'Protoceratops andrewsi（dinosaur）',
  visibleFeature: '看看它醒目的“small frill”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是原角龙，学名是Protoceratops andrewsi。',
      '看看它醒目的“small frill”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '原角龙', reading: '原角龙' }],
  },
  facts: {
    period: '晚白垩世（约7500万至7100万年前）',
    discoveryRegions: ["蒙古","中国北部"],
    size: { kind: 'body-length', minMeters: 1.8, maxMeters: 2 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Protoceratops andrewsi在这里采用项目自制的风格化复原。轮廓突出“small frill”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Protoceratops — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/protoceratops',
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
