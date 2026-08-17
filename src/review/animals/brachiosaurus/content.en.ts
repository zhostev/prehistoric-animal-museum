import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Brachiosaurus',
  classificationLabel: 'Brachiosaurus altithorax — dinosaur',
  visibleFeature: 'Look for its high shoulders. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Brachiosaurus, a prehistoric animal known as Brachiosaurus altithorax.',
      'Look for its high shoulders. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Brachiosaurus', reading: 'Brachiosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 154–150 million years ago)',
    discoveryRegions: ["Colorado and Utah, United States"],
    size: { kind: 'body-length', minMeters: 19.8, maxMeters: 22 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Brachiosaurus altithorax is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared high shoulders; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Brachiosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/brachiosaurus',
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
