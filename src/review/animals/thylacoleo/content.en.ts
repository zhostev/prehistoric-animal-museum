import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Thylacoleo',
  classificationLabel: 'Thylacoleo carnifex — other prehistoric animal',
  visibleFeature: 'Look for its powerful jaws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Thylacoleo, a prehistoric animal known as Thylacoleo carnifex.',
      'Look for its powerful jaws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Thylacoleo', reading: 'Thylacoleo' }],
  },
  facts: {
    period: 'Pleistocene (about 2 million–46,000 years ago)',
    discoveryRegions: ["Australia"],
    size: { kind: 'body-length', minMeters: 1.35, maxMeters: 1.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Thylacoleo carnifex is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared powerful jaws; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Thylacoleo — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/thylacoleo',
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
