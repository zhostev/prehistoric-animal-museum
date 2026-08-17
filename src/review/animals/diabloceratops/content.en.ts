import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Diabloceratops',
  classificationLabel: 'Diabloceratops eatoni — dinosaur',
  visibleFeature: 'Look for its long frill horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Diabloceratops, a prehistoric animal known as Diabloceratops eatoni.',
      'Look for its long frill horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Diabloceratops', reading: 'Diabloceratops' }],
  },
  facts: {
    period: 'Late Cretaceous (about 81–79 million years ago)',
    discoveryRegions: ["Utah, United States"],
    size: { kind: 'body-length', minMeters: 4.05, maxMeters: 4.5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Diabloceratops eatoni is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared long frill horns; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Diabloceratops — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/diabloceratops',
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
