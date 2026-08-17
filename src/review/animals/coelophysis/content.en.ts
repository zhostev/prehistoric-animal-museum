import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Coelophysis',
  classificationLabel: 'Coelophysis bauri — dinosaur',
  visibleFeature: 'Look for its slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Coelophysis, a prehistoric animal known as Coelophysis bauri.',
      'Look for its slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Coelophysis', reading: 'Coelophysis' }],
  },
  facts: {
    period: 'Late Triassic (about 216–203 million years ago)',
    discoveryRegions: ["southwestern United States"],
    size: { kind: 'body-length', minMeters: 2.7, maxMeters: 3 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Coelophysis bauri is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared slender; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Coelophysis — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/coelophysis',
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
