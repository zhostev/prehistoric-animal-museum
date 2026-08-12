import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Velociraptor',
      author: 'Quaternius',
      url: 'https://quaternius.com/packs/animateddinosaurs.html',
      accessedOn: '2026-08-10',
      sha256: 'addfa06b9851b61f8e53b0cd1468e45c43ca0f4f2d2c6b756f1c8c0efa5fffc1',
      bytes: 1078640,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: '5e7e4dbddeb3e2b6d86d6baea161d429331b7075290ecae7698773404bc4b6aa',
      bytes: 639740,
    },
    modifications: [
      'Added deterministic project-authored procedural baked textures (Smart UV unwrap + Cycles diffuse bake, texture_materials.py); geometry, rig and Idle animation unchanged.',
      'pipeline: rigged .blend source, keeping only \'Velociraptor_Idle\' retimed to 8 s',
      'action \'Velociraptor_Idle\' (0..60 f, BEZIER) resampled to \'Idle\': frames 0..192 at 24 fps = 8.0 s, one LINEAR key per frame, 102 fcurves; frame 192 resamples frame 0 exactly (seamless loop); pose location channels scaled by 1.000000 (1.0 = armature-space units kept, metres come from the object node scale)',
      'velociraptor: source faces Blender -Y; 180 deg Z rotation kept on object node(s) [\'Armature\'] (rigged source: applying to armature data would break bone-local pose fcurves; child meshes inherit the node transform; matches the production maiasaura package) -> head now toward +Y (glTF -Z)',
      'scale: source body length 13.2763 Blender units -> 2.0 m; uniform factor 0.150644 kept on object node(s) [\'Armature\'] (armature-space pose fcurves stay in source units)',
      'grounding (land): shifted z by +0.00797 m so the lowest vertex rests at z=0 (object node translation)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
      'Removed 6 unused source clips after retiming the Idle take.',
    ],
    attribution: '“Velociraptor” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Velociraptor habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-10',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 f948685af967784cebb803dc7a06c0d39f62f23fc6cd51a703d0e0230b055aa6) rendered with seed 4036161673 for the land habitat.',
      sha256: 'f948685af967784cebb803dc7a06c0d39f62f23fc6cd51a703d0e0230b055aa6',
      bytes: 13312,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'cce0ded7b2043d5d6f8acf286389057a10fb090538fd3ccbfa1418cd52aad6e8',
      bytes: 16184,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Velociraptor landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Velociraptor habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-10',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 f948685af967784cebb803dc7a06c0d39f62f23fc6cd51a703d0e0230b055aa6) rendered with seed 4036161673 for the land habitat.',
      sha256: 'f948685af967784cebb803dc7a06c0d39f62f23fc6cd51a703d0e0230b055aa6',
      bytes: 13312,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'd23a25e8aa44e6f2ff5be2cb4dcefdc83fda60521228a95a0be322a6c848bed4',
      bytes: 10138,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Velociraptor portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Velociraptor transparent model still',
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
      sha256: 'c22b4598704aba681a06394d41976fb6d3abf61377a04dfd2f63d1f58d541851',
      bytes: 14076,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Velociraptor” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Velociraptor transparent portrait model still',
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
      sha256: '4aa4281411a0039cd245ced64ce317ae0d3482704daa4c3d2060280706f96957',
      bytes: 4162,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Velociraptor” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Velociraptor collection thumbnail',
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
      sha256: 'e7ebfd897085568b03e49186f7c001352b060d0da87b9bff2cff7c8a9c2daa1e',
      bytes: 3350,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Velociraptor” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Velociraptor Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: '这是伶盗龙，一种生活在晚白垩世蒙古的带羽毛肉食性恐龙。看看它每只后脚上那枚翘起的弯弯大爪子，像不像一把锋利的小镰刀？',
      sha256: 'c4f2949e066f5b2bdc1336762a042146c8eeb3cf52f97cd7102a68f96c30bca3',
      bytes: 99116,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'c4f2949e066f5b2bdc1336762a042146c8eeb3cf52f97cd7102a68f96c30bca3',
      bytes: 99116,
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
      title: 'Velociraptor English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: 'This is Velociraptor, a feathered meat-eating dinosaur from Late Cretaceous Mongolia. Look at the big curved claw held up on each of its feet. Does it look like a sharp little sickle?',
      sha256: '44d756de9c40cf7f78c53766d53bad48cfb0fcec7f6de5a669f05f78276998ba',
      bytes: 115052,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '44d756de9c40cf7f78c53766d53bad48cfb0fcec7f6de5a669f05f78276998ba',
      bytes: 115052,
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
