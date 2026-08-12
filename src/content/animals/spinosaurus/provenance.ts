import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'generated',
      title: 'Spinosaurus deterministic procedural model source',
      tool: 'Blender Python generator authored by the Prehistoric Animal Museum',
      generatedOn: '2026-08-11',
      prompt: 'Project-authored procedural model generated from the archived Blender Python generator; the retained generator script is the reproducible source.',
      sha256: '376527519bb886be5e06edf40c6c0bcf32482e2779281979b908bc98e0456202',
      bytes: 24325,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'fe6862179e5d0acb9c2a1a9f948f5588f6b6fe40e2bb6dcc28369194e4fcdf11',
      bytes: 496640,
    },
    modifications: [
      'Added deterministic project-authored procedural baked textures (Smart UV unwrap + Cycles diffuse bake, texture_materials.py); geometry, rig and Idle animation unchanged.',
      'Normalized orientation, scale and grounding; retimed to one closed eight-second LINEAR Idle.',
    ],
    attribution: '“Spinosaurus” by Prehistoric Animal Museum (project-authored), CC-BY-NC-SA-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Spinosaurus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 440d1f99b42e344615e67171ab97400faa07f2ceca988e458dfa8ceae8b572e7) rendered with seed 1181698365 for the land habitat.',
      sha256: '440d1f99b42e344615e67171ab97400faa07f2ceca988e458dfa8ceae8b572e7',
      bytes: 13319,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'd0bd0a9b979e06e2e55a6d4551e1935c094653afce6343b18b73fae1ab46780e',
      bytes: 14852,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Spinosaurus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Spinosaurus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 440d1f99b42e344615e67171ab97400faa07f2ceca988e458dfa8ceae8b572e7) rendered with seed 1181698365 for the land habitat.',
      sha256: '440d1f99b42e344615e67171ab97400faa07f2ceca988e458dfa8ceae8b572e7',
      bytes: 13319,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'b311d84c39e5c6ce6773d8d5a739a08a5fc740d09990a81685de361147774b17',
      bytes: 8868,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Spinosaurus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Spinosaurus transparent model still',
      generatedOn: '2026-08-11',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 1200 × 675 landscape runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '5be2572debe4f2b6fce79d2af69f12c3d1cdf15ca5fa233347c3397a62a9bcdd',
      bytes: 10408,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Spinosaurus” by Prehistoric Animal Museum (project-authored), CC-BY-NC-SA-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Spinosaurus transparent portrait model still',
      generatedOn: '2026-08-11',
      inputAssetPaths: [
        'model/model.glb',
      ],
      method: 'Rendered the deterministic first animation frame at the normal 390 × 844 portrait runtime camera, composition, size, pose, and lighting; preserved transparent pixels outside the model and contact shadow.',
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '6bacf9995aa1cd77f91d7f81ee688a89d0962e520a68b7bdc4699625bee957b3',
      bytes: 3206,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Spinosaurus” by Prehistoric Animal Museum (project-authored), CC-BY-NC-SA-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Spinosaurus collection thumbnail',
      generatedOn: '2026-08-11',
      inputAssetPaths: [
        'model/model.glb',
        'backgrounds/landscape.webp',
      ],
      method: 'Deterministic square crop from the accepted desktop review presentation after hiding all interface chrome.',
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'c3180c87f989a9d9dbf4eb55e3d7fcdc0e89223b80d59d1e58e23b677433eaff',
      bytes: 2194,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Spinosaurus” by Prehistoric Animal Museum (project-authored), CC-BY-NC-SA-4.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Spinosaurus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: '这是棘龙，一种生活在晚白垩世北非河流环境附近的大型肉食性恐龙。看看它背上高高的帆和细长的吻部，像不像一只为河岸生活特别改造的大型猎手？',
      sha256: 'd0031c7a273156d08f4ff173d48f3870ab0f54efecd44656dd118a26f12f3014',
      bytes: 118316,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'd0031c7a273156d08f4ff173d48f3870ab0f54efecd44656dd118a26f12f3014',
      bytes: 118316,
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
      title: 'Spinosaurus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: 'This is Spinosaurus, a giant meat-eating dinosaur that lived around North African rivers in the early Late Cretaceous. Look at its tall back sail and long narrow snout. Does it look like a giant hunter specially shaped for life around rivers?',
      sha256: '89674eaff77196f96ffd0efa211d6638e24f7f68c3ddfa32e6a412c5f82efcd7',
      bytes: 165548,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '89674eaff77196f96ffd0efa211d6638e24f7f68c3ddfa32e6a412c5f82efcd7',
      bytes: 165548,
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
