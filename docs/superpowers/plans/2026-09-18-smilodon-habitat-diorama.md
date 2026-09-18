# 剑齿虎生态微地台（Diorama）一体化模型实施计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 Blender 4.5 与工程规范，为剑齿虎（`smilodon`）构建更新世冻土岩石微地台（Diorama Plinth），导出高保真一体化 GLB 模型并完成渲染舞台展示集成与验证。

**Architecture:**
1. 编写独立可重复运行的 Blender 4.5 无头脚本 `tools/create_smilodon_diorama.py`，根据剑齿虎四爪落点生成自然剥离冻土岩石微地台，烘焙顶点/贴图 AO 并保持现有 8 秒 Idle 动画绝对隔离；
2. 产出符合馆藏标准的生产级 `model.glb`（面数 ≤ 60,000，体积 ≤ 2.5MB），替换现有资产；
3. 更新 `package.ts` 呈现参数及 `provenance.ts` 溯源校验哈希；
4. 运行 `render-model-previews.ts` 重新生成 6 视角 WebP 标本预览图，并通过 `npm run check:content` 与全量测试。

**Tech Stack:** Blender 4.5.12 LTS Python API, Three.js, TypeScript, Vite, Vitest, Node.js

## Global Constraints

- GLB 模型必须单文件自包含，总三角面数 $\le 100,000$（目标 $\le 60,000$），文件大小 $\le 12\text{MB}$（目标 $\le 2.5\text{MB}$）。
- 必须完整保留现有的 8.0 秒（192 帧 @ 24fps）线性循环 `Idle` 待机骨骼动画，地台网格绝对静止（骨骼权重为 0）。
- 地台底部几何收平归零（$y=0$），四足着地平稳，零悬空、零穿模。
- 每次资产或代码变更均需通过 `npm run check:content` 与 `npm run test`，保证无类型错误、无内容校验报错。

---

### Task 1: 编写 Blender 4.5 地台生成与装配工具脚本

**Files:**
- Create: `tools/create_smilodon_diorama.py`
- Test: `tests/viewer/smilodon-diorama-spec.test.ts`

**Interfaces:**
- Consumes: `src/content/animals/smilodon/model/model.glb`
- Produces: CLI script `tools/create_smilodon_diorama.py --input <glb> --output <glb>`

- [ ] **Step 1: 编写模型与地台规格检查测试**

创建 `tests/viewer/smilodon-diorama-spec.test.ts`，验证输出的 GLB 包含地台网格、动画完整性且面数在预算范围内：
```ts
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
```

- [ ] **Step 2: 编写 Blender 4.5 地台合成与装配脚本**

创建 `tools/create_smilodon_diorama.py`：
- 读取输入的剑齿虎 GLB；
- 计算剑齿虎网格脚掌边界与落脚最低点；
- 几何生成：以剑齿虎脚底为中心生成自然切片形态的微型岩石冻土地台（长 ~2.6m，宽 ~1.8m，厚 ~0.2m），顶面微起伏贴合四爪，底面平整置于 $z=0$；
- 材质赋能：创建 PBR 地貌材质（寒带冻土灰褐冷色调），给地台网格赋予独立材质；
- 动画隔离：保留原 Armature 与 Action，地台作为独立物体或不受骨骼顶点组影响；
- 导出包含 glTF PBR 贴图的高质量 GLB。

- [ ] **Step 3: 运行脚本生成候选模型**

运行：
```bash
/home/idea/code/.runtime/blender/blender-4.5.12-linux-x64/blender --background --factory-startup --python tools/create_smilodon_diorama.py -- --input src/content/animals/smilodon/model/model.glb --output /tmp/smilodon_diorama_test.glb
```
预期：生成 `/tmp/smilodon_diorama_test.glb`，控制台打印出网格顶点数、三角面数与各物体层级。

---

### Task 2: 替换生产级资产并更新展品配置与溯源记录

**Files:**
- Modify: `src/content/animals/smilodon/model/model.glb`
- Modify: `src/content/animals/smilodon/package.ts`
- Modify: `src/content/animals/smilodon/provenance.ts`

- [ ] **Step 1: 部署一体化 GLB 至生产路径**

将 `/tmp/smilodon_diorama_test.glb` 复制并替换 `src/content/animals/smilodon/model/model.glb`。

- [ ] **Step 2: 计算新模型 SHA-256 与文件大小**

运行：
```bash
sha256sum src/content/animals/smilodon/model/model.glb
wc -c src/content/animals/smilodon/model/model.glb
```

- [ ] **Step 3: 更新 `provenance.ts` 与 `package.ts`**

在 `src/content/animals/smilodon/provenance.ts` 中更新 `model/model.glb` 的 `runtime.sha256`、`runtime.bytes` 以及修改记录（追加地台制作与融合记录）。
在 `src/content/animals/smilodon/package.ts` 中微调 `presentation`（适当微调 `landscapeVerticalOffset` 与 `safeAreaPadding` 以适应地台视觉平衡）。

---

### Task 3: 重新生成多角度预览图并执行全量验证

**Files:**
- Modify: `src/content/animals/smilodon/images/model-preview.manifest.json`
- Modify: `src/content/animals/smilodon/images/preview-*.webp`

- [ ] **Step 1: 运行预览图批量渲染脚本**

运行：
```bash
tsx scripts/render-model-previews.ts --target=production --animal=smilodon
```
预期：更新 6 张多角度 WebP 预览图及 manifest 校验哈希。

- [ ] **Step 2: 运行内容完整性与系统审计检查**

运行：
```bash
npm run check:content
```
预期：全部 50 种展品校验 PASS，无哈希或尺寸漂移。

- [ ] **Step 3: 运行全量单元测试与 Lint 检查**

运行：
```bash
npm run test
npm run lint
```
预期：所有单测与 Lint 0 warning 0 error 通过。

- [ ] **Step 4: 启动本地 Dev 预览与效果确认**

运行 Playwright 或本地 Vite 快速验证在带背景模式下微缩地台与 2D 背景的融合效果。
