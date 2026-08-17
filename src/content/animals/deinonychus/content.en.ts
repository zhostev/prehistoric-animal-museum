import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Deinonychus',
  classificationLabel: 'Deinonychus antirrhopus — dinosaur',
  visibleFeature: 'Look for its sickle claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Deinonychus, a prehistoric animal known as Deinonychus antirrhopus.',
      'Look for its sickle claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Deinonychus', reading: 'Deinonychus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 115–108 million years ago)',
    discoveryRegions: ["western United States"],
    size: { kind: 'body-length', minMeters: 3.06, maxMeters: 3.4 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Deinonychus antirrhopus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared sickle claw; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Deinonychus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/deinonychus',
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
