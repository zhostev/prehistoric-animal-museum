# 史前动物博物馆：背景契合度与动物模型优化实施计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 增强 3D 渲染器的生境光照与多模式阴影管线，全量校准 50 只史前动物的落脚点地平线与展示参数，消除浮空与色温割裂，并对诊断出的严重瑕疵资产进行靶向治理。

**Architecture:**
1. 在 `ViewerController` 中引入根据动物 `atmosphere`（`forest` / `underwater` / `plains` / `ice` / `air`）自适应半球光色调与阴影衰减算法；
2. 扩展 `createViewerModelDescriptor` 与 `ViewerModelDescriptor` 支持氛围光照配置；
3. 全量盘点并分类 50 只展品，先分水生/飞行与陆生批次校准 `verticalOffset`、`initialYawDegrees` 与 `shadow` 参数；
4. 对严重瑕疵的 C 级资产执行合规靶向替换并更新 `provenance.ts`。

**Tech Stack:** Three.js, TypeScript, React, Vite, Vitest, Node.js

## Global Constraints

- 所有模型资产必须符合 `ANIMAL_AUTHORING_GUIDE.md`（自包含 GLB、体积 ≤ 12MB、面数 ≤ 100,000、单个 `Idle` 待机动画）。
- 所有背景资产必须为标准化 WebP（横屏 1920x1080、竖屏 1080x1920），并在替换时完整更新 `provenance.ts` 的 SHA-256 与 byte 记录。
- 每次修改后均需通过 `npm run test` 与 `npm run check:content`，无类型报错，无 Lint 报错。

---

### Task 1: 渲染器与模型描述符扩展 —— 生境半球光与多模式阴影

**Files:**
- Modify: `src/viewer/viewer-model-descriptor.ts`
- Modify: `src/viewer/create-viewer-model-descriptor.ts`
- Modify: `src/viewer/ViewerController.ts`
- Test: `tests/viewer/atmosphere-lighting.test.ts`

**Interfaces:**
- Consumes: `AnimalPresentation`, `DisplayableAnimalPackage['atmosphere']`
- Produces: `AtmosphereLightingConfig`, `updateAtmosphereLighting(atmosphere: string)`

- [ ] **Step 1: 编写生境光照映射与调色板单元测试**

创建 `tests/viewer/atmosphere-lighting.test.ts`：
```ts
import { describe, expect, it } from 'vitest'
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
})
```

- [ ] **Step 2: 运行测试以确认失败**

运行: `npx vitest run tests/viewer/atmosphere-lighting.test.ts`
预期: FAIL，提示 `getAtmosphereLightingPalette` 未定义。

- [ ] **Step 3: 扩展类型与实现生境光照与自适应阴影**

修改 `src/viewer/viewer-model-descriptor.ts`，在 `presentation` 接口中增加 `atmosphere` 可选字段：
```ts
export interface ViewerModelPresentation {
  readonly atmosphere?: string
  // ... 其他已有字段
}
```

修改 `src/viewer/create-viewer-model-descriptor.ts`：
```ts
export function createViewerModelDescriptor(
  animal: ViewerAnimalSource & { readonly atmosphere?: string },
  label: string,
  modelUrl: string,
  accessibilityLabel?: string,
): ViewerModelDescriptor {
  return {
    // ...
    presentation: {
      ...(animal.atmosphere ? { atmosphere: animal.atmosphere } : {}),
      // ... 其余配置保持
    }
  }
}
```

在 `src/viewer/ViewerController.ts` 中实现调色板与光照更新：
```ts
export interface AtmosphereLightingPalette {
  readonly groundColor: Color
  readonly intensity: number
  readonly skyColor: Color
}

export function getAtmosphereLightingPalette(atmosphere?: string): AtmosphereLightingPalette {
  switch (atmosphere) {
    case 'underwater':
      return {
        groundColor: new Color('#1d3557'),
        intensity: 1.45,
        skyColor: new Color('#82c3ec'),
      }
    case 'ice':
      return {
        groundColor: new Color('#b0c4de'),
        intensity: 1.25,
        skyColor: new Color('#f0f8ff'),
      }
    case 'plains':
      return {
        groundColor: new Color('#a67c52'),
        intensity: 1.35,
        skyColor: new Color('#fff4e6'),
      }
    case 'air':
      return {
        groundColor: new Color('#7a8b99'),
        intensity: 1.30,
        skyColor: new Color('#ffffff'),
      }
    case 'forest':
    default:
      return {
        groundColor: new Color('#5c6e46'),
        intensity: 1.30,
        skyColor: new Color('#eef5e5'),
      }
  }
}
```
并在 `ViewerController` 类中保留半球光引用 `this.hemisphereLight`，在 `stageModel` 时调用：
```ts
const palette = getAtmosphereLightingPalette(descriptor.presentation.atmosphere)
this.hemisphereLight.color.copy(palette.skyColor)
this.hemisphereLight.groundColor.copy(palette.groundColor)
this.hemisphereLight.intensity = palette.intensity
```

