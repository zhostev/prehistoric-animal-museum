import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Lambeosaurus',
  classificationLabel: 'Lambeosaurus lambei — dinosaur',
  visibleFeature: 'Look for its hatchet crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Lambeosaurus, a prehistoric animal known as Lambeosaurus lambei.',
      'Look for its hatchet crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Lambeosaurus', reading: 'Lambeosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 76–75 million years ago)',
    discoveryRegions: ["Alberta, Canada"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Lambeosaurus lambei is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared hatchet crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Lambeosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/lambeosaurus',
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
