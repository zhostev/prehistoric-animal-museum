import { describe, expect, it } from 'vitest'
import { mainCollection } from '../../src/content/collections/main'
import {
  getAnimalVocalArchetype,
  type VocalArchetype,
} from '../../src/audio/vocal-synthesizer'

describe('Vocal synthesizer archetype mapping', () => {
  const validArchetypes: readonly VocalArchetype[] = [
    'apex_theropod',
    'sabertooth_feline',
    'hadrosaur_crest',
    'sauropod_infrasound',
    'proboscidean',
    'pterosaur_avian',
    'marine_behemoth',
    'armored_herbivore',
    'arthropod_drone',
  ]

  it('maps all 50 animals in mainCollection to a recognized archetype', () => {
    expect(mainCollection.animalIds.length).toBe(50)
    for (const id of mainCollection.animalIds) {
      const archetype = getAnimalVocalArchetype(id)
      expect(validArchetypes, `unrecognized archetype ${archetype} for ${id}`).toContain(
        archetype,
      )
    }
  })

  it('correctly maps specific representative species', () => {
    expect(getAnimalVocalArchetype('tyrannosaurus-rex')).toBe('apex_theropod')
    expect(getAnimalVocalArchetype('smilodon')).toBe('sabertooth_feline')
    expect(getAnimalVocalArchetype('parasaurolophus')).toBe('hadrosaur_crest')
    expect(getAnimalVocalArchetype('mammoth')).toBe('proboscidean')
    expect(getAnimalVocalArchetype('meganeura')).toBe('arthropod_drone')
    expect(getAnimalVocalArchetype('brachiosaurus')).toBe('sauropod_infrasound')
    expect(getAnimalVocalArchetype('pteranodon')).toBe('pterosaur_avian')
    expect(getAnimalVocalArchetype('mosasaurus')).toBe('marine_behemoth')
    expect(getAnimalVocalArchetype('ankylosaurus')).toBe('armored_herbivore')
  })
})
