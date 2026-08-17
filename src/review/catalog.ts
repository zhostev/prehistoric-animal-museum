import { mainAnimals } from '../content/catalog'
import { animal as stegosaurus } from '../content/animals/stegosaurus/animal'
import type { PublishedAnimalPackage } from '../content/types'
import { reviewAssetUrl } from './assets'
import { animal as apatosaurus } from './animals/apatosaurus/package'
import { animal as gigantoraptor } from './animals/gigantoraptor/package'
import { animal as ichthyosaur } from './animals/ichthyosaur/package'
import { animal as maiasaura } from './animals/maiasaura/package'
import { animal as mammoth } from './animals/mammoth/package'
import { animal as megalodon } from './animals/megalodon/package'
import { animal as pachycephalosaurus } from './animals/pachycephalosaurus/package'
import { animal as plesiosaurus } from './animals/plesiosaurus/package'
import { animal as pteranodon } from './animals/pteranodon/package'
import { animal as triceratops } from './animals/triceratops/package'
import { animal as tyrannosaurusRex } from './animals/tyrannosaurus-rex/package'
import { animal as dilophosaurusDraft } from './animals/dilophosaurus/package'
import { animal as mosasaurusDraft } from './animals/mosasaurus/package'
import { animal as sauropeltaDraft } from './animals/sauropelta/package'
import { animal as rhamphorhynchusDraft } from './animals/rhamphorhynchus/package'
import { animal as tupandactylusDraft } from './animals/tupandactylus/package'
import { animal as meganeuraDraft } from './animals/meganeura/package'
import { animal as velociraptorDraft } from './animals/velociraptor/package'
import { animal as parasaurolophusDraft } from './animals/parasaurolophus/package'
import { animal as dunkleosteusDraft } from './animals/dunkleosteus/package'
import { animal as ammoniteDraft } from './animals/ammonite/package'
import { animal as jaekelopterusDraft } from './animals/jaekelopterus/package'
import { animal as smilodonDraft } from './animals/smilodon/package'
import { animal as spinosaurusDraft } from './animals/spinosaurus/package'
import { animal as allosaurusDraft } from './animals/allosaurus/package'
import { animal as brachiosaurusDraft } from './animals/brachiosaurus/package'
import { animal as quetzalcoatlusDraft } from './animals/quetzalcoatlus/package'
import { animal as elasmosaurusDraft } from './animals/elasmosaurus/package'
import { animal as woollyRhinocerosDraft } from './animals/woolly-rhinoceros/package'
import { animal as anomalocarisDraft } from './animals/anomalocaris/package'
import { animal as albertosaurusDraft } from './animals/albertosaurus/package'
import { animal as carnotaurusDraft } from './animals/carnotaurus/package'
import { animal as ceratosaurusDraft } from './animals/ceratosaurus/package'
import { animal as coelophysisDraft } from './animals/coelophysis/package'
import { animal as compsognathusDraft } from './animals/compsognathus/package'
import { animal as deinonychusDraft } from './animals/deinonychus/package'
import { animal as baryonyxDraft } from './animals/baryonyx/package'
import { animal as giganotosaurusDraft } from './animals/giganotosaurus/package'
import { animal as suchomimusDraft } from './animals/suchomimus/package'
import { animal as oviraptorDraft } from './animals/oviraptor/package'
import { animal as therizinosaurusDraft } from './animals/therizinosaurus/package'
import { animal as archaeopteryxDraft } from './animals/archaeopteryx/package'
import { animal as sinosauropteryxDraft } from './animals/sinosauropteryx/package'
import { animal as monolophosaurusDraft } from './animals/monolophosaurus/package'
import { animal as herrerasaurusDraft } from './animals/herrerasaurus/package'
import { animal as utahraptorDraft } from './animals/utahraptor/package'
import { animal as acrocanthosaurusDraft } from './animals/acrocanthosaurus/package'
import { animal as carcharodontosaurusDraft } from './animals/carcharodontosaurus/package'
import { animal as microraptorDraft } from './animals/microraptor/package'
import { animal as diplodocusDraft } from './animals/diplodocus/package'
import { animal as argentinosaurusDraft } from './animals/argentinosaurus/package'
import { animal as brontosaurusDraft } from './animals/brontosaurus/package'
import { animal as camarasaurusDraft } from './animals/camarasaurus/package'
import { animal as plateosaurusDraft } from './animals/plateosaurus/package'
import { animal as ankylosaurusDraft } from './animals/ankylosaurus/package'
import { animal as euoplocephalusDraft } from './animals/euoplocephalus/package'
import { animal as kentrosaurusDraft } from './animals/kentrosaurus/package'
import { animal as protoceratopsDraft } from './animals/protoceratops/package'
import { animal as styracosaurusDraft } from './animals/styracosaurus/package'
import { animal as pachyrhinosaurusDraft } from './animals/pachyrhinosaurus/package'
import { animal as diabloceratopsDraft } from './animals/diabloceratops/package'
import { animal as iguanodonDraft } from './animals/iguanodon/package'
import { animal as edmontosaurusDraft } from './animals/edmontosaurus/package'
import { animal as corythosaurusDraft } from './animals/corythosaurus/package'
import { animal as lambeosaurusDraft } from './animals/lambeosaurus/package'
import { animal as gallimimusDraft } from './animals/gallimimus/package'
import { animal as psittacosaurusDraft } from './animals/psittacosaurus/package'
import { animal as heterodontosaurusDraft } from './animals/heterodontosaurus/package'
import { animal as dryosaurusDraft } from './animals/dryosaurus/package'
import { animal as nigersaurusDraft } from './animals/nigersaurus/package'
import { animal as dimorphodonDraft } from './animals/dimorphodon/package'
import { animal as anhangueraDraft } from './animals/anhanguera/package'
import { animal as tapejaraDraft } from './animals/tapejara/package'
import { animal as nyctosaurusDraft } from './animals/nyctosaurus/package'
import { animal as dsungaripterusDraft } from './animals/dsungaripterus/package'
import { animal as kronosaurusDraft } from './animals/kronosaurus/package'
import { animal as liopleurodonDraft } from './animals/liopleurodon/package'
import { animal as tylosaurusDraft } from './animals/tylosaurus/package'
import { animal as ophthalmosaurusDraft } from './animals/ophthalmosaurus/package'
import { animal as shonisaurusDraft } from './animals/shonisaurus/package'
import { animal as nothosaurusDraft } from './animals/nothosaurus/package'
import { animal as placodusDraft } from './animals/placodus/package'
import { animal as dimetrodonDraft } from './animals/dimetrodon/package'
import { animal as lystrosaurusDraft } from './animals/lystrosaurus/package'
import { animal as gorgonopsDraft } from './animals/gorgonops/package'
import { animal as inostranceviaDraft } from './animals/inostrancevia/package'
import { animal as postosuchusDraft } from './animals/postosuchus/package'
import { animal as desmatosuchusDraft } from './animals/desmatosuchus/package'
import { animal as megalocerosDraft } from './animals/megaloceros/package'
import { animal as glyptodonDraft } from './animals/glyptodon/package'
import { animal as megatheriumDraft } from './animals/megatherium/package'
import { animal as doedicurusDraft } from './animals/doedicurus/package'
import { animal as paraceratheriumDraft } from './animals/paraceratherium/package'
import { animal as gomphotheriumDraft } from './animals/gomphotherium/package'
import { animal as macraucheniaDraft } from './animals/macrauchenia/package'
import { animal as thylacoleoDraft } from './animals/thylacoleo/package'
import { animal as opabiniaDraft } from './animals/opabinia/package'
import { animal as hallucigeniaDraft } from './animals/hallucigenia/package'
import { animal as titanoboaDraft } from './animals/titanoboa/package'
import type {
  CompleteDraftAnimalPackage,
  DisplayableAnimalPackage,
} from './types'
import {
  reviewNarrationAssetFor,
  reviewNarrationPlanFor,
} from './types'

