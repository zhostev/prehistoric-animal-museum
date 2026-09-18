import { describe, expect, it } from 'vitest'
import { Group, Mesh, Vector3 } from 'three'
import { makeContactShadow } from '../../src/viewer/ViewerController'

describe('makeContactShadow', () => {
  it('creates a compound group containing core AO and ambient diffuse shadow layers', () => {
    const shadow = makeContactShadow(0.6, new Vector3(2, 1, 3), 0.8)
    expect(shadow).toBeInstanceOf(Group)
    expect(shadow.name).toBe('contact-shadow-compound')

    const coreAO = shadow.getObjectByName('contact-shadow-core-ao') as Mesh
    const diffuse = shadow.getObjectByName('contact-shadow-diffuse') as Mesh
    expect(coreAO).toBeDefined()
    expect(coreAO).toBeInstanceOf(Mesh)
    expect(diffuse).toBeDefined()
    expect(diffuse).toBeInstanceOf(Mesh)
  })
})
