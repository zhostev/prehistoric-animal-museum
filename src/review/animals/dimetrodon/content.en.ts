import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Dimetrodon',
  classificationLabel: 'Dimetrodon grandis — other prehistoric animal',
  visibleFeature: 'Look for its back sail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Dimetrodon, a prehistoric animal known as Dimetrodon grandis.',
      'Look for its back sail. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Dimetrodon', reading: 'Dimetrodon' }],
  },
  facts: {
    period: 'Early Permian (about 295–272 million years ago)',
    discoveryRegions: ["United States"],
    size: { kind: 'body-length', minMeters: 3.15, maxMeters: 3.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Dimetrodon grandis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared back sail; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Dimetrodon — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/dimetrodon',
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
