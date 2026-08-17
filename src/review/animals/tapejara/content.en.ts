import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Tapejara',
  classificationLabel: 'Tapejara wellnhoferi — pterosaur',
  visibleFeature: 'Look for its tall crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Tapejara, a prehistoric animal known as Tapejara wellnhoferi.',
      'Look for its tall crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Tapejara', reading: 'Tapejara' }],
  },
  facts: {
    period: 'Early Cretaceous (about 112 million years ago)',
    discoveryRegions: ["Brazil"],
    size: { kind: 'wingspan', minMeters: 3.15, maxMeters: 3.5 },
    diet: 'omnivore',
  },
  parentClassificationNote: 'Tapejara wellnhoferi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tall crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Tapejara — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/tapejara',
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
