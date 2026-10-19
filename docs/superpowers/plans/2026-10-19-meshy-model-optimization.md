# Meshy Model & Rig Optimization Implementation Plan

- **Date**: 2026-10-19
- **Design Spec**: [2026-10-19-meshy-model-optimization-design.md](file:///home/idea/code/prehistoric-animal-museum/docs/superpowers/specs/2026-10-19-meshy-model-optimization-design.md)
- **Goal**: Implement archetype-aware multi-bone procedural rigging, automatic jaw articulation, PBR shader enhancement, and apply this pipeline to optimize the 4 Pioneer Archetypes (`tyrannosaurus-rex`, `triceratops`, `smilodon`, `mosasaurus`).

---

## Proposed Changes

### 1. Rigging & Animation Pipeline
#### [`tools/rig_and_animate_meshy.py`](file:///home/idea/code/prehistoric-animal-museum/tools/rig_and_animate_meshy.py)
- Support `--archetype` parameter (`theropod_biped`, `ceratopsian_quadruped`, `mammalian_quadruped`, `marine_streamlined`, `generic`).
- Construct articulated armatures with:
  - `Body` (Root respiration + posture)
  - `Neck` & `Head`
  - `Jaw` (Snout hinge with respiration relaxation)
  - `Tail_Base` & `Tail_Tip` (2-segment harmonic sway)
- Apply auto-jaw vertex detection & cosine smooth weighting.
- Enhance PBR node trees in Blender (balance BaseColor contrast, enhance micro-normal bump).
- Synthesize seamless 192-frame (8.0s @ 24fps) looping animation.

### 2. Onboarding Runner
#### [`tools/onboard_meshy_animals.mjs`](file:///home/idea/code/prehistoric-animal-museum/tools/onboard_meshy_animals.mjs)
- Map animal IDs to their respective archetypes.
- Pass `--archetype` into the headless Blender execution.
- Ensure automated optimization (weld -> simplify -> rig -> webp -> meshopt) runs cleanly.

### 3. Pioneer Batch Deployment
- Process and update:
  - `src/content/animals/tyrannosaurus-rex/model/model.glb`
  - `src/content/animals/triceratops/model/model.glb`
  - `src/content/animals/smilodon/model/model.glb`
  - `src/content/animals/mosasaurus/model/model.glb`
- Update provenance runtime hashes and package configs.

---

## Verification Plan

### Automated Tests
1. **Rigger Unit/Sanity Run**:
   Run headless Blender on each archetype to ensure clean armature hierarchy and error-free export.
2. **Audit Verification**:
   `npx tsx tools/audit-animal-integration.ts` must report 50/50 passing.
3. **Repository Build**:
   `npm run build` must succeed with zero TypeScript or asset bundling errors.
4. **GLB Budget & Animation Check**:
   Validate file size $\le 2.50\text{MB}$, triangle count $\le 95\text{k}$, and exactly 192 keyframes in the `Idle` action.
