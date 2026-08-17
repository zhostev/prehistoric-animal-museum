import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Glyptodon',
  classificationLabel: 'Glyptodon clavipes — other prehistoric animal',
  visibleFeature: 'Look for its domed shell. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Glyptodon, a prehistoric animal known as Glyptodon clavipes.',
      'Look for its domed shell. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Glyptodon', reading: 'Glyptodon' }],
  },
  facts: {
    period: 'Pleistocene (about 2.6 million–11,700 years ago)',
    discoveryRegions: ["South America"],
    size: { kind: 'body-length', minMeters: 2.7, maxMeters: 3 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Glyptodon clavipes is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared domed shell; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Glyptodon — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/glyptodon',
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
