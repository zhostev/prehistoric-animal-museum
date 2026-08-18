import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Corythosaurus',
  classificationLabel: 'Corythosaurus casuarius — dinosaur',
  visibleFeature: 'Look for its helmet crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Corythosaurus, a prehistoric animal known as Corythosaurus casuarius.',
      'Look for its helmet crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Corythosaurus', reading: 'Corythosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 77–75 million years ago)',
    discoveryRegions: ["Alberta, Canada"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Corythosaurus casuarius is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared helmet crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Corythosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/corythosaurus',
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
