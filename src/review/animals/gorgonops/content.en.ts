import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Gorgonops',
  classificationLabel: 'Gorgonops torvus — other prehistoric animal',
  visibleFeature: 'Look for its saber canines. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Gorgonops, a prehistoric animal known as Gorgonops torvus.',
      'Look for its saber canines. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Gorgonops', reading: 'Gorgonops' }],
  },
  facts: {
    period: 'Late Permian (about 260–254 million years ago)',
    discoveryRegions: ["South Africa"],
    size: { kind: 'body-length', minMeters: 1.8, maxMeters: 2 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Gorgonops torvus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared saber canines; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Gorgonops — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/gorgonops',
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
