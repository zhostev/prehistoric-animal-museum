import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Compsognathus',
  classificationLabel: 'Compsognathus longipes — dinosaur',
  visibleFeature: 'Look for its tiny slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Compsognathus, a prehistoric animal known as Compsognathus longipes.',
      'Look for its tiny slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Compsognathus', reading: 'Compsognathus' }],
  },
  facts: {
    period: 'Late Jurassic (about 150 million years ago)',
    discoveryRegions: ["Germany","France"],
    size: { kind: 'body-length', minMeters: 1.125, maxMeters: 1.25 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Compsognathus longipes is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared tiny slender; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Compsognathus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/compsognathus',
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