const reviewedStegosaurus = {
  ...stegosaurus,
  assets: {
    ...stegosaurus.assets,
    model: reviewAssetUrl('stegosaurus', 'model.glb'),
    poster: reviewAssetUrl('stegosaurus', 'poster.webp'),
    posterPortrait: reviewAssetUrl('stegosaurus', 'poster-portrait.webp'),
    thumbnail: reviewAssetUrl('stegosaurus', 'thumbnail.webp'),
    backgrounds: {
      landscape: reviewAssetUrl('stegosaurus', 'background-landscape'),
      portrait: reviewAssetUrl('stegosaurus', 'background-portrait'),
    },
    narration: {
      status: 'ready',
      sourcePath: 'audio/narration.zh-CN.mp3',
      mimeType: 'audio/mpeg',
      url: reviewAssetUrl('stegosaurus', 'narration.mp3'),
    },
  },
  review: {
    badge: '已听审',
    status: '剑龙基准包',
    note:
      '模型、场景、文案和 Serena 完整旁白均已通过人工验收；8.51 秒时长例外已获确认。官方一手材料支持 Serena 输出公开分发，本包现已进入生产集合。',
    checks: [
      '作为其余动物的构图、材质、灯光和交互基准。',
      '确认旁白播放、暂停和动物切换后的停止回零。',
    ],
    accent: {
      strong: '#a85f2f',
      soft: '#f2d1a5',
    },
  },
} satisfies DisplayableAnimalPackage

