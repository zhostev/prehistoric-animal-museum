import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'generated',
      title: 'Allosaurus deterministic procedural model source',
      tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
      generatedOn: '2026-08-17',
      prompt: 'Project-authored procedural model generated from the archived Blender Python generator; the retained generator script is the reproducible source.',
      sha256: '3f3bd3df08a9bcb57f05a2d8b701b166c878314aa89c7da39b9b0b83eb165739',
      bytes: 107256,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'cdaf64e520f29a7cbe9742752078a0f66c9196fdfa727720c7b85820cea2c783',
      bytes: 164812,
    },
    modifications: [
      'pipeline: project-authored expansion GLB (theropod, feature=brow-horns) -> joined web mesh, Body/Head/Tail deformation rig, archetype-specific 8 s Idle',
      'scale: source body length 7.9101 Blender units -> 9.0 m; uniform factor 1.137792 applied to mesh data',
      'grounding (land): shifted z by +0.22919 m so the lowest vertex rests at z=0',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, two-cycle body breathing, Head +/-5.5 deg, Tail +/-8.0 deg; habitat=land, vertical drift +/-0.0000 m; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Allosaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Allosaurus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 b88ad3edd7a15c9c91f589ebd28efde78b0cf7ff38cfe947126b3bed99605adc) rendered with seed 1732538382 for the land habitat.',
      sha256: 'b88ad3edd7a15c9c91f589ebd28efde78b0cf7ff38cfe947126b3bed99605adc',
      bytes: 13344,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'f5ee5d127ae88eb2438ab1736d07a84c365ac0152614e55c1f40cac4b00f6d84',
      bytes: 16280,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Allosaurus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Allosaurus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 b88ad3edd7a15c9c91f589ebd28efde78b0cf7ff38cfe947126b3bed99605adc) rendered with seed 1732538382 for the land habitat.',
      sha256: 'b88ad3edd7a15c9c91f589ebd28efde78b0cf7ff38cfe947126b3bed99605adc',
      bytes: 13344,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '86c2d784285cc443bed058e9232fb4c8997857c19ad667f589fa969c9a9f5f51',
      bytes: 9200,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Allosaurus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Allosaurus transparent model still',
      generatedOn: '2026-08-17',
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
      sha256: 'b15e838d117218e55bf11b0998d7cd94ca42f544ee13171491db2070a0e3ca2f',
      bytes: 11984,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Allosaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Allosaurus transparent portrait model still',
      generatedOn: '2026-08-17',
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
      sha256: '8de11eca986ac9b22d3a89d5f8ce88fc31caf062cda35a9dd946b30867308883',
      bytes: 3566,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Allosaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Allosaurus collection thumbnail',
      generatedOn: '2026-08-17',
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
      sha256: 'a775a39ed25385a9bf0af42ca3ff98ca655b749e7969c7956b9774f77f45f47d',
      bytes: 2702,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Allosaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Allosaurus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-13',
      prompt: '这是异特龙，学名是Allosaurus fragilis。看看它醒目的“brow horns”外形，再观察轻轻的呼吸、转头和尾部动作。',
      sha256: '32af93e6140f54cec8ffec132fd6456a41914fa56370c3304fbd18023fe4b02e',
      bytes: 100268,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '32af93e6140f54cec8ffec132fd6456a41914fa56370c3304fbd18023fe4b02e',
      bytes: 100268,
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
      title: 'Allosaurus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-13',
      prompt: 'This is Allosaurus, a prehistoric animal known as Allosaurus fragilis. Look for its brow horns. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
      sha256: '7e95884fa5c3dfc25d86fe230b76f761bb8919d642b58e9c03cfb5e6c3ea47eb',
      bytes: 134252,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '7e95884fa5c3dfc25d86fe230b76f761bb8919d642b58e9c03cfb5e6c3ea47eb',
      bytes: 134252,
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
