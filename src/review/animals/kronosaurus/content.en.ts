import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Kronosaurus',
  classificationLabel: 'Kronosaurus queenslandicus — marine reptile',
  visibleFeature: 'Look for its huge skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Kronosaurus, a prehistoric animal known as Kronosaurus queenslandicus.',
      'Look for its huge skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Kronosaurus', reading: 'Kronosaurus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 125–100 million years ago)',
    discoveryRegions: ["Queensland, Australia"],
    size: { kind: 'body-length', minMeters: 9, maxMeters: 10 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Kronosaurus queenslandicus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared huge skull; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Kronosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/kronosaurus',
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
