import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Jaekelopterus',
  classificationLabel: 'Pterygotid eurypterid (source identity unresolved)',
  visibleFeature:
    'Look at the big spiny appendages at the front of its body. Do they look like two pincers for holding prey?',
  narration: {
    sentences: [
      'The file inside this model package is labelled Jaekelopterus, but the source item is titled Megalograptus, so its identity still needs checking.',
      'Look at the big spiny appendages at the front of its body. Do they look like two pincers for holding prey?',
    ],
    pronunciation: [
      { text: 'Jaekelopterus', reading: 'YAY-kel-OP-ter-us' },
      { text: 'eurypterid', reading: 'yoo-RIP-ter-id' },
    ],
  },
  facts: {
    period: 'Early Devonian (about 410–393 million years ago, if the Jaekelopterus identification is correct)',
    discoveryRegions: ['Rhineland-Palatinate, Germany (Jaekelopterus rhenaniae)'],
    size: {
      kind: 'body-length',
      minMeters: 2.3,
      maxMeters: 2.6,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    'Jaekelopterus rhenaniae was a giant pterygotid eurypterid. A fossil claw about 46 centimetres long from Germany was scaled against related species to suggest a body length of roughly 2.5 metres. That figure is an estimate for a very large individual extrapolated from one body part, not a tape measurement of a complete animal.',
  sources: [
    {
      title: 'Giant claw reveals the largest ever arthropod — Biology Letters',
      url: 'https://doi.org/10.1098/rsbl.2007.0491',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Megalograptus (4702654) — Internet Archive',
      url: 'https://archive.org/details/thingiverse-4702654',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'The source item is titled “Megalograptus”, while its downloaded mesh is named “Jaekelopterus.stl”. No specimen number or author identification note resolves that conflict.',
      'The Early Devonian age, German locality and roughly 2.5-metre estimate belong to Jaekelopterus rhenaniae and apply to this model only if the filename identification is correct.',
      'The 2.5-metre figure extrapolates from a 46-centimetre claw using relative proportions and represents a maximum-size estimate. The model is displayed at 2.5 metres, not as a typical individual.',
      'Colour, soft tissue, swimming pose and segmented motion are owner-reviewed cautious display choices; they do not resolve the source identity conflict.',
    ],
    editedBy: 'Codex',
    reviewedBy: 'museum-owner',
    reviewedOn: '2026-08-11',
  },
} satisfies AnimalContentEn
