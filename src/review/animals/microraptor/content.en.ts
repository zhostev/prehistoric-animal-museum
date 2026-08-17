import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Microraptor',
  classificationLabel: 'Microraptor gui — dinosaur',
  visibleFeature: 'Look for its four wings. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Microraptor, a prehistoric animal known as Microraptor gui.',
      'Look for its four wings. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Microraptor', reading: 'Microraptor' }],
  },
  facts: {
    period: 'Early Cretaceous (about 120 million years ago)',
    discoveryRegions: ["Liaoning, China"],
    size: { kind: 'body-length', minMeters: 0.72, maxMeters: 0.8 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Microraptor gui is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared four wings; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Microraptor — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/microraptor',
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
