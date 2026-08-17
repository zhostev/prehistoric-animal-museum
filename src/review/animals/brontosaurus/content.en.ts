import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Brontosaurus',
  classificationLabel: 'Brontosaurus excelsus — dinosaur',
  visibleFeature: 'Look for its robust neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Brontosaurus, a prehistoric animal known as Brontosaurus excelsus.',
      'Look for its robust neck. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Brontosaurus', reading: 'Brontosaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 156–146 million years ago)',
    discoveryRegions: ["western United States"],
    size: { kind: 'body-length', minMeters: 19.8, maxMeters: 22 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Brontosaurus excelsus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared robust neck; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Brontosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/brontosaurus',
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
