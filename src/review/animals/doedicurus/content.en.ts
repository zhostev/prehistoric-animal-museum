import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Doedicurus',
  classificationLabel: 'Doedicurus clavicaudatus — other prehistoric animal',
  visibleFeature: 'Look for its spiked tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Doedicurus, a prehistoric animal known as Doedicurus clavicaudatus.',
      'Look for its spiked tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Doedicurus', reading: 'Doedicurus' }],
  },
  facts: {
    period: 'Pleistocene (about 2 million–11,000 years ago)',
    discoveryRegions: ["South America"],
    size: { kind: 'body-length', minMeters: 3.24, maxMeters: 3.6 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Doedicurus clavicaudatus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared spiked tail club; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Doedicurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/doedicurus',
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
