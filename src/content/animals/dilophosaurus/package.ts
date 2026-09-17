import { definePublishedAnimal } from '../../types'
import { en } from './content.en'
import { zhCN } from './content.zh-CN'
import { provenance } from './provenance'

export const animalDefinition = definePublishedAnimal({
  id: "dilophosaurus",
  status: 'published',
  kind: "dinosaur",
  habitat: "land",
  atmosphere: "plains",
  content: { 'zh-CN': zhCN, en },
  presentation: {
    initialYawDegrees: -70,
    landscapeHorizontalOffset: -0.03,
    landscapeVerticalOffset: -0.09,
    portraitVerticalOffset: -0.07,
    portraitSafeAreaPadding: 0.16,
    safeAreaPadding: 0.14,
    preciseBounds: true,
    shadow: 'ground',
    shadowOpacity: 0.52,
    shadowScale: 0.7,
    shadowYOffset: 0,
    toneMappingExposure: 1.05,
  },
  animation: {
    "clip": "Idle",
    "loop": "repeat",
    "speed": 1
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
