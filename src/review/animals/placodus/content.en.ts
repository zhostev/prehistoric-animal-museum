import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Placodus',
  classificationLabel: 'Placodus gigas — marine reptile',
  visibleFeature: 'Look for its crushing teeth. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Placodus, a prehistoric animal known as Placodus gigas.',
      'Look for its crushing teeth. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Placodus', reading: 'Placodus' }],
  },
  facts: {
    period: 'Middle Triassic (about 242–235 million years ago)',
    discoveryRegions: ["Europe"],
    size: { kind: 'body-length', minMeters: 1.8, maxMeters: 2 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Placodus gigas is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared crushing teeth; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Placodus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/placodus',
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
