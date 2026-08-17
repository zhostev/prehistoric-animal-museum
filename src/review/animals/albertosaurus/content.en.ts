import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Albertosaurus',
  classificationLabel: 'Albertosaurus sarcophagus — dinosaur',
  visibleFeature: 'Look for its small brow crests. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Albertosaurus, a prehistoric animal known as Albertosaurus sarcophagus.',
      'Look for its small brow crests. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Albertosaurus', reading: 'Albertosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 71–68 million years ago)',
    discoveryRegions: ["Alberta, Canada"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Albertosaurus sarcophagus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared small brow crests; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Albertosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/albertosaurus',
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
