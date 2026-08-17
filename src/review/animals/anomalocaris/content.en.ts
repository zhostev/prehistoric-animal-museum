import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Anomalocaris',
  classificationLabel: 'Anomalocaris canadensis — other prehistoric animal',
  visibleFeature: 'Look for its grasping appendages. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Anomalocaris, a prehistoric animal known as Anomalocaris canadensis.',
      'Look for its grasping appendages. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Anomalocaris', reading: 'Anomalocaris' }],
  },
  facts: {
    period: 'Cambrian (about 508 million years ago)',
    discoveryRegions: ["Canada","China","Australia"],
    size: { kind: 'body-length', minMeters: 0.9, maxMeters: 1 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Anomalocaris canadensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared grasping appendages; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Anomalocaris — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/anomalocaris',
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
