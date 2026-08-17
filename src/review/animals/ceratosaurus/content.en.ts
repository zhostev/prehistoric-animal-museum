import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Ceratosaurus',
  classificationLabel: 'Ceratosaurus nasicornis — dinosaur',
  visibleFeature: 'Look for its nose horn. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Ceratosaurus, a prehistoric animal known as Ceratosaurus nasicornis.',
      'Look for its nose horn. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Ceratosaurus', reading: 'Ceratosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 153–148 million years ago)',
    discoveryRegions: ["western United States","Portugal"],
    size: { kind: 'body-length', minMeters: 5.85, maxMeters: 6.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Ceratosaurus nasicornis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared nose horn; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Ceratosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/ceratosaurus',
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
