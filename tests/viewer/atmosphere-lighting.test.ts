import { describe, expect, it } from 'vitest'
import { createViewerModelDescriptor } from '../../src/viewer/create-viewer-model-descriptor'
import { getAtmosphereLightingPalette } from '../../src/viewer/ViewerController'

describe('Atmosphere lighting palette', () => {
  it('returns underwater blue tones for underwater atmosphere', () => {
    const palette = getAtmosphereLightingPalette('underwater')
    expect(palette.skyColor.getHexString()).toBe('82c3ec')
    expect(palette.groundColor.getHexString()).toBe('1d3557')
    expect(palette.intensity).toBeCloseTo(1.45)
  })

  it('returns cold tones for ice atmosphere', () => {
    const palette = getAtmosphereLightingPalette('ice')
    expect(palette.skyColor.getHexString()).toBe('f0f8ff')
    expect(palette.groundColor.getHexString()).toBe('b0c4de')
  })

  it('falls back to forest palette for unknown or forest atmosphere', () => {
    const palette = getAtmosphereLightingPalette('forest')
    expect(palette.skyColor.getHexString()).toBe('eef5e5')
    expect(palette.groundColor.getHexString()).toBe('5c6e46')
  })

  it('returns warm tones for plains atmosphere', () => {
    const palette = getAtmosphereLightingPalette('plains')
    expect(palette.skyColor.getHexString()).toBe('fff4e6')
    expect(palette.groundColor.getHexString()).toBe('a67c52')
    expect(palette.intensity).toBeCloseTo(1.35)
  })

  it('returns bright sky tones for air atmosphere', () => {
    const palette = getAtmosphereLightingPalette('air')
    expect(palette.skyColor.getHexString()).toBe('ffffff')
    expect(palette.groundColor.getHexString()).toBe('7a8b99')
    expect(palette.intensity).toBeCloseTo(1.30)
  })

  it('falls back to forest palette when atmosphere is undefined', () => {
    const palette = getAtmosphereLightingPalette(undefined)
    expect(palette.skyColor.getHexString()).toBe('eef5e5')
    expect(palette.groundColor.getHexString()).toBe('5c6e46')
    expect(palette.intensity).toBeCloseTo(1.30)
  })
})

describe('createViewerModelDescriptor atmosphere support', () => {
  const dummyPresentation = {
    initialYawDegrees: 0,
    safeAreaPadding: 0.2,
    shadow: 'ground' as const,
  }

  it('includes atmosphere in presentation when animal defines atmosphere', () => {
    const descriptor = createViewerModelDescriptor(
      {
        id: 'elasmosaurus',
        atmosphere: 'underwater',
        presentation: dummyPresentation,
      },
      'Elasmosaurus',
      '/model.glb',
    )
    expect(descriptor.presentation.atmosphere).toBe('underwater')
  })

  it('omits atmosphere in presentation when animal has no atmosphere', () => {
    const descriptor = createViewerModelDescriptor(
      {
        id: 'unknown-animal',
        presentation: dummyPresentation,
      },
      'Unknown',
      '/model.glb',
    )
    expect(descriptor.presentation.atmosphere).toBeUndefined()
  })
})
