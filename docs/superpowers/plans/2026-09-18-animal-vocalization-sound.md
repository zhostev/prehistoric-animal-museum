# 史前动物鸣叫声音系统实施计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建基于 Web Audio API 的古生物物理声学合成引擎与发声控制器，并在控制栏增加「听叫声」按钮及 3D 模型轻触触发交互，实现与语音解说的平滑避让。

**Architecture:**
1. 在 `src/audio/vocal-synthesizer.ts` 中实现覆盖 50 种动物发声原型的生理声学合成器（双共振峰低吼、颅冠号角共振、猫科调频裂骨吼、象鼻铜管号音等）；
2. 在 `src/audio/vocal-controller.ts` 中实现单例发声控制器，管理状态快照并协调语音解说的平滑音量下潜（Ducking）；
3. 在 `src/i18n/messages.ts` 中提供中英双语文案；
4. 在 `src/App.tsx` 中集成「听叫声」专属按钮与 3D 展台点击触发，并在 `src/styles.css` 中添加动态波纹视觉特效；
5. 执行全套测试与类型验证。

**Tech Stack:** Web Audio API, TypeScript, React 19, Vitest, CSS3

## Global Constraints

- 50 种已发布动物必须 100% 具备有效音色映射，无静默或运行时未捕获报错；
- 音频合成完全自包含在前端运行时（零网络请求、零额外静态音频体积）；
- 每次鸣叫自动注入微随机抖动（Jitter），杜绝机械重复；
- 鸣叫声播放期间解说音频平滑下潜，鸣叫完毕后无缝恢复；
- 通过 `npm run test`、`npm run typecheck` 与 `npm run lint`。

---

### Task 1: 编写 Web Audio 古生物声学物理合成引擎

**Files:**
- Create: `src/audio/vocal-synthesizer.ts`
- Create: `tests/audio/vocal-synthesizer.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type VocalArchetype =
    | 'apex_theropod'
    | 'sabertooth_feline'
    | 'hadrosaur_crest'
    | 'sauropod_infrasound'
    | 'proboscidean'
    | 'pterosaur_avian'
    | 'marine_behemoth'
    | 'armored_herbivore'
    | 'arthropod_drone'

  export function getAnimalVocalArchetype(animalId: string): VocalArchetype
  export function synthesizeAnimalVocal(
    ctx: AudioContext,
    animalId: string
  ): Promise<void>
  ```

- [ ] **Step 1: 编写合成器与原型映射单元测试**

