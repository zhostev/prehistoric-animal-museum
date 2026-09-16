import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'generated',
      title: 'Herrerasaurus deterministic procedural model source',
      tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
      generatedOn: '2026-08-17',
      prompt: 'Project-authored procedural model generated from the archived Blender Python generator; the retained generator script is the reproducible source.',
      sha256: '1e5e8a684929eb2b66aac7496676e55cd61e6f3ec3fe82be61dfa40cf63c338a',
      bytes: 101836,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: 'f1c7a2d2d2bc0348f611c95a2ae287941a8779fc7fb8c48aef662a58f37ffffd',
      bytes: 1544800,
    },
    modifications: [
      'pipeline: project-authored expansion GLB (theropod, feature=primitive-slender) -> joined web mesh, Body/Head/Tail deformation rig, archetype-specific 8 s Idle',
      'scale: source body length 7.9101 Blender units -> 4.5 m; uniform factor 0.568896 applied to mesh data',
      'grounding (land): shifted z by -0.61040 m so the lowest vertex rests at z=0',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, two-cycle body breathing, Head +/-5.5 deg, Tail +/-8.0 deg; habitat=land, vertical drift +/-0.0000 m; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Herrerasaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Herrerasaurus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 68726c88cfe23c02b19a481392d250c13ca0fddc1fcbc463ddb9a363e5800cc6) rendered with seed 3662375803 for the land habitat.',
      sha256: '68726c88cfe23c02b19a481392d250c13ca0fddc1fcbc463ddb9a363e5800cc6',
      bytes: 13365,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'bb0728ecd9d03c8de46d4f069cd3ec1db2cb5c9da9177440fd7918c2182fa41c',
      bytes: 15608,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Herrerasaurus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Herrerasaurus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-17',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 68726c88cfe23c02b19a481392d250c13ca0fddc1fcbc463ddb9a363e5800cc6) rendered with seed 3662375803 for the land habitat.',
      sha256: '68726c88cfe23c02b19a481392d250c13ca0fddc1fcbc463ddb9a363e5800cc6',
      bytes: 13365,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '1cacd96930611a6deda24fba530c9b7a1f7cc741624bbd0ab83560ea6b07cfdf',
      bytes: 8592,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Herrerasaurus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Herrerasaurus transparent model still',
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
      sha256: '8f735dfa75b75a40636d2ce0ad16c84a32af95aa78d969bb6e576bca3a699151',
      bytes: 11258,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Herrerasaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Herrerasaurus transparent portrait model still',
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
      sha256: 'af118f999674533de265c0836abad2d53b094a1794eb69f37d5e8263e30e0553',
      bytes: 3328,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Herrerasaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Herrerasaurus collection thumbnail',
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
      sha256: '8c225602c87f0ecdb582ca487198b15ebc384e8a1571b2f3ff2d18867e6ce2c6',
      bytes: 2264,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Herrerasaurus” by Prehistoric Animal Museum (project-authored), CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Herrerasaurus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: '这是埃雷拉龙，学名是Herrerasaurus ischigualastensis。看看它醒目的“primitive slender”外形，再观察轻轻的呼吸、转头和尾部动作。',
      sha256: '2a581afa53e151d4573f860190482ac167a1e23b80dfce05663466aa2bfe6e95',
      bytes: 144428,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '2a581afa53e151d4573f860190482ac167a1e23b80dfce05663466aa2bfe6e95',
      bytes: 144428,
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
      title: 'Herrerasaurus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: 'This is Herrerasaurus, a prehistoric animal known as Herrerasaurus ischigualastensis. Look for its primitive slender. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
      sha256: 'e4999e1d4ed32cdadb80a01764a6d033d1a4748f852bff32e0c7c1f93e3dbfb1',
      bytes: 154028,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'e4999e1d4ed32cdadb80a01764a6d033d1a4748f852bff32e0c7c1f93e3dbfb1',
      bytes: 154028,
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
