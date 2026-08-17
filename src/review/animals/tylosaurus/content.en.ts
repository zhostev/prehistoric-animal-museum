import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Tylosaurus',
  classificationLabel: 'Tylosaurus proriger — marine reptile',
  visibleFeature: 'Look for its long snout. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Tylosaurus, a prehistoric animal known as Tylosaurus proriger.',
      'Look for its long snout. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Tylosaurus', reading: 'Tylosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 87–82 million years ago)',
    discoveryRegions: ["North America"],
    size: { kind: 'body-length', minMeters: 11.7, maxMeters: 13 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Tylosaurus proriger is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long snout; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Tylosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/tylosaurus',
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