创建 `tests/audio/vocal-synthesizer.test.ts`：
```ts
import { describe, expect, it } from 'vitest'
import { mainCollection } from '../../src/content/collections/main'
import { getAnimalVocalArchetype } from '../../src/audio/vocal-synthesizer'

describe('Vocal synthesizer archetype mapping', () => {
  it('maps all 50 animals in mainCollection to a recognized archetype', () => {
    for (const id of mainCollection.animalIds) {
      const archetype = getAnimalVocalArchetype(id)
      expect(archetype).toBeDefined()
    }
    expect(getAnimalVocalArchetype('tyrannosaurus-rex')).toBe('apex_theropod')
    expect(getAnimalVocalArchetype('smilodon')).toBe('sabertooth_feline')
    expect(getAnimalVocalArchetype('parasaurolophus')).toBe('hadrosaur_crest')
    expect(getAnimalVocalArchetype('mammoth')).toBe('proboscidean')
    expect(getAnimalVocalArchetype('meganeura')).toBe('arthropod_drone')
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

运行：`npx vitest run tests/audio/vocal-synthesizer.test.ts`
预期：FAIL（文件不存在）。

- [ ] **Step 3: 实现 `src/audio/vocal-synthesizer.ts`**

编写 8 大古生物声学发生器：
- `apex_theropod`: 55Hz~220Hz 扫频振荡器 + BiquadFilter 双峰共鸣（鳄目/鸸鹋喉音）；
- `sabertooth_feline`: 锯齿波 FM 调频 + 齿隙高频白噪风声 + 指数衰减增益；
- `hadrosaur_crest`: 160Hz~420Hz 颅冠中空驻波号角管鸣（多重并联带通滤波）；
- `sauropod_infrasound`: 35Hz~90Hz 超重低音次声轰鸣；
- `proboscidean`: 220Hz~680Hz 铜管号角高阶谐波扫频；
- `pterosaur_avian`: 800Hz~2800Hz 猛禽风噪尖叫；
- `marine_behemoth`: 水下共振水压脉冲深鸣；
- `armored_herbivore`: 喷气鼻鸣与喉部闷吼；
- `arthropod_drone`: 180Hz 振翅方波调制与高频甲壳微响。

- [ ] **Step 4: 运行测试验证通过**

运行：`npx vitest run tests/audio/vocal-synthesizer.test.ts`
预期：PASS。

---

### Task 2: 编写发声控制器与解说音量避让 (Audio Ducking)

**Files:**
- Create: `src/audio/vocal-controller.ts`
- Modify: `src/audio/index.ts`
- Modify: `src/audio/narration-controller.ts` (支持 ducking 钩子或临时调整音量)
- Create: `tests/audio/vocal-controller.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export class VocalController {
    subscribe(listener: () => void): () => void
    getSnapshot(): { isRoaring: boolean; activeAnimalId: string | null }
    play(animalId: string, narrationController?: NarrationController): Promise<void>
    stop(): void
  }
  ```

- [ ] **Step 1: 编写控制器与避让逻辑测试**

编写测试验证播放状态发布与 ducking 调用。

- [ ] **Step 2: 扩展 `NarrationController` 支持平滑音量下潜**

在 `NarrationController` 中增加 `setDucked(ducked: boolean)`，当 ducked 为 true 时媒体音量平滑降为 0.25，ducked 为 false 时平滑恢复 1.0。

- [ ] **Step 3: 实现 `VocalController`**

管理 `AudioContext` 生命周期（在用户首个交互手势时恢复 `resume()`），并在鸣叫期间调用 `narration.setDucked(true)`，播放结束时恢复。

- [ ] **Step 4: 运行测试验证通过**

运行：`npx vitest run tests/audio/vocal-controller.test.ts`
预期：PASS。

---

### Task 3: UI 专属「听叫声」按钮、3D 展品轻触交互与全量验证

**Files:**
- Modify: `src/i18n/messages.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/components/ViewerStage.tsx`（可选支持 3D 展台点击触发）

- [ ] **Step 1: 增加双语国际化文案**

在 `messages.ts` 中增加：
- `collection.roar`: `'听叫声'` / `'Call'`
- `collection.roaring`: `'吼叫中…'` / `'Calling…'`
- `collection.roarLabel`: `(animal: string) => `听${animal}的叫声`` / `(animal: string) => `Listen to ${animal}'s call``

- [ ] **Step 2: 在 `src/App.tsx` 页面控制栏渲染吼叫按钮**

在 `story-actions` 中「听讲解」按钮旁增加 `roar-button`：
- 点击时调用 `vocalController.play(activeAnimal.id, narration)`；
- 播放中显示波纹动画与高亮状态。

- [ ] **Step 3: 绑定 3D 模型轻触交互**

在 3D 舞台区域检测单击事件，单击展品时同样触发 `vocalController.play(activeAnimal.id, narration)`。

- [ ] **Step 4: 添加视觉样式**

在 `src/styles.css` 中为 `.roar-button` 提供童趣圆角胶囊样式、声波律动动画与无障碍焦点样式。

- [ ] **Step 5: 全量测试与端到端回归**

运行：
```bash
npm run typecheck
npm run lint
npm run check:content
npx vitest run tests/audio/
```
预期：所有单测通过，0 警告 0 报错。
