import { definePublishedAnimal } from '../../types'
import { en } from './content.en'
import { zhCN } from './content.zh-CN'
import { provenance } from './provenance'

export const animalDefinition = definePublishedAnimal({
  id: 'dunkleosteus',
  status: 'published',
  kind: 'other-prehistoric-animal',
  habitat: 'water',
  atmosphere: 'underwater',
  content: { 'zh-CN': zhCN, en },
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
      speaker: 'Serena',
      language: 'Chinese',
      humanReviewStatus: 'approved',
    },
    en: {
      status: 'ready',
      sourcePath: 'audio/narration.en.mp3',
      mimeType: 'audio/mpeg',
      speaker: 'Serena',
      language: 'English',
      humanReviewStatus: 'approved',
    },
  },
  provenance,
})
