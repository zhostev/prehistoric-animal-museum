import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Paraceratherium',
  classificationLabel: 'Paraceratherium transouralicum — other prehistoric animal',
  visibleFeature: 'Look for its long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Paraceratherium, a prehistoric animal known as Paraceratherium transouralicum.',
      'Look for its long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Paraceratherium', reading: 'Paraceratherium' }],
  },
  facts: {
    period: 'Oligocene (about 34–23 million years ago)',
    discoveryRegions: ["Central Asia"],
    size: { kind: 'body-length', minMeters: 6.75, maxMeters: 7.5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Paraceratherium transouralicum is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long neck; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Paraceratherium — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/paraceratherium',
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
