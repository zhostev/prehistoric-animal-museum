import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Iguanodon',
  classificationLabel: 'Iguanodon bernissartensis — dinosaur',
  visibleFeature: 'Look for its thumb spike. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Iguanodon, a prehistoric animal known as Iguanodon bernissartensis.',
      'Look for its thumb spike. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Iguanodon', reading: 'Iguanodon' }],
  },
  facts: {
    period: 'Early Cretaceous (about 126–122 million years ago)',
    discoveryRegions: ["Belgium","western Europe"],
    size: { kind: 'body-length', minMeters: 9, maxMeters: 10 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Iguanodon bernissartensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared thumb spike; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Iguanodon — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/iguanodon',
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
