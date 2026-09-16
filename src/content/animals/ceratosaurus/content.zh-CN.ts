import type { AnimalContentZhCN } from '../../types'

export const zhCN = {
  name: '角鼻龙',
  classificationLabel: 'Ceratosaurus nasicornis（dinosaur）',
  visibleFeature: '看看它醒目的“nose horn”外形，再观察轻轻的呼吸、转头和尾部动作。',
  narration: {
    sentences: [
      '这是角鼻龙，学名是Ceratosaurus nasicornis。',
      '看看它醒目的“nose horn”外形，再观察轻轻的呼吸、转头和尾部动作。',
    ],
    pronunciation: [{ text: '角鼻龙', reading: '角鼻龙' }],
  },
  facts: {
    period: '晚侏罗世（约1.53亿至1.48亿年前）',
    discoveryRegions: ["美国西部","葡萄牙"],
    size: { kind: 'body-length', minMeters: 5.85, maxMeters: 6.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Ceratosaurus nasicornis在这里采用项目自制的风格化复原。轮廓突出“nose horn”这一展示特征；体色和软组织属于审慎的展陈选择，并非化石直接保存的信息。',
  sources: [{
    title: 'Ceratosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/ceratosaurus',
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
