import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Herrerasaurus',
  classificationLabel: 'Herrerasaurus ischigualastensis — dinosaur',
  visibleFeature: 'Look for its primitive slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Herrerasaurus, a prehistoric animal known as Herrerasaurus ischigualastensis.',
      'Look for its primitive slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Herrerasaurus', reading: 'Herrerasaurus' }],
  },
  facts: {
    period: 'Late Triassic (about 231 million years ago)',
    discoveryRegions: ["Argentina"],
    size: { kind: 'body-length', minMeters: 4.05, maxMeters: 4.5 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Herrerasaurus ischigualastensis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared primitive slender; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Herrerasaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/herrerasaurus',
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
