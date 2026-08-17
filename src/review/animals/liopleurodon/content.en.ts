import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Liopleurodon',
  classificationLabel: 'Liopleurodon ferox — marine reptile',
  visibleFeature: 'Look for its powerful flippers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Liopleurodon, a prehistoric animal known as Liopleurodon ferox.',
      'Look for its powerful flippers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Liopleurodon', reading: 'Liopleurodon' }],
  },
  facts: {
    period: 'Middle–Late Jurassic (about 166–155 million years ago)',
    discoveryRegions: ["England","France"],
    size: { kind: 'body-length', minMeters: 5.85, maxMeters: 6.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Liopleurodon ferox is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared powerful flippers; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Liopleurodon — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/liopleurodon',
    accessedOn: '2026-08-13',
  }],
  editorial: {
    uncertaintyNotes: [
      'The size range is rounded for family reading and does not represent one particular specimen.',
      'Body colour, soft tissue and the Idle movement are display reconstructions rather than direct fossil observations.',
      'Scientific wording, anatomy, material appearance and natural motion remain pending owner review.',
    ],
    editedBy: 'Codex-assisted expansion draft',
    reviewedBy: 'pending owner review',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentEn
