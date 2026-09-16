import type { CompleteDraftAnimalPackage } from '../../types'
import { reviewAssetUrl } from '../../assets'
import { zhCN } from './content.zh-CN'
import { en } from './content.en'

export const animal = {
  id: 'microraptor',
  status: 'draft',
  kind: 'dinosaur',
  habitat: 'air',
  atmosphere: 'forest',
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
    model: reviewAssetUrl('microraptor', 'model.glb'),
    modelBytes: 160600,
    poster: reviewAssetUrl('microraptor', 'poster.webp'),
    posterPortrait: reviewAssetUrl('microraptor', 'poster-portrait.webp'),
    thumbnail: reviewAssetUrl('microraptor', 'thumbnail.webp'),
    backgrounds: {
      landscape: reviewAssetUrl('microraptor', 'background-landscape'),
      portrait: reviewAssetUrl('microraptor', 'background-portrait'),
    },
    narration: {
    'zh-CN': {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('microraptor', 'narration.mp3'),
    },
    'en': {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('microraptor', 'narration.mp3'),
    },
    },
  },
  review: {
    badge: '已验收',
    status: '小盗龙已完成人工验收，等待或已完成生产晋升',
    note:
      'Prehistoric Animal Museum (project-authored) 发布的 CC0-1.0 模型，源档案、许可证据、自包含 GLB、预算、八秒 Idle、landmarks 投影与五视口证据均通过自动化核对；科学、解剖、材质、动作、背景、双语文案、双语听审、公开分发与生产决定已由产品负责人明确验收。',
    checks: [
      '恢复初始视角，确认头部清楚位于画面左侧；再 360° 核对轮廓与附件结构。',
      '完整观看两个八秒循环，确认 Idle 可读、无断裂或穿插。',
      '在横版与竖版背景复看材质、眼睛和轮廓的对比度。',
      '完整听审 Serena 中文与英文旁白（生成后）。',
    ],
    accent: {
      strong: '#5d6b8a',
      soft: '#d3dcef',
    },
    modelCredit: {
      attribution:
        '"Microraptor" by Prehistoric Animal Museum (project-authored), CC0 1.0 Universal Public Domain Dedication. Normalized by the Prehistoric Animal Museum project for local review.',
      licenseName: 'CC0 1.0 Universal Public Domain Dedication',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceTitle: 'Microraptor',
      sourceUrl: 'project-authored (no upstream)',
    },
  },
  draftNotes: [
    '全部 human-only 类别已由产品负责人明确验收并写入哈希审批记录。',
    '本包可以通过受保护的原子生产事务晋升；生产集合始终是运行时权威。',
  ],
} satisfies CompleteDraftAnimalPackage
