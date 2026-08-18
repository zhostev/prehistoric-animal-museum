import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import {
  MODEL_PREVIEW_MANIFEST_FILE,
  modelPreviewProfiles,
} from '../src/viewer/model-preview-profiles'
import type { LocalReviewAnimalId } from '../src/review/assets'

export const localReviewAssetPrefix = '/__museum-review-assets'

function repositoryFile(relativePath: string): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', relativePath)
}

function productionAnimalAsset(
  animalId: LocalReviewAnimalId,
  relativePath: string,
): string {
  return repositoryFile(`src/content/animals/${animalId}/${relativePath}`)
}

const ichthyosaurBackgrounds = {
  landscape: repositoryFile(
    'prototypes/background-art-directions/assets/production-ichthyosaur-landscape.png',
  ),
  portrait: repositoryFile(
    'prototypes/background-art-directions/assets/production-ichthyosaur-portrait.png',
  ),
}

interface ReviewAnimalFiles {
  readonly model: string
  readonly backgroundLandscape: string
  readonly backgroundPortrait: string
  readonly narration?: string
  readonly posterPortrait?: string
  readonly poster: string
  readonly thumbnail: string
}

const reviewAnimalFiles: Readonly<
  Record<LocalReviewAnimalId, ReviewAnimalFiles>
