import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Ankylosaurus',
  classificationLabel: 'Ankylosaurus magniventris — dinosaur',
  visibleFeature: 'Look for its tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Ankylosaurus, a prehistoric animal known as Ankylosaurus magniventris.',
      'Look for its tail club. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Ankylosaurus', reading: 'Ankylosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 68–66 million years ago)',
    discoveryRegions: ["western North America"],
    size: { kind: 'body-length', minMeters: 7.2, maxMeters: 8 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Ankylosaurus magniventris is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tail club; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Ankylosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/ankylosaurus',
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
