import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Gomphotherium',
  classificationLabel: 'Gomphotherium angustidens — other prehistoric animal',
  visibleFeature: 'Look for its four tusks. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Gomphotherium, a prehistoric animal known as Gomphotherium angustidens.',
      'Look for its four tusks. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Gomphotherium', reading: 'Gomphotherium' }],
  },
  facts: {
    period: 'Miocene–Pliocene (about 23–2.6 million years ago)',
    discoveryRegions: ["Africa","Eurasia","North America"],
    size: { kind: 'body-length', minMeters: 3.6, maxMeters: 4 },
    diet: 'herbivore',
  },
  parentClassificationNote: 'Gomphotherium angustidens is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared four tusks; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Gomphotherium — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/gomphotherium',
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
