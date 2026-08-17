import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Woolly rhinoceros',
  classificationLabel: 'Coelodonta antiquitatis — other prehistoric animal',
  visibleFeature: 'Look for its rhino horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Woolly rhinoceros, a prehistoric animal known as Coelodonta antiquitatis.',
      'Look for its rhino horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Woolly rhinoceros', reading: 'Woolly rhinoceros' }],
  },
  facts: {
    period: 'Pleistocene (about 350,000–10,000 years ago)',
    discoveryRegions: ["Eurasia"],
    size: { kind: 'body-length', minMeters: 3.42, maxMeters: 3.8 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Coelodonta antiquitatis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared rhino horns; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Woolly rhinoceros — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/woolly-rhinoceros',
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