- [ ] **Step 4: 重新运行测试确认通过**

运行: `npx vitest run tests/viewer/atmosphere-lighting.test.ts`
预期: PASS

- [ ] **Step 5: 提交更改**

```bash
git add src/viewer/viewer-model-descriptor.ts src/viewer/create-viewer-model-descriptor.ts src/viewer/ViewerController.ts tests/viewer/atmosphere-lighting.test.ts
git commit -m "feat(viewer): add atmosphere-adaptive hemisphere lighting system"
```

---

### Task 2: 50 只动物数据包全量诊断分类矩阵与自动化检测

**Files:**
- Create: `tools/audit-animal-integration.ts`
- Run: 审计全量 50 只动物的 `habitat`, `atmosphere`, `shadow`, `landscapeVerticalOffset`, `initialYawDegrees`

- [ ] **Step 1: 编写审计脚本**

创建 `tools/audit-animal-integration.ts`：
```ts
import { allAnimals } from '../src/content/catalog'

interface AuditReport {
  id: string
  habitat: string
  atmosphere: string
  shadow: string
  vOffset: number
  hOffset: number
  yaw: number
  issues: string[]
}

export function auditAnimals(): AuditReport[] {
  return allAnimals.map((animal) => {
    const issues: string[] = []
    const pres = animal.presentation
    const vOffset = pres.landscapeVerticalOffset ?? 0
    const hOffset = pres.landscapeHorizontalOffset ?? 0
    const yaw = pres.initialYawDegrees
    const shadow = pres.shadow

    if (animal.habitat === 'water' && shadow === 'ground') {
      issues.push('水生生物配置了贴地硬阴影 (ground shadow)')
    }
    if (animal.habitat === 'land' && vOffset > -0.04) {
      issues.push(`陆生动物垂直沉降不足可能悬浮 (vOffset: ${vOffset})`)
    }
    if (Math.abs(yaw) === 90 || yaw === 0) {
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
console.table(reports.filter((r) => r.issues.length > 0))
```

- [ ] **Step 2: 运行审计脚本输出初步问题清单**

运行: `npx tsx tools/audit-animal-integration.ts`
预期: 输出需重点调优的动物列表。

- [ ] **Step 3: 提交审计工具**

```bash
git add tools/audit-animal-integration.ts
git commit -m "chore(tools): add animal integration audit script"
```

---

### Task 3: 水生动物与飞行生物专场优化（深水游弋与高空翱翔）

**Files:**
- Modify: 水生动物数据包：
  - `src/content/animals/ichthyosaur/package.ts`
  - `src/content/animals/plesiosaurus/package.ts`
  - `src/content/animals/megalodon/package.ts`
  - `src/content/animals/mosasaurus/package.ts`
  - `src/content/animals/dunkleosteus/package.ts`
  - `src/content/animals/ammonite/package.ts`
  - `src/content/animals/jaekelopterus/package.ts`
  - `src/content/animals/elasmosaurus/package.ts`
  - `src/content/animals/anomalocaris/package.ts`
  - `src/content/animals/ophthalmosaurus/package.ts`
- Modify: 飞行生物数据包：
  - `src/content/animals/pteranodon/package.ts`
  - `src/content/animals/rhamphorhynchus/package.ts`
  - `src/content/animals/tupandactylus/package.ts`
  - `src/content/animals/meganeura/package.ts`
  - `src/content/animals/quetzalcoatlus/package.ts`
  - `src/content/animals/microraptor/package.ts`
  - `src/content/animals/anhanguera/package.ts`

- [ ] **Step 1: 水生动物去除生硬贴地阴影并优化居中悬浮**

针对 10 种水生动物，将其 `presentation.shadow` 改为 `'none'`，`landscapeVerticalOffset` 调整为 `0.02` 至 `0.06`（水体居中游动），校准 `initialYawDegrees` 为 `-65°` 至 `-75°`。

