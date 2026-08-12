import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Ammonite',
      author: 'Steph Piper (sjpiper145)',
      url: 'https://archive.org/details/thingiverse-2246008',
      accessedOn: '2026-08-11',
      sha256: '6269c2922a397bc321535a88596dd42703073c41dc6759c8397bd9de1ae2611f',
      bytes: 3429332,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: '24601fcaf1d86079d42926cea84f230dca184a2182c97ff120ebe171b34c3546',
      bytes: 1702452,
    },
    modifications: [
      'pipeline: one-piece fossil-shell PLY scan (not a living-animal reconstruction) -> topology check, stone material, single-bone floating display Idle',
      'armature synthesized: 1 bones [\'Shell\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, LINEAR per-frame keys; fossil shell display drifts +/-0.018 m and rocks +/-3.2/+/-1.8 deg; frame 192 repeats frame 0 exactly',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Ammonite” by Steph Piper (sjpiper145), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Ammonite habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 b22a81bf5023520776eb4b68c1ab7432543440151d1dc039764b27501d9b0ea0) rendered with seed 2871074609 for the water habitat.',
      sha256: 'b22a81bf5023520776eb4b68c1ab7432543440151d1dc039764b27501d9b0ea0',
      bytes: 18936,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'b9ee44f47e88719a14865e60a3b23b08dca5a055715f4c2a998a7322dc898df8',
      bytes: 24596,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Ammonite landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Ammonite habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 b22a81bf5023520776eb4b68c1ab7432543440151d1dc039764b27501d9b0ea0) rendered with seed 2871074609 for the water habitat.',
      sha256: 'b22a81bf5023520776eb4b68c1ab7432543440151d1dc039764b27501d9b0ea0',
      bytes: 18936,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'cc0e6283a2631d94061e58b07fd17e0fa3525668c04f1a8f0a75bc136deb24cf',
      bytes: 17352,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Ammonite portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Ammonite transparent model still',
      generatedOn: '2026-08-11',
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
      sha256: 'a6d6257375e6566583e552fb2f46bd1f94ad3988236b686fb1cfed1002c63283',
      bytes: 11232,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Ammonite” by Steph Piper (sjpiper145), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Ammonite transparent portrait model still',
      generatedOn: '2026-08-11',
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
      sha256: '6e058ef68440eebb20f6947e310be06beb237f07c0421c1276c6fa1caf2b3233',
      bytes: 4778,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Ammonite” by Steph Piper (sjpiper145), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Ammonite collection thumbnail',
      generatedOn: '2026-08-11',
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
      sha256: 'bcc2471d50db9a41aa5a6e16d9b997e65b294a084990cfd9fc53bc97c44d5a2e',
      bytes: 2314,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Ammonite” by Steph Piper (sjpiper145), CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Ammonite Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: '这是一件菊石化石壳的三维扫描，不是带有软体部分的活体复原。看看这枚盘卷的壳，一圈绕着一圈，像不像一条卷起来的石头绳子？',
      sha256: 'd8231702fa7931073680b90c3584fe03e6224644aacb3627ad03daad09bcd3b0',
      bytes: 95852,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'd8231702fa7931073680b90c3584fe03e6224644aacb3627ad03daad09bcd3b0',
      bytes: 95852,
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
      title: 'Ammonite English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: 'This is a three-dimensional scan of an ammonite fossil shell, not a living-animal reconstruction with soft parts. Look at the coiled shell winding round and round. Does it look like a stone rope rolled into a spiral?',
      sha256: '5b735cfde1fd8cfecbd0dc34eba2415be308e49db7329911f0e51cac8f635a06',
      bytes: 141356,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '5b735cfde1fd8cfecbd0dc34eba2415be308e49db7329911f0e51cac8f635a06',
      bytes: 141356,
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
