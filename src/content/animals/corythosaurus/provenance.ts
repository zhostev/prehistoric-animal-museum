import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Corythosaurus',
      author: 'TotalDino',
      url: 'https://commons.wikimedia.org/wiki/File:Corythosaurus_TD.png',
      accessedOn: '2026-08-18',
      sha256: 'f0a9ba8f2f7fefe3d6ecb9e7f90c2bebcfc84427691b50ce9d2982d3e97082c8',
      bytes: 6965868,
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: 'a3701845691a31a43f914bcf068f61ef3ee6a0c24c9f29f1c122192c20642056',
      bytes: 3923372,
    },
    modifications: [
      'pipeline: static sculpt (corythosaurus) -> keep configured meshes, author materials, optional normal bake, synthesize Body/Head/Tail rig + 8 s Idle',
      'decimate: ratio 0.322995 (278642 -> 90000 tris, 44998 verts); <= 90000 target',
      'scale: source body length 1.9627 Blender units -> 9.0 m; uniform factor 4.585533 applied to mesh data',
      'grounding (land): shifted z by +1.71831 m so the lowest vertex rests at z=0',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, LINEAR per-frame keys; Body breathes for two cycles at +/-1.8% width, +/-1.2% height, +/-0.4% length about a z=0 bone origin; Head combines a slow +/-5.5 deg look and two-cycle +/-2.0 deg nod; Tail combines a three-cycle +/-7.0 deg sway with a slow +/-1.5 deg lift; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Corythosaurus” by TotalDino, CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Corythosaurus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-18',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 8ca48837f35c6ade7bed7e352d04325f807789fada29b2c7d823ef01f19a7a70) rendered with seed 52597444 for the land habitat.',
      sha256: '8ca48837f35c6ade7bed7e352d04325f807789fada29b2c7d823ef01f19a7a70',
      bytes: 13351,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'ea998c1a9a066c9a670ab0039bfe583d5a00ac2a231e136a480e6f03ee7bd360',
      bytes: 14156,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Corythosaurus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Corythosaurus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-18',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 8ca48837f35c6ade7bed7e352d04325f807789fada29b2c7d823ef01f19a7a70) rendered with seed 52597444 for the land habitat.',
      sha256: '8ca48837f35c6ade7bed7e352d04325f807789fada29b2c7d823ef01f19a7a70',
      bytes: 13351,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'b3d1bbb3042ab034facab687fc45b486d388722d80b7fbb119415a4ea1b76ffa',
      bytes: 8030,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Corythosaurus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Corythosaurus transparent model still',
      generatedOn: '2026-08-18',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 1200 × 675 landscape runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: '3d9ae59860927a0a103910bc91cdb49d7d368a023f4e6c81f8aff7fc032a5698',
      bytes: 12938,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Corythosaurus” by TotalDino, CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Corythosaurus transparent portrait model still',
      generatedOn: '2026-08-18',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 390 × 844 portrait runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: 'f77717422651aae076276df06e8a5785226be6e521a6740a09c72d70eb451350',
      bytes: 3518,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Corythosaurus” by TotalDino, CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Corythosaurus collection thumbnail',
      generatedOn: '2026-08-18',
      inputAssetPaths: [
        'model/model.glb',
        'backgrounds/landscape.webp',
      ],
      method: 'Deterministic square crop from the accepted desktop review presentation after hiding all interface chrome.',
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: 'daccc951b75036a3834986ec561b1762b3b641bda0c115cf145ed1f8a3be7ca3',
      bytes: 3204,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Corythosaurus” by TotalDino, CC-BY-4.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Corythosaurus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: '这是冠龙，学名是Corythosaurus casuarius。看看它醒目的“helmet crest”外形，再观察轻轻的呼吸、转头和尾部动作。',
      sha256: 'a3282fd434373643b3dc3dca30c854fcd36ff8d5f47967064edd582ae46c44e4',
      bytes: 104108,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'a3282fd434373643b3dc3dca30c854fcd36ff8d5f47967064edd582ae46c44e4',
      bytes: 104108,
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
      title: 'Corythosaurus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-17',
      prompt: 'This is Corythosaurus, a prehistoric animal known as Corythosaurus casuarius. Look for its helmet crest. Watch the gentle breathing, head movement and tail motion that make this reconstruction feel alert.',
      sha256: '5ecd1839895993c711bd385c20f7d6072147b89e77bf06bb06f13872b329fa4a',
      bytes: 144428,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '5ecd1839895993c711bd385c20f7d6072147b89e77bf06bb06f13872b329fa4a',
      bytes: 144428,
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
