import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '阿尔伯塔龙',
  classificationLabel: 'Albertosaurus sarcophagus（dinosaur）',
  visibleFeature: '看看它醒目的“small brow crests”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是阿尔伯塔龙，学名是Albertosaurus sarcophagus。',
      '看看它醒目的“small brow crests”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '阿尔伯塔龙', reading: '阿尔伯塔龙' }],
  },
  facts: {
    period: '晚白垩世（约7100万至6800万年前）',
    discoveryRegions: ["加拿大阿尔伯塔省"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Albertosaurus sarcophagus在这里采用项目自制的风格化复原。轮廓突出“small brow crests”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Albertosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/albertosaurus',
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
