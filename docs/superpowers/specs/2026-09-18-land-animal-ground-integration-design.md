# 史前动物博物馆：陆地动物环境地面融合与防悬空设计规范

**日期:** 2026-09-18  
**作者:** Antigravity  
**状态:** Draft for Review  
**目标:** 解决陆地动物在 3D 展台前“浮在空中”的视觉脱节问题。回滚剑齿虎单个模型硬编码地台的试验方案；通过 3D Viewer 视口地平线下沉对齐与双层落脚接触阴影系统，让所有陆地动物自然稳稳“踩”在背景环境地面上，同时保持水生动物自由遨游与飞行动物展翅翱翔的原生表现。

---

## 1. 背景与回滚决策

### 1.1 剑齿虎地台试验方案总结与回滚
- **试验方案**：在单个动物（剑齿虎）模型内部通过 Blender 烘焙微缩生态切片地台（Diorama Plinth）。
- **结论与痛点**：
  1. 侵入动物原生 GLB 资产，每种动物需定制网格与权重绑定，难以跨全馆 50 种生物通用扩展；
  2. 3D 视角自由旋转时，悬空的地台切片在 2D 背景插画前产生如同“浮空岛/蛋糕切片”的违和感；
  3. 决定彻底**终止并回滚**该方案，将剑齿虎模型、模型预览图、溯源记录还原至纯净版本。

### 1.2 陆地动物空中悬浮的根本原因
1. **视口机械居中**：当前 `computeCameraFit` 与 `camera-fit.ts` 将动物 3D 包围盒几何中心严格居中在视口中央。对于陆地站立动物，其足底平面（$y=0$）因此悬浮在视口高度 50%~60% 的半空中。
2. **插画地平线位置**：背景插画（`landscape.webp` / `portrait.webp`）的地表/草地/岩面位于视口下方 20%~30% 区域。
3. **阴影表现力单一**：原有的单层纯圆接触阴影半径固定且缺乏触地暗核（Contact AO），在远离背景地面时视觉无法形成锚定。

---

## 2. 核心架构设计

### 2.1 基于 生态习性（`habitat`）的差异化视口排版

在 `src/viewer/create-viewer-model-descriptor.ts` 中引入 `habitat` 语义（来自动物元数据 `habitat: 'land' | 'water' | 'air'`）：

1. **陆地动物（`habitat === 'land'`）**：
   - 自动应用**地面锚定合成下沉偏移（Grounding Viewport Offset）**：
     - 横屏（Landscape）：`verticalOffset` 缺省设为 `+0.14`（向下沉降视口 14%）；
     - 竖屏（Portrait）：`verticalOffset` 缺省设为 `+0.10`（向下沉降视口 10%）；
     - 若动物配置中显式指定了个性化 `landscapeVerticalOffset`，则以显式配置为准。
   - **视觉效果**：动物足底落脚线（$y=0$）精准落位于背景插画的地面线（屏幕下部 20%~28% 范围），动物从视觉上稳稳踏在插画的森林地表、戈壁碎石或雪地上。

2. **水生动物（`habitat === 'water'`）**：
   - 保持自由居中（`verticalOffset = 0`），配合水下粒子与水波光效，呈现三维水体中自由潜游的失重质感。

3. **飞行动物（`habitat === 'air'`）**：
   - 保持中心或上浮排版，呈现翱翔天际的宽阔空间感。

---

### 2.2 拟真双层触地接触阴影系统（Dual-Layer Ground Contact Shadow）

重构 `src/viewer/ViewerController.ts` 中的 `makeContactShadow`，由单层模糊圆斑升级为高拟真的复合落影群组：

1. **核心触地暗核层（Core Contact AO）**：
   - 半径：为动物包围盒投影半径的 `45%`，高浓度不透明度（`0.75 ~ 0.85`）；
   - 纹理：极高衰减率（Sharp inner falloff），表现四爪/蹄足落点与地面的紧密接触环境光遮蔽；
   - 深度次序：贴紧地表 $y=0.001$。

2. **广域柔焦环境落影（Ambient Ground Diffusion）**：
   - 半径：匹配动物长宽轮廓的椭圆扩散投影（`scale * 1.15`）；
   - 纹理：平滑羽化高斯衰减，不透明度 `0.35 ~ 0.45`；
   - 随动物生态氛围（`atmosphere`）自动调谐微色调（如森林略偏深绿黑、沙漠略偏暖棕黑），与 2D 背景自然消融。

---

### 2.3 剑齿虎（Smilodon）资产完全干净回滚

1. 还原 `src/content/animals/smilodon/model/model.glb` 至纯净原始模型（文件大小 1,418,864 字节，SHA-256 `6e5ec85a49...`）；
2. 还原 `src/content/animals/smilodon/provenance.ts`、`src/content/credits.generated.ts` 及 `THIRD_PARTY_NOTICES.md`；
3. 重新烘焙并验证 6 角度 WebP 预览图（`scripts/render-model-previews.ts --target=production smilodon`）；
4. 清理 `tools/create_smilodon_diorama.py` 及测试文件。

---

## 3. 验证方案与成功标准

1. **视觉验证**：
   - 霸王龙、猛犸象、剑齿虎、剑龙、三角龙等陆地生物在横屏与竖屏下均自然踏在背景地面上，彻底告别“空中悬浮”；
   - 沧龙、蛇颈龙、巨齿鲨等水生生物保持水下三维游弋感；
   - 翼手龙、风神翼龙等飞行动物保持天际翱翔感；
   - 阴影在转动视角时表现立体真实。
2. **自动化门禁**：
   - `npm run check:content`：50 种动物内容校验与集成审计通过；
   - `npm run typecheck` & `npm run lint`：0 错误 0 警告；
   - `npm run test`：全量测试套件通过；
   - `npm run build` & `npm run build:cloudflare`：生产及 Cloudflare 打包顺利成功。
