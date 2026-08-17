import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Elasmosaurus',
  classificationLabel: 'Elasmosaurus platyurus — marine reptile',
  visibleFeature: 'Look for its very long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Elasmosaurus, a prehistoric animal known as Elasmosaurus platyurus.',
      'Look for its very long neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Elasmosaurus', reading: 'Elasmosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 80 million years ago)',
    discoveryRegions: ["Kansas, United States"],
    size: { kind: 'body-length', minMeters: 9.45, maxMeters: 10.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Elasmosaurus platyurus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared very long neck; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Elasmosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/elasmosaurus',
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
