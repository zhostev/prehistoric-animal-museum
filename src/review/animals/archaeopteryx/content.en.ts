import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Archaeopteryx',
  classificationLabel: 'Archaeopteryx lithographica — other prehistoric animal',
  visibleFeature: 'Look for its wing feathers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Archaeopteryx, a prehistoric animal known as Archaeopteryx lithographica.',
      'Look for its wing feathers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Archaeopteryx', reading: 'Archaeopteryx' }],
  },
  facts: {
    period: 'Late Jurassic (about 150 million years ago)',
    discoveryRegions: ["Bavaria, Germany"],
    size: { kind: 'body-length', minMeters: 0.45, maxMeters: 0.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Archaeopteryx lithographica is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared wing feathers; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Archaeopteryx — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/archaeopteryx',
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
