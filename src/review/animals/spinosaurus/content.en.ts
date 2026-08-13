import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Spinosaurus',
  classificationLabel: 'Spinosaurid theropod dinosaur',
  visibleFeature:
    'Look at its tall back sail and long narrow snout. Does it look like a giant hunter specially shaped for life around rivers?',
  narration: {
    sentences: [
      'This is Spinosaurus, a giant meat-eating dinosaur that lived around North African rivers in the early Late Cretaceous.',
      'Look at its tall back sail and long narrow snout. Does it look like a giant hunter specially shaped for life around rivers?',
    ],
    pronunciation: [
      { text: 'Spinosaurus', reading: 'SPY-noh-SOR-us' },
      { text: 'aegyptiacus', reading: 'ee-JIP-tee-uh-kus' },
    ],
  },
  facts: {
    period: 'early Late Cretaceous (about 99–94 million years ago)',
    discoveryRegions: ['Morocco (Kem Kem Group)', 'Egypt (historic type material)'],
    size: {
      kind: 'body-length',
      minMeters: 13,
      maxMeters: 14.5,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    'Spinosaurus aegyptiacus was a spinosaurid theropod with a long snout, conical teeth, tall neural spines over its back and a vertically deep tail. Tail fossils and hydrodynamic tests published in 2020 support thrust production in water, but how often it swam and whether it pursued prey underwater remain actively debated.',
  sources: [
    {
      title: 'Semiaquatic adaptations in a giant predatory dinosaur — Science',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25213375/',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Tail-propelled aquatic locomotion in a theropod dinosaur — Nature',
      url: 'https://doi.org/10.1038/s41586-020-2190-3',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Spinosaurus is not an aquatic dinosaur — eLife',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36448670/',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'No single complete adult skeleton is known. The 13–14.5-metre range comes from composite reconstruction and proportional estimates; this model is fixed at the conservative 13.0-metre end.',
      'Aquatic ability remains debated: evidence that the tail generated thrust in water does not by itself demonstrate a highly aquatic, continuously diving pursuit predator.',
      'This project-authored low-poly model has fuller legs and a clearer sail-to-tail notch, but it does not fully reproduce the known tail’s vertical depth. The owner reviewed the anatomy with that limitation retained.',
      'Body colour, sail-edge colour, posture and Idle naturalness are display choices rather than direct fossil evidence.',
    ],
    editedBy: 'Codex',
    reviewedBy: 'zho',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentEn
