# 陆地动物环境地面融合与防悬空系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 回滚剑齿虎模型微缩地台试验方案；通过 3D Viewer 视口地平线下沉对齐与拟真双层落脚接触阴影系统，让所有陆地动物自然稳稳踏在背景地面上，同时保持水生和飞行动物的自由环境体验。

**Architecture:** 
1. 还原剑齿虎原生 GLB 资产、溯源与预览图，清理试验脚本；
2. 在 `ViewerModelDescriptor` 与 `createViewerModelDescriptor` 中注入 `habitat` 语义，对 `habitat === 'land'` 自动注入透视接地补偿下沉偏移（横屏 `+0.14`，竖屏 `+0.10`），使四爪落脚平面与背景插画地平线精准贴合；
3. 将 `makeContactShadow` 升级为双层复合落影（内层深核触地 AO + 外层广域柔焦环境衰减阴影）。

**Tech Stack:** Three.js, TypeScript, Vitest, Meshopt glTF Transform.

## Global Constraints

- 不修改任何动物原生 `.glb` 模型网格，零静态资源体积负担。
- `npm run check:content`、`npm run typecheck` 与 `npm run lint` 必须 0 错误 0 警告通过。
- 保证全部 50 种史前生物的呈现体验均不受负面影响。

---

### Task 1: 回滚剑齿虎（Smilodon）模型地台试验资产

**Files:**
- Modify: `src/content/animals/smilodon/model/model.glb`
- Modify: `src/content/animals/smilodon/provenance.ts`
- Modify: `src/content/credits.generated.ts`
- Modify: `THIRD_PARTY_NOTICES.md`
- Delete: `tools/create_smilodon_diorama.py`
- Delete: `tests/viewer/smilodon-diorama-spec.test.ts`
- Modify: `src/content/animals/smilodon/images/model-preview.manifest.json`
- Modify: `src/content/animals/smilodon/images/*.webp`

- [ ] **Step 1: 从 git 恢复剑齿虎原始模型与溯源文件**

```bash
git checkout eb134f4~1 -- \
  src/content/animals/smilodon/model/model.glb \
  src/content/animals/smilodon/provenance.ts \
  src/content/credits.generated.ts \
  THIRD_PARTY_NOTICES.md
rm -f tools/create_smilodon_diorama.py tests/viewer/smilodon-diorama-spec.test.ts
```

- [ ] **Step 2: 重新烘焙生成剑齿虎 6 视角纯净模型预览图**

```bash
npx tsx scripts/render-model-previews.ts --target=production smilodon
```

- [ ] **Step 3: 运行内容完整性审计**

```bash
npm run check:content
```
Expected: All 50 animals passed integration audit with 0 issues.

- [ ] **Step 4: 提交回滚**

```bash
git add src/content/ THIRD_PARTY_NOTICES.md tools/ tests/viewer/
git commit -m "chore(content): cleanly revert smilodon diorama plinth pilot"
```

---

### Task 2: 视口地平线下沉对齐与 Habitat 语义注入

**Files:**
- Modify: `src/viewer/viewer-model-descriptor.ts`
- Modify: `src/viewer/create-viewer-model-descriptor.ts`
- Test: `tests/viewer/land-animal-grounding.test.ts`

- [ ] **Step 1: 编写测试验证陆地动物默认下沉偏移**

创建 `tests/viewer/land-animal-grounding.test.ts`：
```ts
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
        },
      },
      '剑龙',
      '/model.glb',
    )
    expect(descriptor.presentation.verticalOffset?.landscape).toBe(0.08)
    expect(descriptor.presentation.verticalOffset?.portrait).toBe(0.05)
  })
})
```

- [ ] **Step 2: 运行测试确保其失败**

```bash
npx vitest run tests/viewer/land-animal-grounding.test.ts
```
Expected: FAIL (habitat property not yet used to set default verticalOffset).

- [ ] **Step 3: 更新 `create-viewer-model-descriptor.ts` 与 `viewer-model-descriptor.ts`**

在 `createViewerModelDescriptor` 中：
```ts
interface ViewerAnimalSource {
  readonly animation?: AnimalAnimation
  readonly atmosphere?: string
  readonly habitat?: 'land' | 'water' | 'air'
  readonly id: string
  readonly presentation: AnimalPresentation
}
```
计算默认 `verticalOffset`：
```ts
      verticalOffset: {
        landscape:
          animal.presentation.landscapeVerticalOffset ??
          (animal.habitat === 'land' ? 0.14 : 0),
        portrait:
          animal.presentation.portraitVerticalOffset ??
          (animal.habitat === 'land' ? 0.10 : 0),
      },
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run tests/viewer/land-animal-grounding.test.ts
```
Expected: PASS.

- [ ] **Step 5: 提交更改**

```bash
git add src/viewer/ tests/viewer/land-animal-grounding.test.ts
git commit -m "feat(viewer): apply perspective ground alignment offset for land animals"
```

---

### Task 3: 拟真双层触地接触阴影系统

**Files:**
- Modify: `src/viewer/ViewerController.ts:450-496`
- Test: `tests/viewer/contact-shadow.test.ts`

- [ ] **Step 1: 编写测试验证复合接触阴影生成**

创建 `tests/viewer/contact-shadow.test.ts`：
```ts
import { describe, expect, it } from 'vitest'
import { Group, Mesh } from 'three'
import { makeContactShadow } from '../../src/viewer/ViewerController'

describe('makeContactShadow', () => {
  it('creates a compound group containing core AO and ambient diffuse shadow layers', () => {
    const shadow = makeContactShadow(0.6, { x: 2, y: 1, z: 3 }, 0.8)
    expect(shadow).toBeInstanceOf(Group)
    expect(shadow.name).toBe('contact-shadow-compound')

    const coreAO = shadow.getObjectByName('contact-shadow-core-ao') as Mesh
    const diffuse = shadow.getObjectByName('contact-shadow-diffuse') as Mesh
    expect(coreAO).toBeDefined()
    expect(diffuse).toBeDefined()
  })
})
```

- [ ] **Step 2: 运行测试确保其失败**

```bash
npx vitest run tests/viewer/contact-shadow.test.ts
```
Expected: FAIL.

- [ ] **Step 3: 重构 `makeContactShadow` 支持双层阴影群组**

在 `src/viewer/ViewerController.ts` 中：
实现内层深核接触 AO（`contact-shadow-core-ao`）与外层环境柔焦衰减（`contact-shadow-diffuse`），封装在 `Group` 中返回。

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run tests/viewer/contact-shadow.test.ts
```
Expected: PASS.

- [ ] **Step 5: 提交更改**

```bash
git add src/viewer/ViewerController.ts tests/viewer/contact-shadow.test.ts
git commit -m "feat(viewer): implement dual-layer ground contact shadow system"
```

---

### Task 4: 全量质量门禁与生产验证

**Files:** 全局

- [ ] **Step 1: 运行 `npm run check:content` 验证 50 种生物集成**
- [ ] **Step 2: 运行 `npm run typecheck` 验证类型安全**
- [ ] **Step 3: 运行 `npm run lint` 验证代码规范**
- [ ] **Step 4: 运行 `npx vitest run tests/audio/ tests/viewer/` 验证全部核心测试**
- [ ] **Step 5: 运行 `npm run build` 和 `npm run build:cloudflare` 确保构建成功**
- [ ] **Step 6: 提交并推送到远端**
