import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Dimorphodon',
  classificationLabel: 'Dimorphodon macronyx — pterosaur',
  visibleFeature: 'Look for its large head. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Dimorphodon, a prehistoric animal known as Dimorphodon macronyx.',
      'Look for its large head. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Dimorphodon', reading: 'Dimorphodon' }],
  },
  facts: {
    period: 'Early Jurassic (about 190 million years ago)',
    discoveryRegions: ["England"],
    size: { kind: 'wingspan', minMeters: 1.53, maxMeters: 1.7 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Dimorphodon macronyx is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared large head; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Dimorphodon — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/dimorphodon',
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
