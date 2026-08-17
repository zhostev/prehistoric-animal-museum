import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Desmatosuchus',
  classificationLabel: 'Desmatosuchus spurensis — other prehistoric animal',
  visibleFeature: 'Look for its shoulder spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Desmatosuchus, a prehistoric animal known as Desmatosuchus spurensis.',
      'Look for its shoulder spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Desmatosuchus', reading: 'Desmatosuchus' }],
  },
  facts: {
    period: 'Late Triassic (about 230–210 million years ago)',
    discoveryRegions: ["United States"],
    size: { kind: 'body-length', minMeters: 4.05, maxMeters: 4.5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Desmatosuchus spurensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared shoulder spikes; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Desmatosuchus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/desmatosuchus',
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
