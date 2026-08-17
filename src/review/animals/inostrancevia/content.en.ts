import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Inostrancevia',
  classificationLabel: 'Inostrancevia alexandri — other prehistoric animal',
  visibleFeature: 'Look for its saber canines. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Inostrancevia, a prehistoric animal known as Inostrancevia alexandri.',
      'Look for its saber canines. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Inostrancevia', reading: 'Inostrancevia' }],
  },
  facts: {
    period: 'Late Permian (about 259–252 million years ago)',
    discoveryRegions: ["Russia"],
    size: { kind: 'body-length', minMeters: 2.7, maxMeters: 3 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Inostrancevia alexandri is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared saber canines; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Inostrancevia — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/inostrancevia',
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
