import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Shonisaurus',
  classificationLabel: 'Shonisaurus popularis — marine reptile',
  visibleFeature: 'Look for its giant body. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Shonisaurus, a prehistoric animal known as Shonisaurus popularis.',
      'Look for its giant body. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Shonisaurus', reading: 'Shonisaurus' }],
  },
  facts: {
    period: 'Late Triassic (about 225 million years ago)',
    discoveryRegions: ["Nevada, United States"],
    size: { kind: 'body-length', minMeters: 13.5, maxMeters: 15 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Shonisaurus popularis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant body; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Shonisaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/shonisaurus',
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
