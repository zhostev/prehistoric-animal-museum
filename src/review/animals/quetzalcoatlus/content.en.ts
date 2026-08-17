import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Quetzalcoatlus',
  classificationLabel: 'Quetzalcoatlus northropi — pterosaur',
  visibleFeature: 'Look for its giant wings. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Quetzalcoatlus, a prehistoric animal known as Quetzalcoatlus northropi.',
      'Look for its giant wings. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Quetzalcoatlus', reading: 'Quetzalcoatlus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 68–66 million years ago)',
    discoveryRegions: ["Texas, United States"],
    size: { kind: 'wingspan', minMeters: 9.45, maxMeters: 10.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Quetzalcoatlus northropi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant wings; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Quetzalcoatlus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/quetzalcoatlus',
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
