import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Utahraptor',
  classificationLabel: 'Utahraptor ostrommaysorum — dinosaur',
  visibleFeature: 'Look for its sickle claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Utahraptor, a prehistoric animal known as Utahraptor ostrommaysorum.',
      'Look for its sickle claw. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Utahraptor', reading: 'Utahraptor' }],
  },
  facts: {
    period: 'Early Cretaceous (about 135–130 million years ago)',
    discoveryRegions: ["Utah, United States"],
    size: { kind: 'body-length', minMeters: 4.95, maxMeters: 5.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Utahraptor ostrommaysorum is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared sickle claw; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Utahraptor — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/utahraptor',
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
