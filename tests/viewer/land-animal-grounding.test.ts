import { describe, expect, it } from 'vitest'
import { createViewerModelDescriptor } from '../../src/viewer/create-viewer-model-descriptor'

describe('createViewerModelDescriptor habitat grounding', () => {
  it('applies grounding vertical offset for land animals when not explicitly overridden', () => {
    const descriptor = createViewerModelDescriptor(
      {
        id: 'tyrannosaurus-rex',
        habitat: 'land',
        presentation: {
          initialYawDegrees: 0,
          safeAreaPadding: 0.15,
          shadow: 'ground',
        },
      },
      '霸王龙',
      '/model.glb',
    )
    expect(descriptor.presentation.verticalOffset?.landscape).toBe(0.14)
    expect(descriptor.presentation.verticalOffset?.portrait).toBe(0.10)
  })

  it('keeps vertical offset at 0 for water and air animals', () => {
    const waterDescriptor = createViewerModelDescriptor(
      {
        id: 'mosasaurus',
        habitat: 'water',
        presentation: {
          initialYawDegrees: 0,
          safeAreaPadding: 0.15,
          shadow: 'none',
        },
      },
      '沧龙',
      '/model.glb',
    )
    expect(waterDescriptor.presentation.verticalOffset?.landscape).toBe(0)
    expect(waterDescriptor.presentation.verticalOffset?.portrait).toBe(0)

    const airDescriptor = createViewerModelDescriptor(
      {
        id: 'pteranodon',
        habitat: 'air',
        presentation: {
          initialYawDegrees: 0,
          safeAreaPadding: 0.15,
          shadow: 'none',
        },
      },
      '无齿翼龙',
      '/model.glb',
    )
    expect(airDescriptor.presentation.verticalOffset?.landscape).toBe(0)
    expect(airDescriptor.presentation.verticalOffset?.portrait).toBe(0)
  })

  it('respects explicit animal presentation vertical offset overrides for land animals', () => {
    const descriptor = createViewerModelDescriptor(
      {
        id: 'stegosaurus',
        habitat: 'land',
        presentation: {
          initialYawDegrees: 0,
          safeAreaPadding: 0.15,
          landscapeVerticalOffset: 0.08,
          portraitVerticalOffset: 0.05,
          shadow: 'ground',
        },
      },
      '剑龙',
      '/model.glb',
    )
    expect(descriptor.presentation.verticalOffset?.landscape).toBe(0.08)
    expect(descriptor.presentation.verticalOffset?.portrait).toBe(0.05)
  })
})
