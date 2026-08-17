import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Giganotosaurus',
  classificationLabel: 'Giganotosaurus carolinii — dinosaur',
  visibleFeature: 'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Giganotosaurus, a prehistoric animal known as Giganotosaurus carolinii.',
      'Look for its deep skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Giganotosaurus', reading: 'Giganotosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 99–95 million years ago)',
    discoveryRegions: ["Patagonia, Argentina"],
    size: { kind: 'body-length', minMeters: 11.7, maxMeters: 13 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Giganotosaurus carolinii is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared deep skull; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Giganotosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/giganotosaurus',
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
