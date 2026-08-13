import type { AnimalContentZhCN } from '../../types'

export const zhCN = {
  name: '耶克尔鲎',
  classificationLabel: '翼肢鲎类广翅鲎（来源身份未解）',
  visibleFeature: '看看它身体前端那对带刺的大附肢，像不像两把用来抓住猎物的钳子？',
  narration: {
    sentences: [
      '模型包内文件名把它标作耶克尔鲎，但来源条目标题写的是巨型鲎属，身份还需要核对。',
      '看看它身体前端那对带刺的大附肢，像不像两把用来抓住猎物的钳子？',
    ],
    pronunciation: [
      { text: '耶克尔鲎', reading: 'yē kè ěr hòu' },
      { text: '广翅鲎', reading: 'guǎng chì hòu' },
    ],
  },
  facts: {
    period: '早泥盆世（约 4.1 亿至 3.93 亿年前；若耶克尔鲎鉴定成立）',
    discoveryRegions: ['德国莱茵兰—普法尔茨州（耶克尔鲎莱茵种）'],
    size: {
      kind: 'body-length',
      minMeters: 2.3,
      maxMeters: 2.6,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    '耶克尔鲎莱茵种（Jaekelopterus rhenaniae）是一种大型翼肢鲎类广翅鲎。德国出土的一件约 46 厘米长的螯肢化石，按近缘种比例推算，对应约 2.5 米体长；这个数字是由局部化石外推的最大个体估计，不是完整骨架的直接量尺。',
  sources: [
    {
      title: 'Giant claw reveals the largest ever arthropod — Biology Letters',
      url: 'https://doi.org/10.1098/rsbl.2007.0491',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Megalograptus (4702654) — Internet Archive',
      url: 'https://archive.org/details/thingiverse-4702654',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      '来源条目标题是“Megalograptus”，下载包中的模型文件却叫“Jaekelopterus.stl”；没有额外标本号或作者鉴定说明可以消除冲突。',
      '展签中的早泥盆世、德国和约 2.5 米信息属于 Jaekelopterus rhenaniae；只有在包内文件名鉴定正确时才适用于模型。',
      '2.5 米来自 46 厘米螯肢与近缘种比例的外推，属于最大体长估计；当前模型按 2.5 米展示，不代表常见个体大小。',
      '体色、软组织、游泳姿态和分节摆动均为馆主已复核的审慎展示设计，不代表来源身份冲突已解决。',
    ],
    editedBy: 'Codex',
    reviewedBy: 'zho',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentZhCN
