import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Kentrosaurus',
  classificationLabel: 'Kentrosaurus aethiopicus — dinosaur',
  visibleFeature: 'Look for its shoulder spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Kentrosaurus, a prehistoric animal known as Kentrosaurus aethiopicus.',
      'Look for its shoulder spikes. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Kentrosaurus', reading: 'Kentrosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 152 million years ago)',
    discoveryRegions: ["Tanzania"],
    size: { kind: 'body-length', minMeters: 4.5, maxMeters: 5 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Kentrosaurus aethiopicus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared shoulder spikes; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Kentrosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/kentrosaurus',
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
