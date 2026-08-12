import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Dunkleosteus',
      author: 'EvolutionIncarnate',
      url: 'https://commons.wikimedia.org/wiki/File:Dunkliferecon.stl',
      accessedOn: '2026-08-10',
      sha256: 'b1623f849000b6466af14189d131af26984b8dc0dae8f09e73ca2ed25d984803',
      bytes: 20816684,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: '39e12696ffbec1c5579aa70d06af1f243888dfe44e7ff33ab627bc6d3a070afe',
      bytes: 3713332,
    },
    modifications: [
      'Added deterministic project-authored procedural baked textures (Smart UV unwrap + Cycles diffuse bake, texture_materials.py); geometry, rig and Idle animation unchanged.',
      'pipeline: unrigged static STL -> decimate, author materials, synthesize 5-bone spine chain + 8 s swim Idle',
      'dunkleosteus: source faces Blender -Y; rotated 180 deg about Z, applied to mesh data -> head now toward +Y (glTF -Z)',
      'decimate: ratio 0.2162 (416332 -> 90000 tris, 44990 verts); over-ceiling source reduced to <=100k target',
      'shading: smooth (source STL was flat-shaded)',
      'materials authored (source had none): \'Body\' muted slate blue (0.38,0.47,0.55) + \'HeadPlates\' muted warm grey (0.52,0.49,0.43), roughness 0.8/0.85; head plates assigned to faces with local centre y > -1.379 (front 30%, the armoured head): 65769/90000 faces; choices remain human-reviewable (humanApprovals.materials stays false)',
      'scale: source body length 4.1131 Blender units -> 6.0 m; uniform factor 1.458754 applied to mesh data',
      'centring (water): shifted by [-0.23914, 3.21208, -1.57498] m so the bounding-box centre sits at the origin (x/y centred, centred vertically in the water column)',
      'armature synthesized: 5-bone spine chain Spine1..Spine5 along -Y (head end y=0.90 m to tail tip y=-3.00 m), roll 0',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, one LINEAR key per frame; lateral wave amplitudes [1.5, 3.0, 5.0, 7.0, 9.0] deg (Spine1->Spine5, travelling phase -0.55 rad/bone), vertical bob +/-0.05 m on the armature object, no root travel; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Dunkleosteus” by EvolutionIncarnate, CC0-1.0; modified for the Prehistoric Animal Museum.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/model-license.txt',
      'provenance/LICENSES/model-source.txt',
    ],
  },
  {
    assetPath: 'backgrounds/landscape.webp',
    kind: 'background',
    source: {
      type: 'generated',
      title: 'Dunkleosteus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-10',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 f9da775c9426b9fe1e4c0ce37c04920792f04f4df0c5391d29361cc38e45cb69) rendered with seed 3504070383 for the water habitat.',
      sha256: 'f9da775c9426b9fe1e4c0ce37c04920792f04f4df0c5391d29361cc38e45cb69',
      bytes: 18958,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '8fdd996a57745f2ca773e6ef52c22b3b6a738524ee219e03c1dfb27377793fa0',
      bytes: 27270,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Dunkleosteus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/background-generation.txt',
    ],
  },
  {
    assetPath: 'backgrounds/portrait.webp',
    kind: 'background',
    source: {
      type: 'generated',
      title: 'Dunkleosteus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-10',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 f9da775c9426b9fe1e4c0ce37c04920792f04f4df0c5391d29361cc38e45cb69) rendered with seed 3504070383 for the water habitat.',
      sha256: 'f9da775c9426b9fe1e4c0ce37c04920792f04f4df0c5391d29361cc38e45cb69',
      bytes: 18958,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '0e1066cfd447146a9a9bda40a2f4371b5952edb79874b7a228c0a60b6523cc72',
      bytes: 12126,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Dunkleosteus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/background-generation.txt',
    ],
  },
  {
    assetPath: 'images/poster.webp',
    kind: 'poster',
    source: {
      type: 'derived',
      title: 'Dunkleosteus transparent model still',
      generatedOn: '2026-08-10',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 1200 × 675 landscape runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'ca4cce0e5fb3e1d62b0c0571b208cf0ccb8f784b3faf56270017b968216bbe5f',
      bytes: 12852,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Dunkleosteus” by EvolutionIncarnate, CC0-1.0; modified for the Prehistoric Animal Museum.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/model-license.txt',
      'provenance/LICENSES/model-source.txt',
      'provenance/LICENSES/derived-images.txt',
    ],
  },
  {
    assetPath: 'images/poster-portrait.webp',
    kind: 'poster',
    source: {
      type: 'derived',
      title: 'Dunkleosteus transparent portrait model still',
      generatedOn: '2026-08-10',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 390 × 844 portrait runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'd2a3217d8431a0ca78ce85e09c101799dc8124e66fd836f850bcd5d577cca4af',
      bytes: 3616,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Dunkleosteus” by EvolutionIncarnate, CC0-1.0; modified for the Prehistoric Animal Museum.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/model-license.txt',
      'provenance/LICENSES/model-source.txt',
      'provenance/LICENSES/derived-images.txt',
    ],
  },
  {
    assetPath: 'images/thumbnail.webp',
    kind: 'thumbnail',
    source: {
      type: 'derived',
      title: 'Dunkleosteus collection thumbnail',
      generatedOn: '2026-08-10',
      inputAssetPaths: [
        'model/model.glb',
        'backgrounds/landscape.webp',
      ],
      method: 'Deterministic square crop from the accepted desktop review presentation after hiding all interface chrome.',
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'e2e1ffbd20b7b2cc8bd536c7624e1819a1533154bacb43ad83045e6f8b60e245',
      bytes: 2740,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Dunkleosteus” by EvolutionIncarnate, CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/model-license.txt',
      'provenance/LICENSES/model-source.txt',
      'provenance/LICENSES/derived-images.txt',
    ],
  },
  {
    assetPath: 'audio/narration.zh-CN.mp3',
    kind: 'narration',
    source: {
      type: 'generated',
      title: 'Dunkleosteus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: '这是邓氏鱼，一种生活在晚泥盆世海洋里的肉食性盾皮鱼。看看它脑袋上那层硬硬的骨甲，像不像戴着一副坚固的头盔？',
      sha256: 'da2ee6a11f4e1787fa3b3f5675d47fcbd3e27b3590d34f47c6e9a75619db88fc',
      bytes: 82412,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'da2ee6a11f4e1787fa3b3f5675d47fcbd3e27b3590d34f47c6e9a75619db88fc',
      bytes: 82412,
    },
    modifications: [
      'Generated offline from the exact reviewed two-sentence script.',
      'Normalized to a reviewed 48 kHz mono MP3 without runtime synthesis.',
    ],
    attribution: 'Project-generated Mandarin narration produced locally with Qwen3-TTS 0.6B CustomVoice (Serena).',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/narration-rights.txt',
    ],
  },
  {
    assetPath: 'audio/narration.en.mp3',
    kind: 'narration',
    source: {
      type: 'generated',
      title: 'Dunkleosteus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: 'This is Dunkleosteus, a meat-eating armoured fish from the Late Devonian seas. Look at the hard bony armour covering its head. Does it look as though it is wearing a strong helmet?',
      sha256: '94610e02b98ab30c609ba1edb704a2c2d3078e69351be921b6d1fb9a18a147aa',
      bytes: 118316,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '94610e02b98ab30c609ba1edb704a2c2d3078e69351be921b6d1fb9a18a147aa',
      bytes: 118316,
    },
    modifications: [
      'Generated offline from the exact reviewed two-sentence script.',
      'Normalized to a reviewed 48 kHz mono MP3 without runtime synthesis.',
    ],
    attribution: 'Project-generated English narration produced locally with Qwen3-TTS 0.6B CustomVoice (Serena).',
    redistributionAllowed: true,
    evidencePaths: [
      'provenance/LICENSES/narration-rights.txt',
    ],
  },
] satisfies readonly [
  AssetProvenance,
  ...AssetProvenance[],
]
