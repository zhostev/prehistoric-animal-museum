import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Smilodon',
  classificationLabel: 'Machairodont sabre-toothed cat',
  visibleFeature:
    'Look at the two long, flattened upper canines. Do they look like curved blades resting beside its mouth?',
  narration: {
    sentences: [
      'This is Smilodon, a meat-eating cat from the Americas with long, flattened upper canine teeth.',
      'Look at the two long, flattened upper canines. Do they look like curved blades resting beside its mouth?',
    ],
    pronunciation: [
      { text: 'Smilodon', reading: 'SMY-loh-don' },
      { text: 'machairodont', reading: 'muh-KAIR-oh-dont' },
    ],
  },
  facts: {
    period: 'Late Pliocene to end-Pleistocene (about 2.5 million–13,000 years ago, genus range)',
    discoveryRegions: ['North America', 'South America'],
    size: {
      kind: 'body-length',
      minMeters: 1.7,
      maxMeters: 2.1,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    'Smilodon was a machairodont felid, not a true tiger. Research on the North American species S. fatalis shows exceptionally robust forelimb bones, well suited to restraining large prey before the long upper canines delivered a bite. Those canines were spectacular but needed protection from forces applied in the wrong direction.',
  sources: [
    {
      title: 'The Big Cats — Tule Springs Fossil Beds, National Park Service',
      url: 'https://www.nps.gov/articles/000/the-big-cats.htm',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Body size of Smilodon (Mammalia: Felidae) — Annales Zoologici Fennici',
      url: 'https://pubmed.ncbi.nlm.nih.gov/16235255/',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Radiographs Reveal Exceptional Forelimb Strength in the Sabertooth Cat, Smilodon fatalis — PLOS ONE',
      url: 'https://doi.org/10.1371/journal.pone.0011412',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'The source labels the model only “smilodon” and does not identify S. gracilis, S. fatalis or S. populator. Genus-level time, range and size context is not a species identification.',
      'The model is displayed at 2.1 metres total length, near the large end of the selected range; species and individuals varied substantially.',
      'Coat colour, external ears, nose and muscle outlines are not directly preserved; this is a stylised sculpt.',
      'The source mesh has exactly one connected body component and no separate pedestal. The owner reviewed the added breathing and head-sway display motions.',
    ],
    editedBy: 'Codex',
    reviewedBy: 'zho',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentEn
