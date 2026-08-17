import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Oviraptor',
  classificationLabel: 'Oviraptor philoceratops — dinosaur',
  visibleFeature: 'Look for its beaked crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
  narration: {
    sentences: [
      'This is Oviraptor, a prehistoric animal known as Oviraptor philoceratops.',
      'Look for its beaked crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
    ],
    pronunciation: [{ text: 'Oviraptor', reading: 'Oviraptor' }],
  },
  facts: {
    period: 'Late Cretaceous (about 75 million years ago)',
    discoveryRegions: ["Mongolia"],
    size: { kind: 'body-length', minMeters: 1.62, maxMeters: 1.8 },
    diet: 'omnivore',
  },
  parentClassificationNote: 'Oviraptor philoceratops is represented here by a project-authored stylised reconstruction. The silhouette highlights the declared beaked crest; colours and soft tissues are cautious display choices, not preserved fossil evidence.',
  sources: [{
    title: 'Oviraptor — Encyclopaedia Britannica',
    url: 'https://www.britannica.com/animal/oviraptor',
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
