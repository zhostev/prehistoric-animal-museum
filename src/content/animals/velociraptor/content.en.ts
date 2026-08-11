import type { AnimalContentEn } from '../../types'

export const en = {
  name: 'Velociraptor',
  classificationLabel: 'Dromaeosaurid theropod dinosaur',
  visibleFeature:
    'Look at the big curved claw held up on each of its feet. Does it look like a sharp little sickle?',
  narration: {
    sentences: [
      'This is Velociraptor, a feathered meat-eating dinosaur from Late Cretaceous Mongolia.',
      'Look at the big curved claw held up on each of its feet. Does it look like a sharp little sickle?',
    ],
    pronunciation: [
      {
        text: 'Velociraptor',
        reading: 'vel-OSS-ih-RAP-tor',
      },
      {
        text: 'mongoliensis',
        reading: 'mon-goh-lee-EN-sis',
      },
    ],
  },
  facts: {
    period: 'Late Cretaceous (about 75–71 million years ago)',
    discoveryRegions: ['Mongolia (Djadochta Formation)', 'Inner Mongolia, China'],
    size: {
      kind: 'body-length',
      minMeters: 1.8,
      maxMeters: 2.1,
    },
    diet: 'carnivore',
  },
  parentClassificationNote:
    'Velociraptor mongoliensis was a dromaeosaurid, a small theropod dinosaur closely related to birds. Small bumps called quill knobs on its forearm bones show that it carried wing-like feathers on its arms. Films made it much larger and featherless, but the real Velociraptor was about the size of a turkey.',
  sources: [
    {
      title: 'Velociraptor — Natural History Museum',
      url: 'https://www.nhm.ac.uk/discover/dino-directory/velociraptor.html',
      accessedOn: '2026-08-10',
    },
    {
      title: 'Feather quill knobs in the dinosaur Velociraptor — Science',
      url: 'https://doi.org/10.1126/science.1145076',
      accessedOn: '2026-08-10',
    },
  ],
  editorial: {
    uncertaintyNotes: [
      'The 1.8–2.1 metre figure is an approximate adult length range for family reading; it does not tie the current model to one specimen.',
      'Quill knobs directly confirm feathers on the forearm; the full extent of the body covering is inferred from close dromaeosaurid relatives, and the current low-poly stylised model does not show feathers.',
      'The label stays at the genus level, Velociraptor, with V. mongoliensis as the reference species. The display name and sickle claw have been checked for this exhibition.',
    ],
    editedBy: 'kimi-code (draft)',
    reviewedBy: 'zhostev (owner)',
    reviewedOn: '2026-08-10',
  },
} satisfies AnimalContentEn
