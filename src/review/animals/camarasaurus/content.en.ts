import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Camarasaurus',
  classificationLabel: 'Camarasaurus lentus — dinosaur',
  visibleFeature: 'Look for its boxy skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Camarasaurus, a prehistoric animal known as Camarasaurus lentus.',
      'Look for its boxy skull. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Camarasaurus', reading: 'Camarasaurus' }],
  },
  facts: {
    period: 'Late Jurassic (about 155–145 million years ago)',
    discoveryRegions: ["western United States"],
    size: { kind: 'body-length', minMeters: 16.2, maxMeters: 18 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Camarasaurus lentus is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared boxy skull; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Camarasaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/camarasaurus',
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
