# 史前动物生存年代排序与时间轴展示实施计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 50 种史前生物结构化年代数据库，在展品抽屉中实现“精选推荐”与“生命时间轴”排序切换器，并在展品卡片与主展台呈现地质时代徽章。

**Architecture:**
1. 在 `src/content/chronology.ts` 中建立全量 50 只展品的年代基准数据（`mya` 百万年、地质纪与双语标签）与排序工具函数；
2. 扩展 i18n 语言包提供排序与时间轴相关文案；
3. 在 `AnimalCollectionSheet.tsx` 中增加排序分段控制器，支持卡片按年代重排并展示时代徽章；
4. 在主展台 `ResponsiveAnimalTitle.tsx` 或展台标题区域集成地质纪徽章；
5. 编写单元测试并执行类型与视觉验证。

**Tech Stack:** React 19, TypeScript, Vitest, CSS3

## Global Constraints

- 50 种已发布动物必须 100% 覆盖年代数据，无未定义条目；
- 排序切换必须在客户端瞬时完成，不改变默认推荐的 `mainCollection` 数据源；
- 保持中英文双语一致性与键盘 Tab 无障碍（Accessibility）；
- 每次修改后通过 `npm run test`、`npm run typecheck` 与 `npm run lint`。

---

### Task 1: 建立全量 50 种动物年代数据模型与排序函数

**Files:**
- Create: `src/content/chronology.ts`
- Create: `tests/content/chronology.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface AnimalChronology {
    readonly mya: number
    readonly periodId: string
    readonly badge: { readonly 'zh-CN': string; readonly en: string }
  }
  export function getAnimalChronology(animalId: string): AnimalChronology
  export function sortAnimalsByTimeline<T extends { id: string }>(
    animals: readonly T[],
    direction?: 'oldest-first' | 'newest-first'
  ): T[]
  ```

- [ ] **Step 1: 编写年代数据库单元测试**

创建 `tests/content/chronology.test.ts`：
```ts
import { describe, expect, it } from 'vitest'
import { mainCollection } from '../../src/content/collections/main'
import { getAnimalChronology, sortAnimalsByTimeline } from '../../src/content/chronology'

describe('Animal chronology metadata', () => {
  it('covers all 50 animals in mainCollection with valid mya and badges', () => {
    for (const id of mainCollection.animalIds) {
      const entry = getAnimalChronology(id)
      expect(entry, `missing entry for ${id}`).toBeDefined()
      expect(entry.mya).toBeGreaterThan(0)
      expect(entry.badge['zh-CN']).toBeTruthy()
      expect(entry.badge.en).toBeTruthy()
    }
  })

  it('correctly sorts from oldest (Cambrian Anomalocaris) to newest (Pleistocene Mammoth)', () => {
    const sorted = sortAnimalsByTimeline(mainCollection.animalIds.map((id) => ({ id })))
    expect(sorted[0].id).toBe('anomalocaris')
    expect(sorted.at(-1)?.id).toMatch(/mammoth|megaloceros|glyptodon|smilodon/)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

运行：`npx vitest run tests/content/chronology.test.ts`
预期：FAIL（文件不存在）。

- [ ] **Step 3: 实现 `src/content/chronology.ts`**

编写包含 50 种动物年代数据（寒武纪至更新世）的常量映射表与排序方法。

- [ ] **Step 4: 运行测试验证通过**

运行：`npx vitest run tests/content/chronology.test.ts`
预期：PASS。

---

### Task 2: 扩展 i18n 语言包与抽屉卡片数据模型

**Files:**
- Modify: `src/i18n/locales/zh-CN.ts`
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/components/AnimalCollectionSheet.tsx`

- [ ] **Step 1: 在中英语言包中新增排序文案**

在 `zh-CN.ts` 与 `en.ts` 的 `collection` 命名空间下增加：
`sortFeatured`（精选推荐 / Featured）、`sortTimeline`（生命时间轴 / Timeline）、`timelineOldest`（从古至今 / Oldest First）等。

- [ ] **Step 2: 扩展 `CollectionAnimal` 接口支持 `chronologyBadge`**

在 `AnimalCollectionSheet.tsx` 中为 `CollectionAnimal` 增加 `chronologyBadge?: string` 与 `mya?: number`。

- [ ] **Step 3: 实现抽屉顶部排序切换器组件与动态重排**

在 `AnimalCollectionSheet.tsx` 中增加 `sortMode` 状态（`'featured' | 'timeline'`），根据当前选中的排序模式重排列表，并在每个卡片上渲染年代徽章。

- [ ] **Step 4: 添加样式支持**

在 `src/styles/` 或 `src/index.css` 中为排序切换胶囊与卡片年代徽章添加优雅的圆角与微质感样式。

---

### Task 3: 主展示舞台（Viewer Stage）年代标识与全量集成测试

**Files:**
- Modify: `src/components/ResponsiveAnimalTitle.tsx` 或 `src/App.tsx`
- Test: `tests/collection-sheet.test.tsx` (或者新编 UI 测试)

- [ ] **Step 1: 在主展台标题区显示年代徽章**

在 3D 展台主标题区域展示当前动物的地质纪时代徽章（如 `[第四纪 · 更新世]`），点击可直达年代信息。

- [ ] **Step 2: 执行全套验证**

运行：
```bash
npm run typecheck
npm run lint
npm run check:content
npx vitest run tests/content/chronology.test.ts
```

- [ ] **Step 3: 启动 dev 服务验证交互手感**

验证在抽屉中切换“精选推荐”与“生命时间轴”时的顺滑度、卡片定位及主展台年代徽章展示。
