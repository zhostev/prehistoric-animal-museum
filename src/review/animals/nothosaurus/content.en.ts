import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Nothosaurus',
  classificationLabel: 'Nothosaurus giganteus — marine reptile',
  visibleFeature: 'Look for its webbed feet. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Nothosaurus, a prehistoric animal known as Nothosaurus giganteus.',
      'Look for its webbed feet. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Nothosaurus', reading: 'Nothosaurus' }],
  },
  facts: {
    period: 'Middle Triassic (about 240–210 million years ago)',
    discoveryRegions: ["Europe","China"],
    size: { kind: 'body-length', minMeters: 3.6, maxMeters: 4 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Nothosaurus giganteus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared webbed feet; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Nothosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/nothosaurus',
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
