import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Nigersaurus',
  classificationLabel: 'Nigersaurus taqueti — dinosaur',
  visibleFeature: 'Look for its wide muzzle. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Nigersaurus, a prehistoric animal known as Nigersaurus taqueti.',
      'Look for its wide muzzle. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Nigersaurus', reading: 'Nigersaurus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 115–105 million years ago)',
    discoveryRegions: ["Niger"],
    size: { kind: 'body-length', minMeters: 8.1, maxMeters: 9 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Nigersaurus taqueti is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared wide muzzle; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Nigersaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/nigersaurus',
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
