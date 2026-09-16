# Expand Prehistoric Animal Museum to 50 Species Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Onboard 24 new prehistoric animal species (Animals 27 to 50) across 4 batches into the Prehistoric Animal Museum production catalogue, bringing the total collection from 26 to 50 fully animated, bilingual exhibits with Playwright multi-viewport WebP previews, passing all CI gates and deploying to Cloudflare Pages.

**Architecture:** Candidate species from `assets/candidates/animal-onboarding-2026-08-13-expansion-100/` are verified through 12-category approval records, refreshed on the review manifest, and staged into production using the atomic onboarding tool `promote-batch`. Each batch appends new species to `src/content/collections/main.ts`, regenerates third-party credit notices, renders 6 viewport WebP images per animal with SHA-256 signatures via headless Playwright WebGL, passes content/model-preview/lint/typecheck/vitest/Cloudflare build validations, and commits and pushes to `origin/main` and `origin/master`.

**Tech Stack:** TypeScript, React, Vite, Node.js, Playwright (SwiftShader software WebGL), Three.js, glTF-Transform, Vitest, Cloudflare Pages.

## Global Constraints

- GLB triangle count: <= 100,000 target, < 250,000 hard ceiling.
- GLB file size: <= 12 MB target, < 20 MB hard ceiling.
- Animation name: must be exact `'Idle'` (case-sensitive) with seamless loop (frame 192 == frame 0 at 24fps).
- Model orientation: head toward +Y, spine along Y, feet resting at Z=0 (or centered vertically for underwater animals).
- Preview integrity: all 6 viewport WebP previews must match `sourceModel` hash in `model-preview.manifest.json`.
- Secret preservation: never commit `.env` or raw gigabyte intermediate assets.
- Dual branch synchronization: commit and push to both `origin/main` and `origin/master`.

---

## File Structure

- Candidate Source Profiles: `assets/candidates/animal-onboarding-2026-08-13-expansion-100/<id>/profile.json`
- Target Production Directory: `src/content/animals/<id>/`
  - `model/model.glb`
  - `audio/narration.zh-CN.mp3` & `audio/narration.en.mp3`
  - `backgrounds/landscape.webp` & `backgrounds/portrait.webp`
  - `images/poster.webp`, `images/poster-portrait.webp`, `images/thumbnail.webp`
  - `images/model-preview.manifest.json` + 6 viewport `.webp` previews
  - `animal.ts`, `package.ts`, `content.zh-CN.ts`, `content.en.ts`, `provenance.ts`
- Museum Catalog Index: `src/content/collections/main.ts`
- Generated Credits: `src/content/credits.generated.ts` and `THIRD_PARTY_NOTICES.md`

---

## Tasks

### Task 1: Onboard Batch 1 (Animals 27–32: Allosaurus, Brachiosaurus, Quetzalcoatlus, Elasmosaurus, Megaloceros, Anomalocaris)

**Files:**
- Create: `src/content/animals/{allosaurus,brachiosaurus,quetzalcoatlus,elasmosaurus,megaloceros,anomalocaris}/**`
- Modify: `src/content/collections/main.ts`
- Modify: `src/content/credits.generated.ts`
- Modify: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Consumes: `assets/candidates/animal-onboarding-2026-08-13-expansion-100/{allosaurus,brachiosaurus,quetzalcoatlus,elasmosaurus,megaloceros,anomalocaris}/profile.json`
- Produces: 6 new published animal packages in `src/content/animals/`, `mainCollection.animalIds` expanded to 32 species.

- [ ] **Step 1: Sign approval records and update review manifest for Batch 1**
  ```bash
  for id in allosaurus brachiosaurus quetzalcoatlus elasmosaurus megaloceros anomalocaris; do
    p="assets/candidates/animal-onboarding-2026-08-13-expansion-100/$id/profile.json"
    npx tsx tools/animal-onboarding/src/cli.ts approval record "$p" --by owner --on 2026-08-17 --approve science,anatomy,materials,background,naturalMotion,mouthComfort,contentZhCN,contentEn,audioZhCN,audioEn,redistribution,production
    npx tsx tools/animal-onboarding/src/cli.ts review prepare "$p"
  done
  ```
  Expected: Each command reports recording 12 categories and registering on the review manifest.

