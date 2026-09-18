# 史前动物博物馆：生存年代排序与时间轴展示设计规范

**日期:** 2026-09-18  
**作者:** Antigravity  
**状态:** Approved  
**目标:** 为全馆 50 种史前动物建立结构化地质年代元数据（`mya` 与时代徽章），在展品抽屉中提供“精选推荐”与“生命时间轴”排序切换器，并在卡片与主展示舞台上集成地质纪年代徽章展示。

---

## 1. 现状与需求分析

- **现状**：
  - 展品列表顺序（`mainCollection`）目前为固定顺序，兼顾代表性与种类穿插，但无法反映生命从寒武纪到更新世的演化历程。
  - 年代信息（`facts.period`）目前仅作为非结构化长文本（如“上新世晚期至更新世末（约 250 万年前至约 1.3 万年前，属级范围）”），仅在家长手册深层展示。
- **需求**：
  1. 提供直观的排序切换（精选推荐 vs 地质年代时间轴从古至今）；
  2. 展品卡片与主展台增强年代感知（显性地质纪与百万年标识徽章）；
  3. 保持与多语言（中/英）及无障碍体系的深度融合。

---

## 2. 年代数据模型与结构化映射 (Chronology Metadata)

### 2.1 结构定义
在 `src/content/types.ts` 或独立年代映射表（`src/content/chronology.ts`）中定义：

```ts
export interface AnimalChronology {
  /** 距今百万年数值（用于排序，取中位值或繁盛期） */
  readonly mya: number
  /** 地质纪分类 */
  readonly periodId:
    | 'cambrian'
    | 'devonian'
    | 'carboniferous'
    | 'permian'
    | 'triassic'
    | 'jurassic'
    | 'cretaceous'
    | 'paleogene'
    | 'neogene'
    | 'quaternary'
  /** 简短年代标签（用于徽章） */
  readonly badge: {
    readonly 'zh-CN': string
    readonly en: string
  }
}
```

### 2.2 50 种展品年代基准表 (Chronological Order Mappings)
按距今从远到近（$mya$ 降序）：
1. **寒武纪 (Cambrian, ~508 Ma)**: `anomalocaris` (508)
2. **泥盆纪 (Devonian, ~410~370 Ma)**: `jaekelopterus` (405), `dunkleosteus` (370), `ammonite` (360)
3. **石炭纪 (Carboniferous, ~300 Ma)**: `meganeura` (300)
4. **二叠纪 (Permian, ~280 Ma)**: `dimetrodon` (280)
5. **三叠纪 (Triassic, ~231~210 Ma)**: `herrerasaurus` (231), `ichthyosaur` (215), `plesiosaurus` (205)
6. **侏罗纪 (Jurassic, ~193~145 Ma)**:
   `dilophosaurus` (193), `ophthalmosaurus` (160), `stegosaurus` (155), `allosaurus` (152), `ceratosaurus` (150), `diplodocus` (150), `brachiosaurus` (150), `rhamphorhynchus` (150), `compsognathus` (150), `apatosaurus` (148)
7. **白垩纪 (Cretaceous, ~145~66 Ma)**:
   `baryonyx` (125), `microraptor` (120), `tupandactylus` (115), `sauropelta` (110), `acrocanthosaurus` (110), `anhanguera` (110), `deinonychus` (110), `spinosaurus` (98), `carcharodontosaurus` (97), `argentinosaurus` (95), `gigantoraptor` (85), `mosasaurus` (80), `elasmosaurus` (80), `maiasaura` (78), `corythosaurus` (76), `parasaurolophus` (75), `velociraptor` (73), `edmontosaurus` (70), `albertosaurus` (70), `carnotaurus` (70), `pachycephalosaurus` (68), `triceratops` (67), `tyrannosaurus-rex` (67), `pteranodon` (67), `quetzalcoatlus` (67), `ankylosaurus` (67)
8. **新近纪 (Neogene, ~15 Ma)**: `megalodon` (15)
9. **第四纪更新世与全新世 (Quaternary, ~2.5~0.01 Ma)**:
   `smilodon` (1.8), `glyptodon` (1.5), `megaloceros` (0.4), `mammoth` (0.05)

---

## 3. 展品抽屉 UI 交互设计 (`AnimalCollectionSheet.tsx`)

### 3.1 排序切换器 (Sorting Segmented Control)
- 放置于抽屉 Header 标题简介下方：
  - 选项 A：**精选推荐**（默认，原 `mainCollection` 展品排列）；
  - 选项 B：**生命时间轴 ⏳**（按 $mya$ 从远古到近代排序，或支持正反序切换按钮）。
- 样式遵循博物馆现有童趣温润的圆角胶囊风格（Fredoka/Nunito 字体，支持键盘 Tab 导航与无障碍语义）。

### 3.2 卡片年代徽章展示 (`collection-card`)
- 扩展 `CollectionAnimal` 接口支持 `chronologyBadge: string`；
- 在卡片名称与分类下方渲染轻量徽章：
  - 例如：`<span className="collection-card__period">{animal.chronologyBadge}</span>`；
  - 视觉效果：淡色半透明背景胶囊，清晰展示如 `寒武纪 · 5亿年前`、`晚白垩世 · 6700万年前`、`更新世 · 180万年前`。

---

## 4. 主展示舞台（Viewer Stage）年代徽章增强

- 在 `ResponsiveAnimalTitle` 标题区域添加副标签：
  - 显示地质时代胶囊徽章（如 `[第四纪 · 更新世]`）；
  - 让用户在 3D 舞台旋转模型时，直观获知动物在生命演化史中的时间坐标。

---

## 5. 多语言与国际化 (i18n)

- 中文（`zh-CN`）：
  - `collection.sortFeatured`: `"精选推荐"`
  - `collection.sortTimeline`: `"生命时间轴"`
  - `collection.sortOldestFirst`: `"从远古到近代"`
  - `collection.sortNewestFirst`: `"由近及远"`
- 英文（`en`）：
  - `collection.sortFeatured`: `"Featured"`
  - `collection.sortTimeline`: `"Timeline"`
  - `collection.sortOldestFirst`: `"Oldest First"`
  - `collection.sortNewestFirst`: `"Newest First"`

---

## 6. 测试与验证计划

1. **元数据完整性测试**：确保 50 种已发布动物全部拥有有效的 `mya` 与双语徽章，无断代或遗漏；
2. **排序稳定性测试**：验证在精选与时间轴模式切换下，选中态定位与当前激活展品（`currentAnimalId`）保持精准对应；
3. **UI 自动化与回归测试**：运行 `npm run test` 与 `npm run check:content`，验证所有功能与类型安全。
