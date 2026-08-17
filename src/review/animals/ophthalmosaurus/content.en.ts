import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Ophthalmosaurus',
  classificationLabel: 'Ophthalmosaurus icenicus — marine reptile',
  visibleFeature: 'Look for its giant eyes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Ophthalmosaurus, a prehistoric animal known as Ophthalmosaurus icenicus.',
      'Look for its giant eyes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Ophthalmosaurus', reading: 'Ophthalmosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 165–145 million years ago)',
    discoveryRegions: ["Europe","North America"],
    size: { kind: 'body-length', minMeters: 3.6, maxMeters: 4 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Ophthalmosaurus icenicus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant eyes; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Ophthalmosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/ophthalmosaurus',
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
