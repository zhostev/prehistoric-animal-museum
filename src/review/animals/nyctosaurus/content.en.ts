import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Nyctosaurus',
  classificationLabel: 'Nyctosaurus gracilis — pterosaur',
  visibleFeature: 'Look for its antler crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Nyctosaurus, a prehistoric animal known as Nyctosaurus gracilis.',
      'Look for its antler crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Nyctosaurus', reading: 'Nyctosaurus' }],
  },
  facts: {
    period: 'Late Cretaceous (about 85–84 million years ago)',
    discoveryRegions: ["Kansas, United States"],
    size: { kind: 'wingspan', minMeters: 2.16, maxMeters: 2.4 },
    diet: 'carnivore',
  },
  parentClassificationNote: 'Nyctosaurus gracilis is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared antler crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Nyctosaurus — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/nyctosaurus',
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
