import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '单脊龙',
  classificationLabel: 'Monolophosaurus jiangi（dinosaur）',
  visibleFeature: '看看它醒目的“single crest”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是单脊龙，学名是Monolophosaurus jiangi。',
      '看看它醒目的“single crest”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '单脊龙', reading: '单脊龙' }],
  },
  facts: {
    period: '中侏罗世（约1.65亿年前）',
    discoveryRegions: ["中国新疆"],
    size: { kind: 'body-length', minMeters: 4.95, maxMeters: 5.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Monolophosaurus jiangi在这里采用项目自制的风格化复原。轮廓突出“single crest”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Monolophosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/monolophosaurus',
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
