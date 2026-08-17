import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Psittacosaurus',
  classificationLabel: 'Psittacosaurus mongoliensis — dinosaur',
  visibleFeature: 'Look for its parrot beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Psittacosaurus, a prehistoric animal known as Psittacosaurus mongoliensis.',
      'Look for its parrot beak. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Psittacosaurus', reading: 'Psittacosaurus' }],
  },
  facts: {
    period: 'Early Cretaceous (about 125–100 million years ago)',
    discoveryRegions: ["China","Mongolia"],
    size: { kind: 'body-length', minMeters: 1.8, maxMeters: 2 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Psittacosaurus mongoliensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared parrot beak; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Psittacosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/psittacosaurus',
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
