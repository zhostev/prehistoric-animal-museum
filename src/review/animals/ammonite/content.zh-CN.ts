import type { AnimalContentZhCN } from '../../../content/types'

export const zhCN = {
  name: '菊石壳扫描',
  classificationLabel: '已灭绝的海生头足类化石壳（标本身份待核）',
  visibleFeature: '看看这枚盘卷的壳，一圈绕着一圈，像不像一条卷起来的石头绳子？',
  narration: {
    sentences: [
      '这是一件菊石化石壳的三维扫描，不是带有软体部分的活体复原。',
      '看看这枚盘卷的壳，一圈绕着一圈，像不像一条卷起来的石头绳子？',
    ],
    pronunciation: [
      { text: '菊石', reading: 'jú shí' },
      { text: '头足类', reading: 'tóu zú lèi' },
    ],
  },
  facts: {
    period: '泥盆纪至白垩纪末（菊石类群范围；本扫描标本的年代未提供）',
    discoveryRegions: ['世界多地的古代海相地层（本扫描标本的产地未提供）'],
    size: {
      kind: 'group-range',
      minMeters: 0.01,
      maxMeters: 2,
      note: '菊石不同种类和生长阶段的壳径差异很大；当前模型的 0.40 米显示尺寸不是标本实测值。',
    },
    diet: 'unknown',
  },
  parentClassificationNote:
    '菊石是已经灭绝的海生头足类软体动物。它们会随着生长增加新的壳室，带隔壁的旧壳室参与调节浮力。化石记录里最常保存的是硬壳，软体部分极少见；这份来源也只提供了一枚化石壳扫描，因此展览没有补画触手、眼睛或其他软组织。',
  sources: [
    {
      title: 'What is an ammonite? — Natural History Museum',
      url: 'https://www.nhm.ac.uk/discover/what-is-an-ammonite.html',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Ammonite Fossil (2246008) — Internet Archive',
      url: 'https://archive.org/details/thingiverse-2246008',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      '来源只写“Ammonite Fossil”，没有属种、地层、年代、产地或标本编号；不能从外形替来源补做科学鉴定。',
      '当前资产是单个化石壳的表面扫描，不是活体复原；任何软体结构、生活姿态和体色都没有被加入。',
      '0.40 米是网页展示归一化尺寸，不是原标本的量尺数据；类群尺寸范围只提供背景知识，不能套用到这件扫描。',
      '馆主已复核文案与化石壳材料表现；标本科学身份依然因来源信息不足而无法细定。',
    ],
    editedBy: 'Codex',
    reviewedBy: 'museum-owner',
    reviewedOn: '2026-08-11',
  },
} satisfies AnimalContentZhCN