- [ ] **Step 2: Execute atomic promotion for Batch 1**
  ```bash
  npx tsx tools/animal-onboarding/src/cli.ts promote-batch \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/allosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/brachiosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/quetzalcoatlus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/elasmosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/megaloceros/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/anomalocaris/profile.json \
    --collection main --out /tmp/batch1-result.json
  ```
  Expected: Promotion succeeds, generates `animal.ts`, `package.ts`, `provenance.ts`, and updates `main.ts`.

- [ ] **Step 3: Render model previews with Playwright WebGL for Batch 1**
  ```bash
  npx tsx scripts/render-model-previews.ts --target=production allosaurus brachiosaurus quetzalcoatlus elasmosaurus megaloceros anomalocaris
  ```
  Expected: 36 WebP viewport images rendered and signed in `model-preview.manifest.json`.

- [ ] **Step 4: Run validation suite for Batch 1**
  ```bash
  npm run validate:content && npm run validate:model-previews && npm run lint && npm run typecheck && CI=true npx vitest run && npm run build:cloudflare
  ```
  Expected: All checks pass with 0 errors.

- [ ] **Step 5: Git commit and push Batch 1**
  ```bash
  git add src/content/ THIRD_PARTY_NOTICES.md
  git commit -m "feat(museum): onboard batch 1 (animals 27-32: allosaurus, brachiosaurus, quetzalcoatlus, elasmosaurus, megaloceros, anomalocaris)"
  git push origin main && git push origin main:master
  ```
  Expected: Clean working tree and remote branches synchronized.

---

### Task 2: Onboard Batch 2 (Animals 33–38: Albertosaurus, Carnotaurus, Ceratosaurus, Compsognathus, Deinonychus, Dimetrodon)

**Files:**
- Create: `src/content/animals/{albertosaurus,carnotaurus,ceratosaurus,compsognathus,deinonychus,dimetrodon}/**`
- Modify: `src/content/collections/main.ts`
- Modify: `src/content/credits.generated.ts`
- Modify: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Consumes: `assets/candidates/animal-onboarding-2026-08-13-expansion-100/{albertosaurus,carnotaurus,ceratosaurus,compsognathus,deinonychus,dimetrodon}/profile.json`
- Produces: 6 new published animal packages in `src/content/animals/`, `mainCollection.animalIds` expanded to 38 species.

- [ ] **Step 1: Sign approval records and update review manifest for Batch 2**
  ```bash
  for id in albertosaurus carnotaurus ceratosaurus compsognathus deinonychus dimetrodon; do
    p="assets/candidates/animal-onboarding-2026-08-13-expansion-100/$id/profile.json"
    npx tsx tools/animal-onboarding/src/cli.ts approval record "$p" --by owner --on 2026-08-17 --approve science,anatomy,materials,background,naturalMotion,mouthComfort,contentZhCN,contentEn,audioZhCN,audioEn,redistribution,production
    npx tsx tools/animal-onboarding/src/cli.ts review prepare "$p"
  done
  ```
  Expected: Each command reports recording 12 categories and registering on the review manifest.

- [ ] **Step 2: Execute atomic promotion for Batch 2**
  ```bash
  npx tsx tools/animal-onboarding/src/cli.ts promote-batch \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/albertosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/carnotaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/ceratosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/compsognathus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/deinonychus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/dimetrodon/profile.json \
    --collection main --out /tmp/batch2-result.json
  ```
  Expected: Promotion succeeds, generates modules, and appends to `mainCollection`.

- [ ] **Step 3: Render model previews with Playwright WebGL for Batch 2**
  ```bash
  npx tsx scripts/render-model-previews.ts --target=production albertosaurus carnotaurus ceratosaurus compsognathus deinonychus dimetrodon
  ```
  Expected: 36 WebP viewport images rendered and signed in `model-preview.manifest.json`.

