import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Anhanguera',
  classificationLabel: 'Anhanguera blittersdorffi — pterosaur',
  visibleFeature: 'Look for its jaw crests. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Anhanguera, a prehistoric animal known as Anhanguera blittersdorffi.',
      'Look for its jaw crests. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Anhanguera', reading: 'Anhanguera' }],
  },
  facts: {
    period: 'Early Cretaceous (about 112 million years ago)',
    discoveryRegions: ["Brazil"],
    size: { kind: 'wingspan', minMeters: 4.5, maxMeters: 5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Anhanguera blittersdorffi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared jaw crests; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Anhanguera — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/anhanguera',
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
