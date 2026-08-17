import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Suchomimus',
  classificationLabel: 'Suchomimus tenerensis — dinosaur',
  visibleFeature: 'Look for its long snout claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Suchomimus, a prehistoric animal known as Suchomimus tenerensis.',
      'Look for its long snout claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Suchomimus', reading: 'Suchomimus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 125–112 million years ago)',
    discoveryRegions: ["Niger"],
    size: { kind: 'body-length', minMeters: 9.9, maxMeters: 11 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Suchomimus tenerensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long snout claw; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Suchomimus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/suchomimus',
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