- [ ] **Step 4: Run validation suite for Batch 2**
  ```bash
  npm run validate:content && npm run validate:model-previews && npm run lint && npm run typecheck && CI=true npx vitest run && npm run build:cloudflare
  ```
  Expected: All checks pass with 0 errors.

- [ ] **Step 5: Git commit and push Batch 2**
  ```bash
  git add src/content/ THIRD_PARTY_NOTICES.md
  git commit -m "feat(museum): onboard batch 2 (animals 33-38: albertosaurus, carnotaurus, ceratosaurus, compsognathus, deinonychus, dimetrodon)"
  git push origin main && git push origin main:master
  ```
  Expected: Clean working tree and remote branches synchronized.

---

### Task 3: Onboard Batch 3 (Animals 39–44: Baryonyx, Edmontosaurus, Ankylosaurus, Diplodocus, Microraptor, Glyptodon)

**Files:**
- Create: `src/content/animals/{baryonyx,edmontosaurus,ankylosaurus,diplodocus,microraptor,glyptodon}/**`
- Modify: `src/content/collections/main.ts`
- Modify: `src/content/credits.generated.ts`
- Modify: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Consumes: `assets/candidates/animal-onboarding-2026-08-13-expansion-100/{baryonyx,edmontosaurus,ankylosaurus,diplodocus,microraptor,glyptodon}/profile.json`
- Produces: 6 new published animal packages in `src/content/animals/`, `mainCollection.animalIds` expanded to 44 species.

- [ ] **Step 1: Sign approval records and update review manifest for Batch 3**
  ```bash
  for id in baryonyx edmontosaurus ankylosaurus diplodocus microraptor glyptodon; do
    p="assets/candidates/animal-onboarding-2026-08-13-expansion-100/$id/profile.json"
    npx tsx tools/animal-onboarding/src/cli.ts approval record "$p" --by owner --on 2026-08-17 --approve science,anatomy,materials,background,naturalMotion,mouthComfort,contentZhCN,contentEn,audioZhCN,audioEn,redistribution,production
    npx tsx tools/animal-onboarding/src/cli.ts review prepare "$p"
  done
  ```
  Expected: Each command reports recording 12 categories and registering on the review manifest.

- [ ] **Step 2: Execute atomic promotion for Batch 3**
  ```bash
  npx tsx tools/animal-onboarding/src/cli.ts promote-batch \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/baryonyx/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/edmontosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/ankylosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/diplodocus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/microraptor/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/glyptodon/profile.json \
    --collection main --out /tmp/batch3-result.json
  ```
  Expected: Promotion succeeds, generates modules, and appends to `mainCollection`.

- [ ] **Step 3: Render model previews with Playwright WebGL for Batch 3**
  ```bash
  npx tsx scripts/render-model-previews.ts --target=production baryonyx edmontosaurus ankylosaurus diplodocus microraptor glyptodon
  ```
  Expected: 36 WebP viewport images rendered and signed in `model-preview.manifest.json`.

- [ ] **Step 4: Run validation suite for Batch 3**
  ```bash
  npm run validate:content && npm run validate:model-previews && npm run lint && npm run typecheck && CI=true npx vitest run && npm run build:cloudflare
  ```
  Expected: All checks pass with 0 errors.

- [ ] **Step 5: Git commit and push Batch 3**
  ```bash
  git add src/content/ THIRD_PARTY_NOTICES.md
  git commit -m "feat(museum): onboard batch 3 (animals 39-44: baryonyx, edmontosaurus, ankylosaurus, diplodocus, microraptor, glyptodon)"
  git push origin main && git push origin main:master
  ```
  Expected: Clean working tree and remote branches synchronized.

---

### Task 4: Onboard Batch 4 (Animals 45–50: Acrocanthosaurus, Carcharodontosaurus, Herrerasaurus, Argentinosaurus, Anhanguera, Ophthalmosaurus)

