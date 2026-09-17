import { definePublishedAnimal } from '../../types'
import { en } from './content.en'
import { zhCN } from './content.zh-CN'
import { provenance } from './provenance'

export const animalDefinition = definePublishedAnimal({
  id: 'glyptodon',
  status: 'published',
  kind: 'other-prehistoric-animal',
  habitat: 'land',
  atmosphere: 'plains',
  content: { 'zh-CN': zhCN, en },
  presentation: {
    initialYawDegrees: -70,
    landscapeVerticalOffset: -0.09,
    portraitVerticalOffset: -0.06,
    safeAreaPadding: 0.12,
    preciseBounds: true,
    shadow: 'ground',
    shadowOpacity: 0.5,
    shadowScale: 0.72,
    shadowYOffset: 0,
  },
  animation: {
    clip: 'Idle',
    loop: 'repeat',
    speed: 0.8,
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
