import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Opabinia',
  classificationLabel: 'Opabinia regalis — other prehistoric animal',
  visibleFeature: 'Look for its five eyes proboscis. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Opabinia, a prehistoric animal known as Opabinia regalis.',
      'Look for its five eyes proboscis. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Opabinia', reading: 'Opabinia' }],
  },
  facts: {
    period: 'Cambrian (about 508 million years ago)',
    discoveryRegions: ["British Columbia, Canada"],
    size: { kind: 'body-length', minMeters: 0.09, maxMeters: 0.1 },
    diet: 'unknown',
  },
  parentClassificationNote: 'Opabinia regalis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared five eyes proboscis; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Opabinia — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/opabinia',
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
