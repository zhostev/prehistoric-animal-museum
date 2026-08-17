import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Dsungaripterus',
  classificationLabel: 'Dsungaripterus weii — pterosaur',
  visibleFeature: 'Look for its upturned beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Dsungaripterus, a prehistoric animal known as Dsungaripterus weii.',
      'Look for its upturned beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Dsungaripterus', reading: 'Dsungaripterus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 125–100 million years ago)',
    discoveryRegions: ["Xinjiang, China"],
    size: { kind: 'wingspan', minMeters: 3.15, maxMeters: 3.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Dsungaripterus weii is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared upturned beak; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Dsungaripterus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/dsungaripterus',
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
