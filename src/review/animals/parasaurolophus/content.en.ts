import type { AnimalContentEn } from '../../../content/types'

export const en = {
  name: 'Parasaurolophus',
  classificationLabel: 'Lambeosaurine duck-billed dinosaur',
  visibleFeature:
    'Look at the long hollow crest behind its head. Does it look like a long curved tube?',
  narration: {
    sentences: [
      'This is Parasaurolophus, a plant-eating duck-billed dinosaur from Late Cretaceous North America.',
      'Look at the long hollow crest behind its head. Does it look like a long curved tube?',
    ],
    pronunciation: [
      {
        text: 'Parasaurolophus',
        reading: 'pa-ra-saw-ROL-oh-fus',
      },
      {
        text: 'walkeri',
        reading: 'WAWL-ker-eye',
      },
    ],
  },
  facts: {
    period: 'Late Cretaceous (about 76–73 million years ago)',
    discoveryRegions: ['Alberta, Canada (Dinosaur Park Formation)'],
    size: {
      kind: 'body-length',
      minMeters: 9,
      maxMeters: 10,
    },
    diet: 'herbivore',
  },
  parentClassificationNote:
    'Parasaurolophus walkeri belonged to the lambeosaurines, a group of duck-billed dinosaurs with hollow head crests. Its nasal passages ran up through the crest, looped around and returned to the skull. Scientists think it may have blown air through the crest to make deep, trumpet-like calls to other Parasaurolophus.',
  sources: [
    {
      title: 'Parasaurolophus — Natural History Museum',
      url: 'https://www.nhm.ac.uk/discover/dino-directory/parasaurolophus.html',
      accessedOn: '2026-08-10',
    },
    {
      title:
        'Description and rediagnosis of the crested hadrosaurid (Ornithopoda: Dinosauria) Parasaurolophus cyrtocristatus on the basis of new cranial remains — PeerJ',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7842145/',
      accessedOn: '2026-08-10',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'The 9–10 metre figure is an approximate adult length range for family reading; the most complete P. walkeri specimen is a little shorter, and fossil material of this species is limited.',
      'The sound of the crest is a computer reconstruction based on its inner air passages, not a real recording; nobody knows the exact sound it made.',
      'The crest shape and colour of the current low-poly stylised model are cautious artistic reconstructions.',
    ],
    editedBy: 'kimi-code (draft)',
    reviewedBy: 'zho',
    reviewedOn: '2026-08-13',
  },
} satisfies AnimalContentEn
