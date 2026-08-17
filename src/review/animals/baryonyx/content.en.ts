import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Baryonyx',
  classificationLabel: 'Baryonyx walkeri — dinosaur',
  visibleFeature: 'Look for its long snout claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Baryonyx, a prehistoric animal known as Baryonyx walkeri.',
      'Look for its long snout claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Baryonyx', reading: 'Baryonyx' }],
  },
  facts: {
    period: 'Early Cretaceous (about 130–125 million years ago)',
    discoveryRegions: ["England","Spain"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Baryonyx walkeri is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long snout claw; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Baryonyx — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/baryonyx',
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
