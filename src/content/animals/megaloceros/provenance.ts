import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'generated',
      title: 'Megaloceros deterministic procedural model source',
      tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
      generatedOn: '2026-08-17',
      prompt: 'Project-authored procedural model generated from the archived Blender Python generator; the retained generator script is the reproducible source.',
      sha256: '7e7cb5edf1e63c93e94a10c70d376a3195d612706148d2828ff2a07aaea280af',
      bytes: 117608,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: '5719bc1ea656e89c9821f861c4c6fdc07e70cbed89caecbf05bbc056ede49518',
      bytes: 2228360,
    },
    modifications: [
      'pipeline: project-authored expansion GLB (mammal, feature=giant-antlers) -> joined web mesh, Body/Head/Tail deformation rig, archetype-specific 8 s Idle',
      'scale: source body length 5.9621 Blender units -> 3.0 m; uniform factor 0.503178 applied to mesh data',
      'grounding (land): shifted z by -0.53240 m so the lowest vertex rests at z=0',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, two-cycle body breathing, Head +/-5.5 deg, Tail +/-8.0 deg; habitat=land, vertical drift +/-0.0000 m; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Megaloceros” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Megaloceros habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 1fdbe8cb87f4e25ad933e69896640a94e51d2ffe08995e0bfa7a49accb03ac9c) rendered with seed 1499317526 for the land habitat.',
      sha256: '1fdbe8cb87f4e25ad933e69896640a94e51d2ffe08995e0bfa7a49accb03ac9c',
      bytes: 13351,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '7d59d176f9a8a9e49c7ff4dfad47b7013a3b2e09aa2677bb40ccb99dc0946b86',
      bytes: 326936,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Megaloceros landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Megaloceros habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 1fdbe8cb87f4e25ad933e69896640a94e51d2ffe08995e0bfa7a49accb03ac9c) rendered with seed 1499317526 for the land habitat.',
      sha256: '1fdbe8cb87f4e25ad933e69896640a94e51d2ffe08995e0bfa7a49accb03ac9c',
      bytes: 13351,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '63dc89957d8798ae9be4a749218c1d540d3b91936a3a7ced95dfe7efc5c11ded',
      bytes: 188006,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Megaloceros portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Megaloceros transparent model still',
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
      sha256: 'b34954e3e2720c16283f6a42b0fa45f5c2cdde1d61d2b3f2b7bb9ec6e50b047c',
      bytes: 12188,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Megaloceros” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Megaloceros transparent portrait model still',
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
      sha256: '95923d21152537676b27c9e7558079dcee7e23a604e00dd4e00f05dbc1cb0215',
      bytes: 3872,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Megaloceros” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Megaloceros collection thumbnail',
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
      sha256: 'c8f7d1eb0b9e97bb8987624184a2a5fe0dad1071d33b2b3ed544fec4e9dcbe79',
      bytes: 2798,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Megaloceros” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Megaloceros Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: '这是大角鹿，学名是Megaloceros giganteus。看看它醒目的“giant antlers”外形，再观察轻轻的呼吸、转头和尾部动作。',
      sha256: '1aeec597359a0469e897b7333b44728a21e5013030f60b8863fbd6b22cbc2c9a',
      bytes: 107372,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '1aeec597359a0469e897b7333b44728a21e5013030f60b8863fbd6b22cbc2c9a',
      bytes: 107372,
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
      title: 'Megaloceros English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: 'This is Megaloceros, a prehistoric animal known as Megaloceros giganteus. Look for its giant antlers. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
      sha256: '2155234a6279037d9d7e4e8a943466213803e7a0af9a64db5964c9fb0de45a79',
      bytes: 143276,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '2155234a6279037d9d7e4e8a943466213803e7a0af9a64db5964c9fb0de45a79',
      bytes: 143276,
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
