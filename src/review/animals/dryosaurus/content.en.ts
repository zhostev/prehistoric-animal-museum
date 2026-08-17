import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Dryosaurus',
  classificationLabel: 'Dryosaurus altus — dinosaur',
  visibleFeature: 'Look for its runner legs. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Dryosaurus, a prehistoric animal known as Dryosaurus altus.',
      'Look for its runner legs. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Dryosaurus', reading: 'Dryosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 155–145 million years ago)',
    discoveryRegions: ["western United States"],
    size: { kind: 'body-length', minMeters: 3.15, maxMeters: 3.5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Dryosaurus altus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared runner legs; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Dryosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/dryosaurus',
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