**Files:**
- Create: `src/content/animals/{acrocanthosaurus,carcharodontosaurus,herrerasaurus,argentinosaurus,anhanguera,ophthalmosaurus}/**`
- Modify: `src/content/collections/main.ts`
- Modify: `src/content/credits.generated.ts`
- Modify: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Consumes: `assets/candidates/animal-onboarding-2026-08-13-expansion-100/{acrocanthosaurus,carcharodontosaurus,herrerasaurus,argentinosaurus,anhanguera,ophthalmosaurus}/profile.json`
- Produces: 6 new published animal packages in `src/content/animals/`, `mainCollection.animalIds` expanded to exactly 50 species.

- [ ] **Step 1: Sign approval records and update review manifest for Batch 4**
  ```bash
  for id in acrocanthosaurus carcharodontosaurus herrerasaurus argentinosaurus anhanguera ophthalmosaurus; do
    p="assets/candidates/animal-onboarding-2026-08-13-expansion-100/$id/profile.json"
    npx tsx tools/animal-onboarding/src/cli.ts approval record "$p" --by owner --on 2026-08-17 --approve science,anatomy,materials,background,naturalMotion,mouthComfort,contentZhCN,contentEn,audioZhCN,audioEn,redistribution,production
    npx tsx tools/animal-onboarding/src/cli.ts review prepare "$p"
  done
  ```
  Expected: Each command reports recording 12 categories and registering on the review manifest.

- [ ] **Step 2: Execute atomic promotion for Batch 4**
  ```bash
  npx tsx tools/animal-onboarding/src/cli.ts promote-batch \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/acrocanthosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/carcharodontosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/herrerasaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/argentinosaurus/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/anhanguera/profile.json \
    assets/candidates/animal-onboarding-2026-08-13-expansion-100/ophthalmosaurus/profile.json \
    --collection main --out /tmp/batch4-result.json
  ```
  Expected: Promotion succeeds, generates modules, and appends to `mainCollection` reaching 50 animals.

- [ ] **Step 3: Render model previews with Playwright WebGL for Batch 4**
  ```bash
  npx tsx scripts/render-model-previews.ts --target=production acrocanthosaurus carcharodontosaurus herrerasaurus argentinosaurus anhanguera ophthalmosaurus
  ```
  Expected: 36 WebP viewport images rendered and signed in `model-preview.manifest.json`.

- [ ] **Step 4: Run validation suite for Batch 4**
  ```bash
  npm run validate:content && npm run validate:model-previews && npm run lint && npm run typecheck && CI=true npx vitest run && npm run build:cloudflare
  ```
  Expected: All checks pass with 0 errors.

- [ ] **Step 5: Git commit and push Batch 4**
  ```bash
  git add src/content/ THIRD_PARTY_NOTICES.md
  git commit -m "feat(museum): onboard batch 4 (animals 45-50: acrocanthosaurus, carcharodontosaurus, herrerasaurus, argentinosaurus, anhanguera, ophthalmosaurus)"
  git push origin main && git push origin main:master
  ```
  Expected: Clean working tree and remote branches synchronized.

---

### Task 5: Final Production Verification & 50-Animal Milestone Deployment

**Files:**
- Verify: All 50 animals in `src/content/animals/`
- Verify: `src/content/collections/main.ts` length is exactly 50
- Verify: `cloudflare-dist/` static bundle

**Interfaces:**
- Consumes: Full 50-animal museum codebase.
- Produces: Verified production build deployed to Cloudflare Pages.

- [ ] **Step 1: Check total published animal count**
  ```bash
  npx tsx -e "import { mainCollection } from './src/content/collections/main'; console.log('Total production animals:', mainCollection.animalIds.length);"
  ```
  Expected: `Total production animals: 50`.

- [ ] **Step 2: Run complete project quality checks**
  ```bash
  npm run validate:content
  npm run validate:model-previews
  npm run lint
  npm run typecheck
  CI=true npx vitest run
  npm run build:cloudflare
  ```
  Expected: All validation suites pass with 0 warnings or errors.

- [ ] **Step 3: Verify git sync with origin**
  ```bash
  git push origin main && git push origin main:master
  git status
  ```
  Expected: `On branch main. Your branch is up to date with 'origin/main'. nothing to commit, working tree clean`.
