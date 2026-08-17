import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Monolophosaurus',
  classificationLabel: 'Monolophosaurus jiangi — dinosaur',
  visibleFeature: 'Look for its single crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Monolophosaurus, a prehistoric animal known as Monolophosaurus jiangi.',
      'Look for its single crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Monolophosaurus', reading: 'Monolophosaurus' }],
  },
  facts: {
    period: 'Middle Jurassic (about 165 million years ago)',
    discoveryRegions: ["Xinjiang, China"],
    size: { kind: 'body-length', minMeters: 4.95, maxMeters: 5.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Monolophosaurus jiangi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared single crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Monolophosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/monolophosaurus',
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