> = {
  stegosaurus: {
    model: repositoryFile(
      'src/content/animals/stegosaurus/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'src/content/animals/stegosaurus/backgrounds/landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'src/content/animals/stegosaurus/backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/stegosaurus/audio-candidates/stegosaurus-serena-preview.mp3',
    ),
    poster: repositoryFile(
      'src/content/animals/stegosaurus/images/poster.webp',
    ),
    thumbnail: repositoryFile(
      'src/content/animals/stegosaurus/images/thumbnail.webp',
    ),
  },
  pachycephalosaurus: {
    model: repositoryFile(
      'assets/candidates/second-pass-sketchfab/normalized-glb/pachycephalosaurus.glb',
    ),
    backgroundLandscape: productionAnimalAsset(
      'pachycephalosaurus',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'pachycephalosaurus',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/pachycephalosaurus.mp3',
    ),
    poster: productionAnimalAsset(
      'pachycephalosaurus',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'pachycephalosaurus',
      'images/thumbnail.webp',
    ),
  },
  ichthyosaur: {
    model: repositoryFile(
      'assets/candidates/ichthyosaur-sketchfab-julian-2026-08-04/output/model-review.glb',
    ),
    backgroundLandscape: ichthyosaurBackgrounds.landscape,
    backgroundPortrait: ichthyosaurBackgrounds.portrait,
    narration: repositoryFile(
      '.handoff/collection-review/audio/ichthyosaur.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/ichthyosaur-sketchfab-julian-2026-08-04/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/ichthyosaur-sketchfab-julian-2026-08-04/output/thumbnail.webp',
    ),
  },
  pteranodon: {
    model: productionAnimalAsset('pteranodon', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'pteranodon',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'pteranodon',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/pteranodon.mp3',
    ),
    poster: productionAnimalAsset(
      'pteranodon',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'pteranodon',
      'images/thumbnail.webp',
    ),
  },
  'tyrannosaurus-rex': {
    model: productionAnimalAsset('tyrannosaurus-rex', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'tyrannosaurus-rex',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'tyrannosaurus-rex',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/tyrannosaurus-rex.mp3',
    ),
    poster: productionAnimalAsset(
      'tyrannosaurus-rex',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'tyrannosaurus-rex',
      'images/thumbnail.webp',
    ),
  },
  triceratops: {
    model: productionAnimalAsset('triceratops', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'triceratops',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'triceratops',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/triceratops.mp3',
    ),
    poster: productionAnimalAsset(
      'triceratops',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'triceratops',
      'images/thumbnail.webp',
    ),
  },
  apatosaurus: {
    model: repositoryFile(
      'assets/candidates/apatosaurus-sketchfab-fecabec8-2026-08/revision-v1/output/apatosaurus-review.glb',
    ),
    backgroundLandscape: productionAnimalAsset(
      'apatosaurus',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'apatosaurus',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/apatosaurus.mp3',
    ),
    poster: productionAnimalAsset(
      'apatosaurus',
      'images/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/apatosaurus-sketchfab-fecabec8-2026-08/revision-v1/output/thumbnail.webp',
    ),
  },
  gigantoraptor: {
    model: productionAnimalAsset('gigantoraptor', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'gigantoraptor',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'gigantoraptor',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/gigantoraptor.mp3',
    ),
    poster: productionAnimalAsset(
      'gigantoraptor',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'gigantoraptor',
      'images/thumbnail.webp',
    ),
  },
  mammoth: {
    model: productionAnimalAsset('mammoth', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'mammoth',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'mammoth',
      'backgrounds/portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/collection-review/audio/mammoth.mp3',
    ),
    poster: productionAnimalAsset(
      'mammoth',
      'images/poster.webp',
    ),
    thumbnail: productionAnimalAsset(
      'mammoth',
      'images/thumbnail.webp',
    ),
  },
  maiasaura: {
    model: productionAnimalAsset('maiasaura', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'maiasaura',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'maiasaura',
      'backgrounds/portrait.webp',
    ),
    narration: productionAnimalAsset(
      'maiasaura',
      'audio/narration.zh-CN.mp3',
    ),
    poster: productionAnimalAsset('maiasaura', 'images/poster.webp'),
    thumbnail: productionAnimalAsset('maiasaura', 'images/thumbnail.webp'),
  },
  plesiosaurus: {
    model: productionAnimalAsset('plesiosaurus', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'plesiosaurus',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'plesiosaurus',
      'backgrounds/portrait.webp',
    ),
    narration: productionAnimalAsset(
      'plesiosaurus',
      'audio/narration.zh-CN.mp3',
    ),
    poster: productionAnimalAsset('plesiosaurus', 'images/poster.webp'),
    thumbnail: productionAnimalAsset(
      'plesiosaurus',
      'images/thumbnail.webp',
    ),
  },
  megalodon: {
    model: productionAnimalAsset('megalodon', 'model/model.glb'),
    backgroundLandscape: productionAnimalAsset(
      'megalodon',
      'backgrounds/landscape.webp',
    ),
    backgroundPortrait: productionAnimalAsset(
      'megalodon',
      'backgrounds/portrait.webp',
    ),
    narration: productionAnimalAsset(
      'megalodon',
      'audio/narration.zh-CN.mp3',
    ),
    poster: productionAnimalAsset('megalodon', 'images/poster.webp'),
    thumbnail: productionAnimalAsset('megalodon', 'images/thumbnail.webp'),
  },
  sauropelta: {
    model: productionAnimalAsset('sauropelta', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/sauropelta/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/sauropelta/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-07-31-batch/sauropelta/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/sauropelta/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/sauropelta/output/thumbnail.webp',
    ),
  },
  dilophosaurus: {
    model: productionAnimalAsset('dilophosaurus', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/dilophosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/dilophosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-07-31-batch/dilophosaurus/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/dilophosaurus/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/dilophosaurus/output/thumbnail.webp',
    ),
  },
  mosasaurus: {
    model: productionAnimalAsset('mosasaurus', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/mosasaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/mosasaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-07-31-batch/mosasaurus/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/mosasaurus/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/mosasaurus/output/thumbnail.webp',
    ),
  },
  rhamphorhynchus: {
    model: productionAnimalAsset('rhamphorhynchus', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/rhamphorhynchus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/rhamphorhynchus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-07-31-rhamphorhynchus/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/rhamphorhynchus/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-07-31/rhamphorhynchus/output/thumbnail.webp',
    ),
  },
  tupandactylus: {
    model: productionAnimalAsset('tupandactylus', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/tupandactylus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/tupandactylus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-08-01-tupandactylus/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/tupandactylus/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/tupandactylus/output/thumbnail.webp',
    ),
  },
  meganeura: {
    model: productionAnimalAsset('meganeura', 'model/model.glb'),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/meganeura/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/meganeura/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      '.handoff/animal-onboarding-runs/2026-08-01-meganeura/narration.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/meganeura/output/poster.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-01/meganeura/output/thumbnail.webp',
    ),
  },
  velociraptor: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/velociraptor/output/thumbnail.webp',
    ),
  },
  parasaurolophus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/parasaurolophus/output/thumbnail.webp',
    ),
  },
  dunkleosteus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/dunkleosteus/output/thumbnail.webp',
    ),
  },
  ammonite: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/ammonite/output/thumbnail.webp',
    ),
  },
  jaekelopterus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/jaekelopterus/output/thumbnail.webp',
    ),
  },
  smilodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/smilodon/output/thumbnail.webp',
    ),
  },
  spinosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13/spinosaurus/output/thumbnail.webp',
    ),
  },
  allosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/output/thumbnail.webp',
    ),
  },
  brachiosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/output/thumbnail.webp',
    ),
  },
  quetzalcoatlus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/output/thumbnail.webp',
    ),
  },
  elasmosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/output/thumbnail.webp',
    ),
  },
  'woolly-rhinoceros': {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/woolly-rhinoceros/output/thumbnail.webp',
    ),
  },
  anomalocaris: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/output/thumbnail.webp',
    ),
  },
  albertosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/output/thumbnail.webp',
    ),
  },
  carnotaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/output/thumbnail.webp',
    ),
  },
  ceratosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/output/thumbnail.webp',
    ),
  },
  coelophysis: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/coelophysis/output/thumbnail.webp',
    ),
  },
  compsognathus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/output/thumbnail.webp',
    ),
  },
  deinonychus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/output/thumbnail.webp',
    ),
  },
  baryonyx: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/output/thumbnail.webp',
    ),
  },
  giganotosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/giganotosaurus/output/thumbnail.webp',
    ),
  },
  suchomimus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/suchomimus/output/thumbnail.webp',
    ),
  },
  oviraptor: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/oviraptor/output/thumbnail.webp',
    ),
  },
  therizinosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/therizinosaurus/output/thumbnail.webp',
    ),
  },
  archaeopteryx: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/archaeopteryx/output/thumbnail.webp',
    ),
  },
  sinosauropteryx: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/sinosauropteryx/output/thumbnail.webp',
    ),
  },
  monolophosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/monolophosaurus/output/thumbnail.webp',
    ),
  },
  herrerasaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/output/thumbnail.webp',
    ),
  },
  utahraptor: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/utahraptor/output/thumbnail.webp',
    ),
  },
  acrocanthosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/output/thumbnail.webp',
    ),
  },
  carcharodontosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/output/thumbnail.webp',
    ),
  },
  microraptor: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/output/thumbnail.webp',
    ),
  },
  diplodocus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/output/thumbnail.webp',
    ),
  },
  argentinosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/output/thumbnail.webp',
    ),
  },
  brontosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/brontosaurus/output/thumbnail.webp',
    ),
  },
  camarasaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/camarasaurus/output/thumbnail.webp',
    ),
  },
  plateosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/plateosaurus/output/thumbnail.webp',
    ),
  },
  ankylosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/output/thumbnail.webp',
    ),
  },
  euoplocephalus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/euoplocephalus/output/thumbnail.webp',
    ),
  },
  kentrosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kentrosaurus/output/thumbnail.webp',
    ),
  },
  protoceratops: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/protoceratops/output/thumbnail.webp',
    ),
  },
  styracosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/styracosaurus/output/thumbnail.webp',
    ),
  },
  pachyrhinosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/pachyrhinosaurus/output/thumbnail.webp',
    ),
  },
  diabloceratops: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/diabloceratops/output/thumbnail.webp',
    ),
  },
  iguanodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/iguanodon/output/thumbnail.webp',
    ),
  },
  edmontosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/output/thumbnail.webp',
    ),
  },
  corythosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/background-portrait.webp',
    ),
    narration: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/audio/narration.zh-CN.mp3',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-18-ai-pilot/corythosaurus/output/thumbnail.webp',
    ),
  },
  lambeosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lambeosaurus/output/thumbnail.webp',
    ),
  },
  gallimimus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gallimimus/output/thumbnail.webp',
    ),
  },
  psittacosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/psittacosaurus/output/thumbnail.webp',
    ),
  },
  heterodontosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/heterodontosaurus/output/thumbnail.webp',
    ),
  },
  dryosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dryosaurus/output/thumbnail.webp',
    ),
  },
  nigersaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nigersaurus/output/thumbnail.webp',
    ),
  },
  dimorphodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimorphodon/output/thumbnail.webp',
    ),
  },
  anhanguera: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/output/thumbnail.webp',
    ),
  },
  tapejara: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tapejara/output/thumbnail.webp',
    ),
  },
  nyctosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nyctosaurus/output/thumbnail.webp',
    ),
  },
  dsungaripterus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dsungaripterus/output/thumbnail.webp',
    ),
  },
  kronosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/kronosaurus/output/thumbnail.webp',
    ),
  },
  liopleurodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/liopleurodon/output/thumbnail.webp',
    ),
  },
  tylosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/tylosaurus/output/thumbnail.webp',
    ),
  },
  ophthalmosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/output/thumbnail.webp',
    ),
  },
  shonisaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/shonisaurus/output/thumbnail.webp',
    ),
  },
  nothosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/nothosaurus/output/thumbnail.webp',
    ),
  },
  placodus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/placodus/output/thumbnail.webp',
    ),
  },
  dimetrodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/output/thumbnail.webp',
    ),
  },
  lystrosaurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/lystrosaurus/output/thumbnail.webp',
    ),
  },
  gorgonops: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gorgonops/output/thumbnail.webp',
    ),
  },
  inostrancevia: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/inostrancevia/output/thumbnail.webp',
    ),
  },
  postosuchus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/postosuchus/output/thumbnail.webp',
    ),
  },
  desmatosuchus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/desmatosuchus/output/thumbnail.webp',
    ),
  },
  megaloceros: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/output/thumbnail.webp',
    ),
  },
  glyptodon: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/output/thumbnail.webp',
    ),
  },
  megatherium: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/megatherium/output/thumbnail.webp',
    ),
  },
  doedicurus: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/doedicurus/output/thumbnail.webp',
    ),
  },
  paraceratherium: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/paraceratherium/output/thumbnail.webp',
    ),
  },
  gomphotherium: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/gomphotherium/output/thumbnail.webp',
    ),
  },
  macrauchenia: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/macrauchenia/output/thumbnail.webp',
    ),
  },
  thylacoleo: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/thylacoleo/output/thumbnail.webp',
    ),
  },
  opabinia: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/opabinia/output/thumbnail.webp',
    ),
  },
  hallucigenia: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/hallucigenia/output/thumbnail.webp',
    ),
  },
  titanoboa: {
    model: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/model/model.glb',
    ),
    backgroundLandscape: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/background-landscape.webp',
    ),
    backgroundPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/background-portrait.webp',
    ),
    poster: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/poster.webp',
    ),
    posterPortrait: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/images/poster-portrait.webp',
    ),
    thumbnail: repositoryFile(
      'assets/candidates/animal-onboarding-2026-08-13-expansion-100/titanoboa/output/thumbnail.webp',
    ),
  },
}

