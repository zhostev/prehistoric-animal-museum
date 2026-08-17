import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Carcharodontosaurus',
  classificationLabel: 'Carcharodontosaurus saharicus — dinosaur',
  visibleFeature: 'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Carcharodontosaurus, a prehistoric animal known as Carcharodontosaurus saharicus.',
      'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Carcharodontosaurus', reading: 'Carcharodontosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 100–94 million years ago)',
    discoveryRegions: ["North Africa"],
    size: { kind: 'body-length', minMeters: 11.25, maxMeters: 12.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Carcharodontosaurus saharicus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared deep skull; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Carcharodontosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/carcharodontosaurus',
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
