import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Ammonite scan',
  classificationLabel: 'Extinct marine cephalopod shell fossil (specimen identity unresolved)',
  visibleFeature:
    'Look at the coiled shell winding round and round. Does it look like a stone rope rolled into a spiral?',
  narration: {
    sentences: [
      'This is a three-dimensional scan of an ammonite fossil shell, not a living-animal reconstruction with soft parts.',
      'Look at the coiled shell winding round and round. Does it look like a stone rope rolled into a spiral?',
    ],
    pronunciation: [
      { text: 'ammonite', reading: 'AM-uh-night' },
      { text: 'cephalopod', reading: 'SEF-uh-luh-pod' },
    ],
  },
  facts: {
    period: 'Devonian to end-Cretaceous (group range; this scan has no supplied age)',
    discoveryRegions: ['ancient marine rocks worldwide (this scan has no supplied locality)'],
    size: {
      kind: 'group-range',
      minMeters: 0.01,
      maxMeters: 2,
      note: 'Shell diameter varied greatly among species and growth stages; the model’s 0.40-metre display size is not a specimen measurement.',
    },
    diet: 'unknown',
  },
  parentClassificationNote:
    'Ammonites were extinct marine cephalopod molluscs. As they grew, they added new shell chambers, while the sealed older chambers helped control buoyancy. Hard shells are common fossils but ammonite soft parts are exceptionally rare. This source supplies only a fossil-shell scan, so the display does not invent arms, eyes or other soft anatomy.',
  sources: [
    {
      title: 'What is an ammonite? — Natural History Museum',
      url: 'https://www.nhm.ac.uk/discover/what-is-an-ammonite.html',
      accessedOn: '2026-08-11',
    },
    {
      title: 'Ammonite Fossil (2246008) — Internet Archive',
      url: 'https://archive.org/details/thingiverse-2246008',
      accessedOn: '2026-08-11',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'The source says only “Ammonite Fossil” and supplies no genus, species, formation, age, locality or specimen number; the shape cannot be used to invent an identification.',
      'The asset is a surface scan of one fossil shell, not a life reconstruction. No soft anatomy, life pose or body colour has been added.',
      'The 0.40-metre value is a web-display normalization, not a measurement of the original fossil. The group size range is context and cannot be assigned to this scan.',
      'The owner reviewed the copy and fossil-shell material treatment; the specimen identity remains unresolved because the source supplies too little information.',
    ],
    editedBy: 'Codex',
    reviewedBy: 'museum-owner',
    reviewedOn: '2026-08-11',
  },
} satisfies AnimalContentEn