const routeFilePairs = Object.entries(reviewAnimalFiles).flatMap(
  ([animalId, files]) => {
    const modelPreviewDirectory = repositoryFile(
      `assets/review-generated/model-previews/${animalId}`,
    )
    const posterPortrait =
      files.posterPortrait ??
      productionAnimalAsset(
        animalId as LocalReviewAnimalId,
        'images/poster-portrait.webp',
      )
    const modelPreviewFiles = [
      ...modelPreviewProfiles.map(
        ({ fileName }) =>
          [fileName, resolve(modelPreviewDirectory, fileName)] as const,
      ),
      [
        MODEL_PREVIEW_MANIFEST_FILE,
        resolve(modelPreviewDirectory, MODEL_PREVIEW_MANIFEST_FILE),
      ] as const,
    ]
    const filePairs = [
      ['model.glb', files.model],
      ['background-landscape', files.backgroundLandscape],
      ['background-portrait', files.backgroundPortrait],
      ['poster.webp', files.poster],
      ['poster-portrait.webp', posterPortrait],
      ['thumbnail.webp', files.thumbnail],
      ...modelPreviewFiles,
      ...(files.narration === undefined
        ? []
        : ([['narration.mp3', files.narration]] as const)),
    ] satisfies readonly (readonly [string, string])[]

    return filePairs.map(
      ([fileName, absolutePath]) =>
        [
          `${localReviewAssetPrefix}/${animalId}/${fileName}`,
          absolutePath,
        ] as const,
    )
  },
)

export const localReviewAssetFiles: ReadonlyMap<string, string> = new Map(
  routeFilePairs,
)
