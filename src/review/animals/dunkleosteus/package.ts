import type { CompleteDraftAnimalPackage } from '../../types'
import { reviewAssetUrl } from '../../assets'
import { zhCN } from './content.zh-CN'
import { en } from './content.en'

export const animal = {
  id: 'dunkleosteus',
  status: 'draft',
  reviewRevision: true,
  kind: 'other-prehistoric-animal',
  habitat: 'water',
  atmosphere: 'underwater',
  content: {
    'zh-CN': zhCN,
    en,
  },
  presentation: {
    initialYawDegrees: 90,
    safeAreaPadding: 0.12,
    preciseBounds: true,
    shadow: 'none',
  },
  animation: {
    clip: 'Idle',
    loop: 'repeat',
    speed: 1,
  },
  narration: {
    'zh-CN': {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
    },
    en: {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
    },
  },
  provenance: [],
  assets: {
    model: reviewAssetUrl('dunkleosteus', 'model.glb'),
    modelBytes: 2629504,
    poster: reviewAssetUrl('dunkleosteus', 'poster.webp'),
    posterPortrait: reviewAssetUrl('dunkleosteus', 'poster-portrait.webp'),
    thumbnail: reviewAssetUrl('dunkleosteus', 'thumbnail.webp'),
    backgrounds: {
      landscape: reviewAssetUrl('dunkleosteus', 'background-landscape'),
      portrait: reviewAssetUrl('dunkleosteus', 'background-portrait'),
    },
    narration: {
    'zh-CN': {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('dunkleosteus', 'narration.mp3'),
    },
    'en': {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('dunkleosteus', 'narration.mp3'),
    },
    },
  },
  review: {
    badge: '自动 QA 通过',
    status: '邓氏鱼完整本地草稿，等待科学、视觉、动作与听审',
    note:
      'EvolutionIncarnate 发布的 CC0-1.0 模型，源档案、许可证据、自包含 GLB、预算、八秒 Idle、landmarks 投影与五视口证据由自动化核对。 科学身份、解剖、材质、动作自然度、背景、文案、听审与公开分发决定全部仍是 human-only。',
    checks: [
      '恢复初始视角，确认头部清楚位于画面左侧；再 360° 核对轮廓与附件结构。',
      '完整观看两个八秒循环，确认 Idle 可读、无断裂或穿插。',
      '在横版与竖版背景复看材质、眼睛和轮廓的对比度。',
      '完整听审 Serena 中文与英文旁白（生成后）。',
    ],
    accent: {
      strong: '#2f5d7a',
      soft: '#bcd9e8',
    },
    modelCredit: {
      attribution:
        '"Dunkleosteus" by EvolutionIncarnate, CC0 1.0 Universal Public Domain Dedication. Normalized by the Prehistoric Animal Museum project for local review.',
      licenseName: 'CC0 1.0 Universal Public Domain Dedication',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceTitle: 'Dunkleosteus',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dunkliferecon.stl',
    },
  },
  draftNotes: [
    '这是已有生产动物的待审修订；本地 review 使用候选资产，线上生产集合和资产保持不变。',
    '自动 hard gates 已通过，但科学身份、解剖、材质、动作自然度、背景、中文内容、完整听审和公开分发决定仍是 human-only。',
    '只有产品负责人明确批准后才能记录 approval 并执行生产晋升。',
  ],
} satisfies CompleteDraftAnimalPackage