function acceptedOnboardingAnimal(
  animal: PublishedAnimalPackage,
  draft: CompleteDraftAnimalPackage,
): DisplayableAnimalPackage {
  return {
    ...animal,
    review: {
      ...draft.review,
      badge: '已验收',
      status: `${animal.content['zh-CN'].name}自动化新增包已晋升生产`,
      note: `${draft.review.note} 产品负责人已于 ${animal.content['zh-CN'].editorial.reviewedOn} 完成科学、视觉、动作、完整听审、公开分发与生产晋升验收。`,
    },
  }
}

function mergePublishedReviewAnimal(
  productionAnimal: PublishedAnimalPackage,
  reviewAnimal: DisplayableAnimalPackage,
): DisplayableAnimalPackage {
  if (!reviewAnimal.review) {
    return productionAnimal
  }
  return {
    ...reviewAnimal,
    status: 'published',
    review: reviewAnimal.review,
    content: {
      'zh-CN': reviewAnimal.content['zh-CN'],
      en: reviewAnimal.content.en ?? productionAnimal.content.en,
    },
    narration: {
      'zh-CN':
        reviewNarrationPlanFor(reviewAnimal.narration, 'zh-CN') ??
        productionAnimal.narration['zh-CN'],
      en:
        reviewNarrationPlanFor(reviewAnimal.narration, 'en') ??
        productionAnimal.narration.en,
    },
    assets: {
      ...reviewAnimal.assets,
      narration: {
        'zh-CN':
          reviewNarrationAssetFor(
            reviewAnimal.assets.narration,
            'zh-CN',
          ) ?? productionAnimal.assets.narration['zh-CN'],
        en:
          reviewNarrationAssetFor(reviewAnimal.assets.narration, 'en') ??
          productionAnimal.assets.narration.en,
      },
    },
  }
}

const publishedReviewAnimals: readonly DisplayableAnimalPackage[] = [
  reviewedStegosaurus,
  pachycephalosaurus,
  ichthyosaur,
  pteranodon,
  tyrannosaurusRex,
  triceratops,
  plesiosaurus,
  apatosaurus,
  gigantoraptor,
  mammoth,
  megalodon,
  maiasaura,
]

