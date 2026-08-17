import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Diplodocus',
  classificationLabel: 'Diplodocus carnegii — dinosaur',
  visibleFeature: 'Look for its whip tail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Diplodocus, a prehistoric animal known as Diplodocus carnegii.',
      'Look for its whip tail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Diplodocus', reading: 'Diplodocus' }],
  },
  facts: {
    period: 'Late Jurassic (about 154–145 million years ago)',
    discoveryRegions: ["western United States"],
    size: { kind: 'body-length', minMeters: 22.5, maxMeters: 25 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Diplodocus carnegii is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared whip tail; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Diplodocus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/diplodocus',
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
