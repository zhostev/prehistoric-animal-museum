# Animals 19-26 Idle Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rig and synthesize 8-second seamless Idle animation clips for prehistoric animals 19-26 (velociraptor, parasaurolophus, dunkleosteus, ammonite, jaekelopterus, smilodon, spinosaurus, corythosaurus) using headless Blender 4.5.12, compress and package to museum standards, and verify Cloudflare production deployment.

**Architecture:** A standalone Python script running under local headless Blender 4.5.12 (`tools/rig_and_animate_meshy.py`) loads the decimated Meshy-6 GLB, generates a 3-bone Armature (`Body`, `Head`, `Tail`), applies a 20-step smooth skin blend along the forward (+Y) axis, synthesizes an 8-second seamless sinusoidal Idle action (`Body` breathing scale, `Head` look/nod, `Tail` sway/lift), and exports the rigged GLB. The onboarder pipeline script (`tools/onboard_meshy_animals.mjs`) orchestrates this step between geometry decimation and Meshopt/WebP compression, updates `package.ts` and `provenance.ts`, regenerates previews via Playwright, and validates all project boundaries.

**Tech Stack:** Blender 4.5.12 (`bpy`), Node.js, `gltf-transform`, Playwright WebGL headless renderer, TypeScript, Vitest.

## Global Constraints

- GLB triangle count: <= 100,000 target, < 250,000 hard ceiling.
- GLB file size: <= 12 MB target, < 20 MB hard ceiling.
- Animation name: must be exact `'Idle'` (case-sensitive) with seamless loop (frame 192 == frame 0 at 24fps).
- Model orientation: head toward +Y, spine along Y, feet resting at Z=0 (or centered vertically for underwater animals).
- Preview integrity: all 6 viewport WebP previews must match `sourceModel` hash in `model-preview.manifest.json`.
- Secret preservation: never commit `.env` or raw gigabyte intermediate assets.

---

## File Structure

