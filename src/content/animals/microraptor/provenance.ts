import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'generated',
      title: 'Microraptor deterministic procedural model source',
      tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
      generatedOn: '2026-08-17',
      prompt: 'Project-authored procedural model generated from the archived Blender Python generator; the retained generator script is the reproducible source.',
      sha256: '467f4c7fda45c3dd87e2d21e8987e1fa47bb3d5bbe06436ac00738e957f67ed0',
      bytes: 101836,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'a435c5f6f92525a909ebdb12d9582c8db5c13773735e33fdc19624ab7a221ec7',
      bytes: 1847520,
    },
    modifications: [
      'pipeline: project-authored expansion GLB (feathered, feature=four-wings) -> joined web mesh, Body/Head/Tail deformation rig, archetype-specific 8 s Idle',
      'scale: source body length 7.9101 Blender units -> 0.8 m; uniform factor 0.101137 applied to mesh data',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, two-cycle body breathing, Head +/-5.0 deg, Tail +/-7.5 deg; habitat=air, vertical drift +/-0.0150 m; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Microraptor” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Microraptor habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 41a9fc3603755c5cbca5d0a6251bb5e0323810831723499b3ead0a7d96ecb1d2) rendered with seed 3175652455 for the air habitat.',
      sha256: '41a9fc3603755c5cbca5d0a6251bb5e0323810831723499b3ead0a7d96ecb1d2',
      bytes: 13373,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'fcb1945003859210cff061a31eb07a2462dccf4be60d0b3dbe23f58614f3fdf5',
      bytes: 318542,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Microraptor landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Microraptor habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 41a9fc3603755c5cbca5d0a6251bb5e0323810831723499b3ead0a7d96ecb1d2) rendered with seed 3175652455 for the air habitat.',
      sha256: '41a9fc3603755c5cbca5d0a6251bb5e0323810831723499b3ead0a7d96ecb1d2',
      bytes: 13373,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '7849d3056e56ee064312871b924a8b6ea2e28d2d13b6d25baa952f68d5484e0f',
      bytes: 158848,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Microraptor portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Microraptor transparent model still',
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
      sha256: 'e176db1070084d80f150e39ef5329a16815c68f0488488c07d4bc74f059641ca',
      bytes: 11224,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Microraptor” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Microraptor transparent portrait model still',
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
      sha256: 'cace3d0b97653a80294246b4a14a48feef8b944e4f648ae3447ee11ea62774e3',
      bytes: 3440,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Microraptor” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Microraptor collection thumbnail',
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
      sha256: '52098767930dd6fc65d1cac3a7e2bde4d63b5a7bc62d45b5602c1683142b23ee',
      bytes: 2590,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Microraptor” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Microraptor Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: '这是小盗龙，学名是Microraptor gui。看看它醒目的“four wings”外形，再观察轻轻的呼吸、转头和尾部动作。',
      sha256: 'cfe76ee578e1080939d9458025e7d943d281baf9ba1aa6a5086e8cba0da2fb5e',
      bytes: 92012,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'cfe76ee578e1080939d9458025e7d943d281baf9ba1aa6a5086e8cba0da2fb5e',
      bytes: 92012,
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
      title: 'Microraptor English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: 'This is Microraptor, a prehistoric animal known as Microraptor gui. Look for its four wings. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
      sha256: 'ee5fc921e1ec033db93a001ed60d20f48015168623da3b9c806a847f5a324c8c',
      bytes: 140588,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'ee5fc921e1ec033db93a001ed60d20f48015168623da3b9c806a847f5a324c8c',
      bytes: 140588,
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
