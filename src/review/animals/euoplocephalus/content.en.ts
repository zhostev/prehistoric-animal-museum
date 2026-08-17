import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Euoplocephalus',
  classificationLabel: 'Euoplocephalus tutus — dinosaur',
  visibleFeature: 'Look for its tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Euoplocephalus, a prehistoric animal known as Euoplocephalus tutus.',
      'Look for its tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Euoplocephalus', reading: 'Euoplocephalus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 76–70 million years ago)',
    discoveryRegions: ["Alberta, Canada"],
    size: { kind: 'body-length', minMeters: 5.4, maxMeters: 6 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Euoplocephalus tutus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tail club; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Euoplocephalus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/euoplocephalus',
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
