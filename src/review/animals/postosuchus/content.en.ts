import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Postosuchus',
  classificationLabel: 'Postosuchus kirkpatricki — other prehistoric animal',
  visibleFeature: 'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Postosuchus, a prehistoric animal known as Postosuchus kirkpatricki.',
      'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Postosuchus', reading: 'Postosuchus' }],
  },
  facts: {
    period: 'Late Triassic (about 228–202 million years ago)',
    discoveryRegions: ["United States"],
    size: { kind: 'body-length', minMeters: 4.5, maxMeters: 5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Postosuchus kirkpatricki is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared deep skull; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Postosuchus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/postosuchus',
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
