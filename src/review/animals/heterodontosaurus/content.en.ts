import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Heterodontosaurus',
  classificationLabel: 'Heterodontosaurus tucki — dinosaur',
  visibleFeature: 'Look for its tusks. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Heterodontosaurus, a prehistoric animal known as Heterodontosaurus tucki.',
      'Look for its tusks. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Heterodontosaurus', reading: 'Heterodontosaurus' }],
  },
  facts: {
    period: 'Early Jurassic (about 200–190 million years ago)',
    discoveryRegions: ["South Africa"],
    size: { kind: 'body-length', minMeters: 1.08, maxMeters: 1.2 },
    diet: 'omnivore',
  },
  parentClassificationNote: 'Heterodontosaurus tucki is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tusks; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Heterodontosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/heterodontosaurus',
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
