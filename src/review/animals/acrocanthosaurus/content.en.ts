import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Acrocanthosaurus',
  classificationLabel: 'Acrocanthosaurus atokensis — dinosaur',
  visibleFeature: 'Look for its back ridge. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Acrocanthosaurus, a prehistoric animal known as Acrocanthosaurus atokensis.',
      'Look for its back ridge. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Acrocanthosaurus', reading: 'Acrocanthosaurus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 113–110 million years ago)',
    discoveryRegions: ["United States"],
    size: { kind: 'body-length', minMeters: 10.35, maxMeters: 11.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Acrocanthosaurus atokensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared back ridge; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Acrocanthosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/acrocanthosaurus',
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