- [ ] **Step 2: 飞行生物优化高度差与微弱投影**

针对 7 种飞行生物，将其 `landscapeVerticalOffset` 调整为 `0.10` 至 `0.18`（高空翱翔），若保留阴影则将 `shadowOpacity` 降至 `0.18`、`shadowScale` 升至 `1.4`，营造大地与高空距离感。

- [ ] **Step 3: 运行验证**

运行: `npm test && npx tsx tools/audit-animal-integration.ts`
预期: 水生和飞行生物的阴影与悬空异常项清零。

- [ ] **Step 4: 提交水生与飞行优化**

```bash
git add src/content/animals/
git commit -m "feat(content): optimize lighting, shadow, and vertical immersion for aquatic and aerial species"
```

---

### Task 4: 陆生恐龙与史前哺乳动物接地校准（地平线对齐与接触阴影）

**Files:**
- Modify: 陆生动物数据包 `src/content/animals/*/package.ts`（其余 33 种陆生物种）

- [ ] **Step 1: 批量校准地平线沉降（Ground Contact）**

对陆生动物设置：
- `landscapeVerticalOffset: -0.09` 到 `-0.15`（根据体型及背景地表面下移）；
- `portraitVerticalOffset: -0.06` 到 `-0.10`；
- `shadow: 'ground'`，微调 `shadowYOffset`（与足底严格对齐，消除间隙）与 `shadowScale`；
- 校准 `initialYawDegrees` 采用灵动 3/4 偏航视角（如 `-70°`）。

- [ ] **Step 2: 运行内容与参数完整性校验**

运行: `npm run check:content && npm test`
预期: 全部通过。

- [ ] **Step 3: 提交陆生动物接地参数**

```bash
git add src/content/animals/
git commit -m "feat(content): ground land species firmly onto paleoenvironment horizons"
```

---

### Task 5: 严重瑕疵背景与模型的靶向替换

**Files:**
- Modify/Replace: 依据审核筛选出的 C 级模型或背景
- Tools: `tools/update_animal_background.py`
- Modify: `provenance.ts` 与对应资产

- [ ] **Step 1: 识别并核查需替换的 C 级资产**

检查是否有模型出现肢体粘连变形（例如部分批次 27-50 的 AI 瑕疵模型）或背景明显违和（如背景中含有现代树种/建筑），锁定具体目标（例如检查 `smilodon`, `glyptodon`, `anomalocaris`, `compsognathus` 等）。

- [ ] **Step 2: 重新规范化处理或替换高质量资源**

若为背景：使用高质量真实古地质照片通过 `update_animal_background.py` 重新生成 landscape 与 portrait，并同步更新 SHA-256。
若为模型：按 `ANIMAL_AUTHORING_GUIDE.md` 标准化流程清洗并更新。

- [ ] **Step 3: 验证资产门槛与一致性**

运行: `npm run check:content`
预期: 所有资产 SHA-256 与字节数完全匹配。

- [ ] **Step 4: 提交资产靶向修复**

```bash
git add src/content/animals/
git commit -m "fix(assets): replace flawed models/backgrounds with verified high-fidelity assets"
```

---

### Task 6: 全面回归与视觉验收

**Files:**
- Run: `npm run test`
- Run: `npm run lint`
- Run: `npm run check:content`

- [ ] **Step 1: 执行自动化测试套件**

运行: `npm test`
预期: 所有单元测试 PASS。

- [ ] **Step 2: 执行代码风格检查**

运行: `npm run lint`
预期: 无 lint 报错。

- [ ] **Step 3: 执行静态内容完整性校验**

运行: `npm run check:content`
预期: 50 只动物数据包、多语言、音频及资产哈希校验 100% 通过。

- [ ] **Step 4: 启动服务进行代表性动物视觉抽检**

抽检样本：
1. 陆生代表：`tyrannosaurus-rex`（霸王龙）、`stegosaurus`（剑龙）、`mammoth`（猛犸象）—— 确认双足/四足扎实站立在背景地表，阴影紧贴足底。
2. 水生代表：`mosasaurus`（沧龙）、`plesiosaurus`（蛇颈龙）、`dunkleosteus`（邓氏鱼）—— 确认呈现水下深蓝调光照，无生硬贴地黑影，如在深海游动。
3. 飞行代表：`pteranodon`（无齿翼龙）、`quetzalcoatlus`（风神翼龙）—— 确认展翅翱翔于天空，阴影虚化自然。
