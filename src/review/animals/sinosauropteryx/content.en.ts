import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Sinosauropteryx',
  classificationLabel: 'Sinosauropteryx prima — dinosaur',
  visibleFeature: 'Look for its banded tail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Sinosauropteryx, a prehistoric animal known as Sinosauropteryx prima.',
      'Look for its banded tail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Sinosauropteryx', reading: 'Sinosauropteryx' }],
  },
  facts: {
    period: 'Early Cretaceous (about 125 million years ago)',
    discoveryRegions: ["Liaoning, China"],
    size: { kind: 'body-length', minMeters: 0.99, maxMeters: 1.1 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Sinosauropteryx prima is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared banded tail; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Sinosauropteryx — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/sinosauropteryx',
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
