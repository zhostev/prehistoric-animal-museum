# 史前动物博物馆：动物鸣叫与声学交互系统设计规范

**日期:** 2026-09-18  
**作者:** Antigravity  
**状态:** Approved  
**目标:** 基于 Web Audio API 物理声学合成引擎，为全馆 50 种史前动物构建零延迟、免下载、活体拟真的古生物鸣叫声音系统，支持控制栏专属按钮与点击 3D 展品双触发交互，并实现与语音解说的智能音量避让（Ducking）。

---

## 1. 现状与设计目标

- **现状**：目前博物馆仅具备女声科普语音介绍（`NarrationController` 播放 MP3 讲解），展品缺乏动物自身的叫声，用户在观赏凶猛霸王龙、巨型剑齿虎或中空头冠副栉龙时无法感知生命声学特征。
- **设计目标**：
  1. **零延迟与免加载**：利用现代 Web Audio API 构建生理声学合成器，无需网络加载额外音频文件，瞬间响应；
  2. **古生物声学拟真**：根据古生物学发声生理学（声带/气囊、颅腔共鸣管、肺活量），划分 8 大特征发声家族；
  3. **双重交互触发**：
     - 主界面专属「听叫声 🔊」交互按钮；
     - 3D 展台轻触/点击动物模型本体直接触发鸣叫；
  4. **讲解音频智能避让（Audio Ducking）**：叫声响起时，语音解说音量平滑下潜 70% 或暂停，叫声完毕后平滑恢复。

---

## 2. 古生物物理声学合成器架构 (`src/audio/vocal-synthesizer.ts`)

### 2.1 声学生理原型家族 (Acoustic Archetypes)
为 50 种动物分类映射特征发生器：
1. **`apex_theropod`（巨型兽脚类）**：如霸王龙、异特龙、鲨齿龙、棘龙。
   - 声学特征：低频扫频喉音（50Hz~220Hz）+ 双共鸣峰失真滤波 + 类似湾鳄与食火鸡的次声喉鸣。
2. **`sabertooth_feline`（古猫科）**：如剑齿虎。
   - 声学特征：调频锯齿波低吼 + 齿隙高频风噪混响（Feline Snarl/Roar）。
3. **`hadrosaur_crest`（鸭嘴龙类）**：如副栉龙、冠龙。
   - 声学特征：头冠长管道声学驻波号鸣（类似巨型阿尔卑斯长号/古号角，纯净泛音共鸣）。
4. **`sauropod_infrasound`（蜥脚类）**：如腕龙、梁龙、阿根廷龙。
   - 声学特征：极低频胸腔共振次声波（30Hz~120Hz）+ 缓慢隆隆长鸣。
5. **`proboscidean`（长鼻目）**：如猛犸象。
   - 声学特征：象鼻铜管号音扫频（200Hz~800Hz 强谐波）。
6. **`pterosaur_avian`（翼龙与小型兽禽）**：如无齿翼龙、风神翼龙、小盗龙。
   - 声学特征：爬行动物摩擦与猛禽高频尖啸（800Hz~3500Hz 带通频移）。
7. **`marine_behemoth`（海生爬行与巨鱼类）**：如巨齿鲨、沧龙、蛇颈龙、邓氏鱼。
   - 声学特征：水下低通滤波低频水声（Water Ambience）与鲸豚式脉冲深鸣。
8. **`armored_herbivore`（装甲植食类）**：如三角龙、甲龙、剑龙。
   - 声学特征：低沉鼻腔喷气鼻鸣与喉部闷吼。
9. **`arthropod_drone`（古节肢类）**：如巨脉蜻蜓、奇虾、耶克尔鲎。
   - 声学特征：快速振翅轰鸣（180Hz 方波调制）与几丁质甲壳摩擦。

### 2.2 微随机扰动（Organic Jitter）
每次调用发声算法时，在基础基频（Fundamental Frequency）、包络侵袭时间（Attack Time）、颤音深度（Vibrato Depth）注入 $\pm 3\% \sim 5\%$ 的随机微扰，保证无论连续点击多少次，声音都鲜活生动、绝不机械重复。

---

## 3. 发声控制器与音频避让 (`src/audio/vocal-controller.ts`)

```ts
export type VocalPlaybackState = 'idle' | 'playing'

export interface VocalSnapshot {
  readonly state: VocalPlaybackState
  readonly currentAnimalId: string | null
}

export class VocalController {
  // 订阅/发布机制，与 React useSyncExternalStore 完美契合
  subscribe(listener: () => void): () => void
  getSnapshot(): VocalSnapshot
  // 播放指定动物叫声，并在播放期间调用 narrationController 的 ducking 钩子
  play(animalId: string, narration?: NarrationController): Promise<void>
  stop(): void
}
```

---

## 4. UI 呈现与交互设计

### 4.1 控制栏新增「听叫声」按钮
- 位于 `story-actions` 中「听讲解」按钮左侧；
- 视觉风格：童趣胶囊药丸按钮（圆润舒适、高对比）；
- 图标：动感发声喇叭/声波图标，播放中伴有轻柔脉冲扩散波纹动画；
- 双语：中文「听叫声」、英文「Call」。

### 4.2 3D 展台点击交互
- 在 Three.js 视图中，当用户单击（Click/Tap，非旋转拖拽）3D 动物模型时，立即触发当前动物叫声；
- 辅以轻微的触感与视听反馈。

---

## 5. 多语言与国际化支持 (i18n)

- `zh-CN`:
  - `collection.roar`: `'听叫声'`
  - `collection.roaring`: `'鸣叫中…'`
  - `collection.roarLabel`: `(animal: string) => `听${animal}的叫声``
- `en`:
  - `collection.roar`: `'Call'`
  - `collection.roaring`: `'Calling…'`
  - `collection.roarLabel`: `(animal: string) => `Listen to ${animal}'s call``

---

## 6. 测试与验证计划

1. **合成器算法覆盖测试**：编写 `tests/audio/vocal-synthesizer.test.ts`，验证全部 50 种动物均有有效音色映射，并在 Mock Web Audio 环境下能正常构建节点链路；
2. **避让协调测试**：验证在讲解播放中触发鸣叫时，解说音量降噪回调正常触发；
3. **全量构建与类型验证**：执行 `npm run typecheck`、`npm run lint` 和 `npm run check:content`。
