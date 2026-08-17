import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Protoceratops',
  classificationLabel: 'Protoceratops andrewsi — dinosaur',
  visibleFeature: 'Look for its small frill. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Protoceratops, a prehistoric animal known as Protoceratops andrewsi.',
      'Look for its small frill. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Protoceratops', reading: 'Protoceratops' }],
  },
  facts: {
    period: 'Late Cretaceous (about 75–71 million years ago)',
    discoveryRegions: ["Mongolia","northern China"],
    size: { kind: 'body-length', minMeters: 1.8, maxMeters: 2 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Protoceratops andrewsi is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared small frill; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Protoceratops — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/protoceratops',
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
