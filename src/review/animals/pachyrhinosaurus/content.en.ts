import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Pachyrhinosaurus',
  classificationLabel: 'Pachyrhinosaurus canadensis — dinosaur',
  visibleFeature: 'Look for its nasal boss. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Pachyrhinosaurus, a prehistoric animal known as Pachyrhinosaurus canadensis.',
      'Look for its nasal boss. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Pachyrhinosaurus', reading: 'Pachyrhinosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 73–69 million years ago)',
    discoveryRegions: ["Canada","Alaska, United States"],
    size: { kind: 'body-length', minMeters: 5.4, maxMeters: 6 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Pachyrhinosaurus canadensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared nasal boss; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Pachyrhinosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/pachyrhinosaurus',
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
