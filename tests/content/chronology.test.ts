import { describe, expect, it } from 'vitest'
import { mainCollection } from '../../src/content/collections/main'
import { getAnimalChronology, sortAnimalsByTimeline } from '../../src/content/chronology'

describe('Animal chronology metadata', () => {
  it('covers all 50 animals in mainCollection with valid mya and badges', () => {
    expect(mainCollection.animalIds.length).toBe(50)
    for (const id of mainCollection.animalIds) {
      const entry = getAnimalChronology(id)
      expect(entry, `missing chronology entry for ${id}`).toBeDefined()
      expect(entry.mya).toBeGreaterThan(0)
      expect(entry.periodId).toBeTruthy()
      expect(entry.badge['zh-CN']).toBeTruthy()
      expect(entry.badge.en).toBeTruthy()
    }
  })

  it('correctly sorts from oldest (Cambrian Anomalocaris) to newest (Mammoth)', () => {
    const list = mainCollection.animalIds.map((id) => ({ id }))
    const sorted = sortAnimalsByTimeline(list, 'oldest-first')
    expect(sorted[0]?.id).toBe('anomalocaris')
    expect(sorted.at(-1)?.id).toBe('mammoth')
  })

  it('correctly sorts in reverse (newest-first)', () => {
    const list = mainCollection.animalIds.map((id) => ({ id }))
    const sorted = sortAnimalsByTimeline(list, 'newest-first')
    expect(sorted[0]?.id).toBe('mammoth')
    expect(sorted.at(-1)?.id).toBe('anomalocaris')
  })
})
