import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Gallimimus',
  classificationLabel: 'Gallimimus bullatus — dinosaur',
  visibleFeature: 'Look for its long legs beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Gallimimus, a prehistoric animal known as Gallimimus bullatus.',
      'Look for its long legs beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Gallimimus', reading: 'Gallimimus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 70 million years ago)',
    discoveryRegions: ["Mongolia"],
    size: { kind: 'body-length', minMeters: 5.4, maxMeters: 6 },
    diet: 'omnivore',
  },
  parentClassificationNote: 'Gallimimus bullatus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long legs beak; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Gallimimus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/gallimimus',
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
