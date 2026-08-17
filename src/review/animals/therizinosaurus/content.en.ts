import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Therizinosaurus',
  classificationLabel: 'Therizinosaurus cheloniformis — dinosaur',
  visibleFeature: 'Look for its giant claws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Therizinosaurus, a prehistoric animal known as Therizinosaurus cheloniformis.',
      'Look for its giant claws. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Therizinosaurus', reading: 'Therizinosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 70 million years ago)',
    discoveryRegions: ["Mongolia"],
    size: { kind: 'body-length', minMeters: 9, maxMeters: 10 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Therizinosaurus cheloniformis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared giant claws; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Therizinosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/therizinosaurus',
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
