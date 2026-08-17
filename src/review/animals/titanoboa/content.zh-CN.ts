import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '泰坦巨蟒',
  classificationLabel: 'Titanoboa cerrejonensis（other prehistoric animal）',
  visibleFeature: '看看它醒目的“giant serpent”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是泰坦巨蟒，学名是Titanoboa cerrejonensis。',
      '看看它醒目的“giant serpent”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '泰坦巨蟒', reading: '泰坦巨蟒' }],
  },
  facts: {
    period: '古新世（约6000万至5800万年前）',
    discoveryRegions: ["哥伦比亚"],
    size: { kind: 'body-length', minMeters: 11.7, maxMeters: 13 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Titanoboa cerrejonensis在这里采用项目自制的风格化复原。轮廓突出“giant serpent”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Titanoboa — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/titanoboa',
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
