import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VocalController } from '../../src/audio/vocal-controller'
import { NarrationController } from '../../src/audio/narration-controller'

describe('VocalController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('starts in idle state', () => {
    const vocal = new VocalController()
    expect(vocal.getSnapshot()).toEqual({
      isRoaring: false,
      activeAnimalId: null,
    })
    expect(vocal.getServerSnapshot()).toEqual({
      isRoaring: false,
      activeAnimalId: null,
    })
  })

  it('notifies subscribers on state change', async () => {
    const vocal = new VocalController()
    const listener = vi.fn()
    const unsubscribe = vocal.subscribe(listener)

    const narration = new NarrationController({
      createMedia: () => ({
        currentTime: 0,
        volume: 1.0,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    const duckSpy = vi.spyOn(narration, 'setDucked')

    await vocal.play('smilodon', narration)
    expect(vocal.getSnapshot().isRoaring).toBe(true)
    expect(vocal.getSnapshot().activeAnimalId).toBe('smilodon')
    expect(duckSpy).toHaveBeenCalledWith(true)
    expect(listener).toHaveBeenCalled()

    vocal.stop(narration)
    expect(vocal.getSnapshot().isRoaring).toBe(false)
    expect(duckSpy).toHaveBeenCalledWith(false)

    unsubscribe()
  })

  it('automatically stops roaring and restores ducking after timer expires', async () => {
    const vocal = new VocalController()
    const narration = new NarrationController()
    const duckSpy = vi.spyOn(narration, 'setDucked')

    await vocal.play('tyrannosaurus-rex', narration)
    expect(vocal.getSnapshot().isRoaring).toBe(true)
    expect(duckSpy).toHaveBeenCalledWith(true)

    vi.advanceTimersByTime(2500)
    expect(vocal.getSnapshot().isRoaring).toBe(false)
    expect(duckSpy).toHaveBeenCalledWith(false)
  })

  it('cleans up on destroy', async () => {
    const vocal = new VocalController()
    const narration = new NarrationController()
    await vocal.play('smilodon', narration)
    expect(vocal.getSnapshot().isRoaring).toBe(true)

    vocal.destroy()
    expect(vocal.getSnapshot().isRoaring).toBe(false)
  })
})