- Create: `tools/rig_and_animate_meshy.py` (Blender 4.5 Python script for 3-bone armature, skinning, and Idle synthesis).
- Modify: `tools/onboard_meshy_animals.mjs` (orchestrate Blender rigging step, enable `animation` in `package.ts`, compute hash & bytes in `provenance.ts`).
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/package.ts` (re-enable `animation: { clip: 'Idle', loop: 'repeat', speed: 0.8 }`).
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/provenance.ts` (update `runtime.sha256` and `runtime.bytes`).
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/images/model-preview.manifest.json` and 6 `.webp` previews per animal.
- Modify: `THIRD_PARTY_NOTICES.md` and `src/content/credits.generated.ts`.

---

## Tasks

### Task 1: Create the Blender Rigging & Idle Animation Synthesizer

**Files:**
- Create: `tools/rig_and_animate_meshy.py`
- Test: Run on `corythosaurus` or `velociraptor` via `/home/idea/code/.runtime/blender/blender-4.5.12-linux-x64/blender`

**Interfaces:**
- Consumes: Input GLB file path, Output GLB file path, animal ID, habitat (`land` or `water`).
- Produces: GLB with Armature, `Body`, `Head`, `Tail` vertex groups, and an `Idle` animation action clip.

- [ ] **Step 1: Write `tools/rig_and_animate_meshy.py`**
  - Implement CLI argument parsing (`--input`, `--output`, `--id`, `--habitat`).
  - Clear default scene.
  - Import GLB using `bpy.ops.import_scene.gltf(filepath=...)`.
  - Ensure mesh transforms are applied.
  - Compute bounding box and span along Y axis.
  - Generate 3 bones: `Body` at (0, 0, 0) -> (0, 0, body_height * 0.72), `Head` at blend start -> front tip, `Tail` at blend start -> caudal tip.
  - Create vertex groups and smoothly assign weights in 20 steps.
  - Synthesize 193 frames (0 .. 192) for 24fps 8.0 s Idle action:
    - `Body` scale: sinusoidal breathing on X (+/-1.8%), Z (+/-1.2%), Y (+/-0.4%).
    - `Head` rotation: yaw (+/-5.5 deg, 1 cycle), pitch (+/-2.0 deg, 2 cycles).
    - `Tail` rotation: yaw (+/-7.0 deg, 3 cycles), pitch (+/-1.5 deg, 1 cycle).
  - Assign action to armature with slot binding.
  - Export GLB with `export_animations=True`, `export_format='GLB'`.

- [ ] **Step 2: Test script on a single test model**
  - Run:
    ```bash
    /home/idea/code/.runtime/blender/blender-4.5.12-linux-x64/blender --background --factory-startup --python tools/rig_and_animate_meshy.py -- --input src/content/animals/velociraptor/model/model.glb --output /tmp/test_raptor_rigged.glb --id velociraptor --habitat land
    ```
  - Verify exit code 0 and verify output file has animation clips using `gltf-transform inspect /tmp/test_raptor_rigged.glb`.

---

### Task 2: Integrate Rigging into Onboarding Script

**Files:**
- Modify: `tools/onboard_meshy_animals.mjs`

**Interfaces:**
- Consumes: Raw Meshy models in `meshy_animal_pipeline/assets/animals/<id>/01_meshy_raw/meshy_raw_model.glb`.
- Produces: Production-ready animated GLBs, updated `package.ts` with `animation: { clip: 'Idle', ... }`, updated `provenance.ts`.

- [ ] **Step 1: Update pipeline chain in `tools/onboard_meshy_animals.mjs`**
  - Chain order:
    1. Weld (`gltf-transform weld`)
    2. Simplify to ~85k-95k triangles (`gltf-transform simplify`)
    3. Blender Rig & Idle Animation (`tools/rig_and_animate_meshy.py`)
    4. WebP conversion (`gltf-transform webp`)
    5. Meshopt compression (`gltf-transform meshopt`)
    6. Copy to `src/content/animals/<id>/model/model.glb`
  - Re-enable `animation` in `package.ts`:
    ```ts
    animation: {
      clip: 'Idle',
      loop: 'repeat',
      speed: 0.8,
    },
    ```
  - Recalculate SHA-256 and bytes and write to `provenance.ts`.

- [ ] **Step 2: Dry-run Task 2 on `velociraptor`**
  - Run: `node tools/onboard_meshy_animals.mjs velociraptor`
  - Verify file size is within 12MB.
  - Inspect animation presence with `npx @gltf-transform/cli inspect src/content/animals/velociraptor/model/model.glb`.

---

### Task 3: Batch Process All 8 Animals (19–26)

**Files:**
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/model/model.glb`
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/package.ts`
- Modify: `src/content/animals/{velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus}/provenance.ts`

- [ ] **Step 1: Execute batch onboarding**
  - Run: `node tools/onboard_meshy_animals.mjs`
  - Check that all 8 animals complete successfully.

- [ ] **Step 2: Sync third-party credits and notices**
  - Run: `npm run generate:credits`
  - Verify `THIRD_PARTY_NOTICES.md` is updated.

---

### Task 4: Re-render Previews & Signatures via Playwright Headless WebGL

**Files:**
- Modify: `src/content/animals/*/images/model-preview.manifest.json`
- Modify: `src/content/animals/*/images/*.webp`

- [ ] **Step 1: Render production previews**
  - Run:
    ```bash
    tsx scripts/render-model-previews.ts --target=production --animal=velociraptor,parasaurolophus,dunkleosteus,ammonite,jaekelopterus,smilodon,spinosaurus,corythosaurus
    ```
  - Verify all 48 preview WebP images (6 per animal) are rendered.

- [ ] **Step 2: Validate model previews**
  - Run: `npm run validate:model-previews`
  - Expected: `production model previews: 26 animal(s), 6 shared profile(s), source and presentation signatures current`.

---

### Task 5: Comprehensive Validation, Git Commit & Push

- [ ] **Step 1: Run full validation suite**
  - Run: `npm run validate:content`
  - Run: `npm run lint`
  - Run: `npm run typecheck`
  - Run: `CI=true npx vitest run`
  - Run: `npm run build:cloudflare`

- [ ] **Step 2: Commit and push**
  - Run:
    ```bash
    git add THIRD_PARTY_NOTICES.md src/content/ docs/superpowers/
    git commit -m "feat(animation): synthesize 8s seamless Idle animation and deformation rig for animals 19-26"
    git push origin main && git push origin main:master
    ```
  - Confirm origin branches are synchronized and clean.
