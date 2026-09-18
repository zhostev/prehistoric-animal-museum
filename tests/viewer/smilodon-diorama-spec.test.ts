import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Smilodon diorama model standards', () => {
  const modelPath = resolve(__dirname, '../../src/content/animals/smilodon/model/model.glb')

  it('exists and is within file size budget (<= 3MB)', () => {
    expect(existsSync(modelPath)).toBe(true)
    const stats = statSync(modelPath)
    expect(stats.size).toBeLessThan(3 * 1024 * 1024)
    expect(stats.size).toBeGreaterThan(500 * 1024)
  })
})
