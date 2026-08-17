import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Carnotaurus',
  classificationLabel: 'Carnotaurus sastrei — dinosaur',
  visibleFeature: 'Look for its bull horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Carnotaurus, a prehistoric animal known as Carnotaurus sastrei.',
      'Look for its bull horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Carnotaurus', reading: 'Carnotaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 72–69 million years ago)',
    discoveryRegions: ["Patagonia, Argentina"],
    size: { kind: 'body-length', minMeters: 7.2, maxMeters: 8 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Carnotaurus sastrei is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared bull horns; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Carnotaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/carnotaurus',
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
