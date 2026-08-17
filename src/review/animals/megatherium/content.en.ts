import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Megatherium',
  classificationLabel: 'Megatherium americanum — other prehistoric animal',
  visibleFeature: 'Look for its giant claws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Megatherium, a prehistoric animal known as Megatherium americanum.',
      'Look for its giant claws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Megatherium', reading: 'Megatherium' }],
  },
  facts: {
    period: 'Pliocene–Pleistocene (about 5 million–11,700 years ago)',
    discoveryRegions: ["South America"],
    size: { kind: 'body-length', minMeters: 5.4, maxMeters: 6 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Megatherium americanum is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant claws; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Megatherium — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/megatherium',
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
