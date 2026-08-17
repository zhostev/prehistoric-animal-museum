import type { CompleteDraftAnimalPackage } from '../../types'
import { reviewAssetUrl } from '../../assets'
import { zhCN } from './content.zh-CN'
import { en } from './content.en'

export const animal = {
  id: 'giganotosaurus',
  status: 'draft',
  kind: 'dinosaur',
  habitat: 'land',
  atmosphere: 'plains',
  content: {
    'zh-CN': zhCN,
    en,
  },
  presentation: {
    initialYawDegrees: 90,
    safeAreaPadding: 0.12,
    preciseBounds: true,
    shadow: 'ground',
    shadowOpacity: 0.5,
    shadowScale: 0.5,
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
    model: reviewAssetUrl('giganotosaurus', 'model.glb'),
    modelBytes: 157112,
    poster: reviewAssetUrl('giganotosaurus', 'poster.webp'),
    posterPortrait: reviewAssetUrl('giganotosaurus', 'poster-portrait.webp'),
    thumbnail: reviewAssetUrl('giganotosaurus', 'thumbnail.webp'),
    backgrounds: {
      landscape: reviewAssetUrl('giganotosaurus', 'background-landscape'),
      portrait: reviewAssetUrl('giganotosaurus', 'background-portrait'),
    },
    narration: {
    'zh-CN': {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('giganotosaurus', 'narration.mp3'),
    },
    'en': {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('giganotosaurus', 'narration.mp3'),
    },
    },
  },
  review: {
    badge: '自动 QA 通过',
    status: '南方巨兽龙完整本地草稿，等待科学、视觉、动作与听审',
    note:
      'Prehistoric Animal Museum (project-authored) 发布的 CC0-1.0 模型，源档案、许可证据、自包含 GLB、预算、八秒 Idle、landmarks 投影与五视口证据由自动化核对。 科学身份、解剖、材质、动作自然度、背景、文案、听审与公开分发决定全部仍是 human-only。',
    checks: [
      '恢复初始视角，确认头部清楚位于画面左侧；再 360° 核对轮廓与附件结构。',
      '完整观看两个八秒循环，确认 Idle 可读、无断裂或穿插。',
      '在横版与竖版背景复看材质、眼睛和轮廓的对比度。',
      '完整听审 Serena 中文与英文旁白（生成后）。',
    ],
    accent: {
      strong: '#7a5a3a',
      soft: '#e8d3a5',
    },
    modelCredit: {
      attribution:
        '"Giganotosaurus" by Prehistoric Animal Museum (project-authored), CC0 1.0 Universal Public Domain Dedication. Normalized by the Prehistoric Animal Museum project for local review.',
      licenseName: 'CC0 1.0 Universal Public Domain Dedication',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceTitle: 'Giganotosaurus',
      sourceUrl: 'project-authored (no upstream)',
    },
  },
  draftNotes: [
    '仅加入显式本地 review allowlist；没有进入 src/content/animals 或生产集合。',
    '自动 hard gates 已通过，但科学身份、解剖、材质、动作自然度、背景、中文内容、完整听审和公开分发决定仍是 human-only。',
    '只有产品负责人明确批准后才能记录 approval 并执行生产晋升。',
  ],
} satisfies CompleteDraftAnimalPackage
