import { loadAnimalDefinitions } from '../scripts/content-data'
import type { AnimalPackageDefinition } from '../src/content/types'

export interface AuditReport {
  id: string
  habitat: string
  atmosphere: string
  shadow: string
  vOffset: number
  hOffset: number
  yaw: number
  issues: string[]
}

const loadedDefinitions = await loadAnimalDefinitions()
export const allAnimals: AnimalPackageDefinition[] = loadedDefinitions.map((pkg) => pkg.definition)

export function auditAnimals(animals: AnimalPackageDefinition[] = allAnimals): AuditReport[] {
  return animals.map((animal) => {
    const issues: string[] = []
    const pres = animal.presentation
    const vOffset = pres.landscapeVerticalOffset ?? 0
    const hOffset = pres.landscapeHorizontalOffset ?? 0
    const yaw = pres.initialYawDegrees
    const shadow = pres.shadow ?? 'none'

    if (animal.habitat === 'water' && shadow === 'ground') {
      issues.push('水生生物配置了贴地硬阴影 (ground shadow)')
    }
    if (animal.habitat === 'land' && shadow !== 'ground') {
      issues.push('陆生动物缺少贴地硬阴影 (ground shadow)')
    }
    if (animal.habitat === 'land' && vOffset > -0.04) {
      issues.push(`陆生动物垂直沉降不足可能悬浮 (vOffset: ${vOffset})`)
    }
    if (Math.abs(yaw) === 90 || yaw === 0 || Math.abs(yaw) === 180) {
      issues.push(`视角偏向正向或纯正侧面，缺乏 3/4 景深 (yaw: ${yaw})`)
    }

    return {
      id: animal.id,
      habitat: animal.habitat,
      atmosphere: animal.atmosphere,
      shadow,
      vOffset,
      hOffset,
      yaw,
      issues,
    }
  })
}

const reports = auditAnimals()
const failing = reports.filter((r) => r.issues.length > 0)
console.log(`Total audited: ${reports.length}, Failing: ${failing.length}`)
if (failing.length > 0) {
  console.table(failing.map((f) => ({ id: f.id, habitat: f.habitat, vOffset: f.vOffset, yaw: f.yaw, issues: f.issues.join('; ') })))
} else {
  console.log(`All ${reports.length} animals passed integration audit with 0 issues!`)
}
