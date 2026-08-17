import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Plateosaurus',
  classificationLabel: 'Plateosaurus engelhardti — dinosaur',
  visibleFeature: 'Look for its long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Plateosaurus, a prehistoric animal known as Plateosaurus engelhardti.',
      'Look for its long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Plateosaurus', reading: 'Plateosaurus' }],
  },
  facts: {
    period: 'Late Triassic (about 214–204 million years ago)',
    discoveryRegions: ["Germany","Switzerland","France"],
    size: { kind: 'body-length', minMeters: 7.2, maxMeters: 8 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Plateosaurus engelhardti is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long neck; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Plateosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/plateosaurus',
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
