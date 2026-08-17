import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Megaloceros',
  classificationLabel: 'Megaloceros giganteus — other prehistoric animal',
  visibleFeature: 'Look for its giant antlers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Megaloceros, a prehistoric animal known as Megaloceros giganteus.',
      'Look for its giant antlers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Megaloceros', reading: 'Megaloceros' }],
  },
  facts: {
    period: 'Late Pleistocene–Holocene (about 400,000–7,700 years ago)',
    discoveryRegions: ["Europe","western Asia"],
    size: { kind: 'body-length', minMeters: 2.7, maxMeters: 3 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Megaloceros giganteus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant antlers; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Megaloceros — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/megaloceros',
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
