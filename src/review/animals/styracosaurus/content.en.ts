import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Styracosaurus',
  classificationLabel: 'Styracosaurus albertensis — dinosaur',
  visibleFeature: 'Look for its frill spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Styracosaurus, a prehistoric animal known as Styracosaurus albertensis.',
      'Look for its frill spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Styracosaurus', reading: 'Styracosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 76–75 million years ago)',
    discoveryRegions: ["Alberta, Canada"],
    size: { kind: 'body-length', minMeters: 4.95, maxMeters: 5.5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Styracosaurus albertensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared frill spikes; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Styracosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/styracosaurus',
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
