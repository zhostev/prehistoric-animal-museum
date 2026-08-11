import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Dunkleosteus',
  classificationLabel: 'Arthrodire placoderm fish',
  visibleFeature:
    'Look at the hard bony armour covering its head. Does it look as though it is wearing a strong helmet?',
  narration: {
    sentences: [
      'This is Dunkleosteus, a meat-eating armoured fish from the Late Devonian seas.',
      'Look at the hard bony armour covering its head. Does it look as though it is wearing a strong helmet?',
    ],
    pronunciation: [
      {
        text: 'Dunkleosteus',
        reading: 'dun-kul-OSS-tee-us',
      },
      {
        text: 'Devonian',
        reading: 'dih-VOH-nee-un',
      },
    ],
  },
  facts: {
    period: 'Late Devonian (about 382–358 million years ago)',
    discoveryRegions: [
      'Ohio, United States (Cleveland Shale)',
      'elsewhere in North America and Morocco',
    ],
    size: {
      kind: 'body-length',
      minMeters: 3.4,
      maxMeters: 4.1,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    'Dunkleosteus terrelli was an arthrodire placoderm, one of the first large predators of the seas. Instead of true teeth, it had sharp bony jaw plates that sliced through prey like scissors and kept their edges sharp as it bit. Its fossils mostly preserve the bony armour of the head and chest, so the back half of its body has never been found complete.',
  sources: [
    {
      title:
        'A Devonian Fish Tale: A New Method of Body Length Estimation Suggests Much Smaller Sizes for Dunkleosteus terrelli (Placodermi: Arthrodira) — Diversity (MDPI)',
      url: 'https://www.mdpi.com/1424-2818/15/3/318',
      accessedOn: '2026-08-10',
    },
    {
      title:
        'Reconstructing Dunkleosteus terrelli (Placodermi: Arthrodira): A New Look for an Iconic Devonian Predator — Palaeontologia Electronica',
      url: 'https://palaeo-electronica.org/content/2024/5307-dunkleosteus-reconstruction',
      accessedOn: '2026-08-10',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'Its exact length is still debated: older sources often cite 6–10 metres, while a 2023 study using eye-socket-to-gill-cover measurements estimated about 3.4 metres for a typical adult and about 4 metres for the largest specimen. The label uses the cautious 3.4–4.1 metre range.',
      'The fossils preserve almost only the head and chest armour; the trunk and tail are inferred from more completely preserved arthrodire relatives, so the current life-reconstruction model is a cautious artistic reconstruction.',
      'The attribution of Moroccan material to Dunkleosteus is still discussed; the model’s colours and soft-tissue details have no direct fossil evidence.',
    ],
    editedBy: 'kimi-code (draft)',
    reviewedBy: 'zhostev (owner)',
    reviewedOn: '2026-08-10',
  },
} satisfies AnimalContentEn
