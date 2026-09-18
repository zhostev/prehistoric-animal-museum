export type GeologicalPeriodId =
  | 'cambrian'
  | 'devonian'
  | 'carboniferous'
  | 'permian'
  | 'triassic'
  | 'jurassic'
  | 'cretaceous'
  | 'paleogene'
  | 'neogene'
  | 'quaternary'

export interface AnimalChronology {
  /** Approximate midpoint or peak era in million years ago (Ma) for chronological ordering */
  readonly mya: number
  readonly periodId: GeologicalPeriodId
  readonly badge: {
    readonly 'zh-CN': string
    readonly en: string
  }
}

export const animalChronologyCatalog: Readonly<Record<string, AnimalChronology>> = {
  anomalocaris: {
    mya: 508,
    periodId: 'cambrian',
    badge: { 'zh-CN': '寒武纪 · 约5.08亿年前', en: 'Cambrian · ~508 Ma' },
  },
  jaekelopterus: {
    mya: 405,
    periodId: 'devonian',
    badge: { 'zh-CN': '早泥盆世 · 约4.05亿年前', en: 'Early Devonian · ~405 Ma' },
  },
  dunkleosteus: {
    mya: 370,
    periodId: 'devonian',
    badge: { 'zh-CN': '晚泥盆世 · 约3.7亿年前', en: 'Late Devonian · ~370 Ma' },
  },
  ammonite: {
    mya: 360,
    periodId: 'devonian',
    badge: { 'zh-CN': '泥盆纪至白垩纪', en: 'Devonian – Cretaceous' },
  },
  meganeura: {
    mya: 300,
    periodId: 'carboniferous',
    badge: { 'zh-CN': '晚石炭世 · 约3亿年前', en: 'Late Carboniferous · ~300 Ma' },
  },
  dimetrodon: {
    mya: 280,
    periodId: 'permian',
    badge: { 'zh-CN': '早二叠世 · 约2.8亿年前', en: 'Early Permian · ~280 Ma' },
  },
  herrerasaurus: {
    mya: 231,
    periodId: 'triassic',
    badge: { 'zh-CN': '晚三叠世 · 约2.31亿年前', en: 'Late Triassic · ~231 Ma' },
  },
  ichthyosaur: {
    mya: 215,
    periodId: 'triassic',
    badge: { 'zh-CN': '晚三叠世 · 约2.15亿年前', en: 'Late Triassic · ~215 Ma' },
  },
  plesiosaurus: {
    mya: 200,
    periodId: 'jurassic',
    badge: { 'zh-CN': '早侏罗世 · 约2亿年前', en: 'Early Jurassic · ~200 Ma' },
  },
  dilophosaurus: {
    mya: 193,
    periodId: 'jurassic',
    badge: { 'zh-CN': '早侏罗世 · 约1.93亿年前', en: 'Early Jurassic · ~193 Ma' },
  },
  ophthalmosaurus: {
    mya: 160,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.6亿年前', en: 'Late Jurassic · ~160 Ma' },
  },
  stegosaurus: {
    mya: 155,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.55亿年前', en: 'Late Jurassic · ~155 Ma' },
  },
  allosaurus: {
    mya: 152,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.52亿年前', en: 'Late Jurassic · ~152 Ma' },
  },
  brachiosaurus: {
    mya: 152,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.52亿年前', en: 'Late Jurassic · ~152 Ma' },
  },
  diplodocus: {
    mya: 152,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.52亿年前', en: 'Late Jurassic · ~152 Ma' },
  },
  ceratosaurus: {
    mya: 150,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.5亿年前', en: 'Late Jurassic · ~150 Ma' },
  },
  compsognathus: {
    mya: 150,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.5亿年前', en: 'Late Jurassic · ~150 Ma' },
  },
  rhamphorhynchus: {
    mya: 150,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.5亿年前', en: 'Late Jurassic · ~150 Ma' },
  },
  apatosaurus: {
    mya: 148,
    periodId: 'jurassic',
    badge: { 'zh-CN': '晚侏罗世 · 约1.48亿年前', en: 'Late Jurassic · ~148 Ma' },
  },
  baryonyx: {
    mya: 128,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.28亿年前', en: 'Early Cretaceous · ~128 Ma' },
  },
  microraptor: {
    mya: 120,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.2亿年前', en: 'Early Cretaceous · ~120 Ma' },
  },
  tupandactylus: {
    mya: 115,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.15亿年前', en: 'Early Cretaceous · ~115 Ma' },
  },
  anhanguera: {
    mya: 112,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.12亿年前', en: 'Early Cretaceous · ~112 Ma' },
  },
  acrocanthosaurus: {
    mya: 112,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.12亿年前', en: 'Early Cretaceous · ~112 Ma' },
  },
  deinonychus: {
    mya: 112,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.12亿年前', en: 'Early Cretaceous · ~112 Ma' },
  },
  sauropelta: {
    mya: 110,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '早白垩世 · 约1.1亿年前', en: 'Early Cretaceous · ~110 Ma' },
  },
  carcharodontosaurus: {
    mya: 97,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约9700万年前', en: 'Late Cretaceous · ~97 Ma' },
  },
  spinosaurus: {
    mya: 96,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约9600万年前', en: 'Late Cretaceous · ~96 Ma' },
  },
  argentinosaurus: {
    mya: 94,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约9400万年前', en: 'Late Cretaceous · ~94 Ma' },
  },
  gigantoraptor: {
    mya: 85,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约8500万年前', en: 'Late Cretaceous · ~85 Ma' },
  },
  mosasaurus: {
    mya: 82,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约8200万年前', en: 'Late Cretaceous · ~82 Ma' },
  },
  elasmosaurus: {
    mya: 80,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约8000万年前', en: 'Late Cretaceous · ~80 Ma' },
  },
  maiasaura: {
    mya: 78,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7800万年前', en: 'Late Cretaceous · ~78 Ma' },
  },
  corythosaurus: {
    mya: 76,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7600万年前', en: 'Late Cretaceous · ~76 Ma' },
  },
  parasaurolophus: {
    mya: 75,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7500万年前', en: 'Late Cretaceous · ~75 Ma' },
  },
  velociraptor: {
    mya: 73,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7300万年前', en: 'Late Cretaceous · ~73 Ma' },
  },
  albertosaurus: {
    mya: 70,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7000万年前', en: 'Late Cretaceous · ~70 Ma' },
  },
  carnotaurus: {
    mya: 70,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约7000万年前', en: 'Late Cretaceous · ~70 Ma' },
  },
  edmontosaurus: {
    mya: 69,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6900万年前', en: 'Late Cretaceous · ~69 Ma' },
  },
  pachycephalosaurus: {
    mya: 68,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6800万年前', en: 'Late Cretaceous · ~68 Ma' },
  },
  pteranodon: {
    mya: 68,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6800万年前', en: 'Late Cretaceous · ~68 Ma' },
  },
  quetzalcoatlus: {
    mya: 67,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6700万年前', en: 'Late Cretaceous · ~67 Ma' },
  },
  ankylosaurus: {
    mya: 67,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6700万年前', en: 'Late Cretaceous · ~67 Ma' },
  },
  triceratops: {
    mya: 67,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6700万年前', en: 'Late Cretaceous · ~67 Ma' },
  },
  'tyrannosaurus-rex': {
    mya: 66.5,
    periodId: 'cretaceous',
    badge: { 'zh-CN': '晚白垩世 · 约6650万年前', en: 'Late Cretaceous · ~66.5 Ma' },
  },
  megalodon: {
    mya: 15,
    periodId: 'neogene',
    badge: { 'zh-CN': '中新世至上新世 · 约1500万年前', en: 'Miocene – Pliocene · ~15 Ma' },
  },
  smilodon: {
    mya: 1.8,
    periodId: 'quaternary',
    badge: { 'zh-CN': '更新世 · 约180万年前', en: 'Pleistocene · ~1.8 Ma' },
  },
  glyptodon: {
    mya: 1.5,
    periodId: 'quaternary',
    badge: { 'zh-CN': '更新世 · 约150万年前', en: 'Pleistocene · ~1.5 Ma' },
  },
  megaloceros: {
    mya: 0.35,
    periodId: 'quaternary',
    badge: { 'zh-CN': '晚更新世 · 约35万年前', en: 'Late Pleistocene · ~350 ka' },
  },
  mammoth: {
    mya: 0.05,
    periodId: 'quaternary',
    badge: { 'zh-CN': '更新世末 · 约5万年前', en: 'Late Pleistocene · ~50 ka' },
  },
}

export function getAnimalChronology(animalId: string): AnimalChronology {
  const entry = animalChronologyCatalog[animalId]
  if (!entry) {
    // Fallback if not found
    return {
      mya: 100,
      periodId: 'cretaceous',
      badge: { 'zh-CN': '中生代', en: 'Mesozoic' },
    }
  }
  return entry
}

export function sortAnimalsByTimeline<T extends { id: string }>(
  animals: readonly T[],
  direction: 'oldest-first' | 'newest-first' = 'oldest-first',
): T[] {
  return [...animals].sort((a, b) => {
    const ageA = getAnimalChronology(a.id).mya
    const ageB = getAnimalChronology(b.id).mya
    return direction === 'oldest-first' ? ageB - ageA : ageA - ageB
  })
}
