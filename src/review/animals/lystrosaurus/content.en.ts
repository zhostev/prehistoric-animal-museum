import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Lystrosaurus',
  classificationLabel: 'Lystrosaurus murrayi — other prehistoric animal',
  visibleFeature: 'Look for its tusked beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Lystrosaurus, a prehistoric animal known as Lystrosaurus murrayi.',
      'Look for its tusked beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Lystrosaurus', reading: 'Lystrosaurus' }],
  },
  facts: {
    period: 'Late Permian–Early Triassic (about 255–250 million years ago)',
    discoveryRegions: ["Antarctica","Africa","Asia"],
    size: { kind: 'body-length', minMeters: 0.9, maxMeters: 1 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Lystrosaurus murrayi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tusked beak; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Lystrosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/lystrosaurus',
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