const onboardingDrafts: readonly CompleteDraftAnimalPackage[] = [
  sauropeltaDraft,
  dilophosaurusDraft,
  mosasaurusDraft,
  rhamphorhynchusDraft,
  tupandactylusDraft,
  meganeuraDraft,
  velociraptorDraft,
  parasaurolophusDraft,
  dunkleosteusDraft,
  ammoniteDraft,
  jaekelopterusDraft,
  smilodonDraft,
  spinosaurusDraft,
  allosaurusDraft,
  brachiosaurusDraft,
  quetzalcoatlusDraft,
  elasmosaurusDraft,
  woollyRhinocerosDraft,
  anomalocarisDraft,
  albertosaurusDraft,
  carnotaurusDraft,
  ceratosaurusDraft,
  coelophysisDraft,
  compsognathusDraft,
  deinonychusDraft,
  baryonyxDraft,
  giganotosaurusDraft,
  suchomimusDraft,
  oviraptorDraft,
  therizinosaurusDraft,
  archaeopteryxDraft,
  sinosauropteryxDraft,
  monolophosaurusDraft,
  herrerasaurusDraft,
  utahraptorDraft,
  acrocanthosaurusDraft,
  carcharodontosaurusDraft,
  microraptorDraft,
  diplodocusDraft,
  argentinosaurusDraft,
  brontosaurusDraft,
  camarasaurusDraft,
  plateosaurusDraft,
  ankylosaurusDraft,
  euoplocephalusDraft,
  kentrosaurusDraft,
  protoceratopsDraft,
  styracosaurusDraft,
  pachyrhinosaurusDraft,
  diabloceratopsDraft,
  iguanodonDraft,
  edmontosaurusDraft,
  corythosaurusDraft,
  lambeosaurusDraft,
  gallimimusDraft,
  psittacosaurusDraft,
  heterodontosaurusDraft,
  dryosaurusDraft,
  nigersaurusDraft,
  dimorphodonDraft,
  anhangueraDraft,
  tapejaraDraft,
  nyctosaurusDraft,
  dsungaripterusDraft,
  kronosaurusDraft,
  liopleurodonDraft,
  tylosaurusDraft,
  ophthalmosaurusDraft,
  shonisaurusDraft,
  nothosaurusDraft,
  placodusDraft,
  dimetrodonDraft,
  lystrosaurusDraft,
  gorgonopsDraft,
  inostranceviaDraft,
  postosuchusDraft,
  desmatosuchusDraft,
  megalocerosDraft,
  glyptodonDraft,
  megatheriumDraft,
  doedicurusDraft,
  paraceratheriumDraft,
  gomphotheriumDraft,
  macraucheniaDraft,
  thylacoleoDraft,
  opabiniaDraft,
  hallucigeniaDraft,
  titanoboaDraft,
]

// The production collection is authoritative. A local draft automatically
// switches to its generated production assets as soon as an approved promotion
// appends the same ID. An explicitly generated review revision keeps the
// production order but serves candidate assets until that revision is approved;
// it does not alter the production collection or maintain a second promoted list.
export function buildLocalReviewCatalog(
  productionAnimals: readonly PublishedAnimalPackage[],
  publishedReviews: readonly DisplayableAnimalPackage[],
  drafts: readonly CompleteDraftAnimalPackage[],
): readonly DisplayableAnimalPackage[] {
  const publishedReviewById = new Map(
    publishedReviews.map((animal) => [animal.id, animal]),
  )
  const draftById = new Map(drafts.map((animal) => [animal.id, animal]))
  const productionIds = new Set(productionAnimals.map(({ id }) => id))
  return [
    ...productionAnimals.map((animal) => {
      const publishedReview = publishedReviewById.get(animal.id)
      if (publishedReview) {
        return mergePublishedReviewAnimal(animal, publishedReview)
      }
      const draft = draftById.get(animal.id)
      if (draft?.reviewRevision) {
        return draft
      }
      return draft ? acceptedOnboardingAnimal(animal, draft) : animal
    }),
    ...drafts.filter(({ id }) => !productionIds.has(id)),
  ]
}

export const localReviewAnimals = buildLocalReviewCatalog(
  mainAnimals,
  publishedReviewAnimals,
  onboardingDrafts,
)
