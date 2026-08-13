import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Parasaurolophus',
      author: 'Quaternius',
      url: 'https://quaternius.com/packs/animateddinosaurs.html',
      accessedOn: '2026-08-10',
      sha256: 'd1e050432fdc3ca21da1c562cde1e47a043e753c44a4d531afb289acc34c6e8d',
      bytes: 1101040,
    },
    license: {
      spdx: 'CC0-1.0',
      name: 'CC0 1.0 Universal Public Domain Dedication',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    runtime: {
      sha256: '670414698050432d29af10158ea53845132b1823bf06dfab6b890430254ac2f4',
      bytes: 134800,
    },
    modifications: [
      'pipeline: rigged .blend source, keeping only \'Parasaurolophus_Idle\' retimed to 8 s',
      'action \'Parasaurolophus_Idle\' (0..60 f, BEZIER) resampled to \'Idle\': frames 0..192 at 24 fps = 8.0 s with 3 source cycle(s), one LINEAR key per frame, 102 fcurves; frame 192 resamples frame 0 exactly (seamless loop); pose location channels scaled by 1.000000 (1.0 = armature-space units kept, metres come from the object node scale)',
      'parasaurolophus: source faces Blender -Y; 180 deg Z rotation kept on object node(s) [\'Armature\'] (rigged source: applying to armature data would break bone-local pose fcurves; child meshes inherit the node transform; matches the production maiasaura package) -> head now toward +Y (glTF -Z)',
      'scale: source body length 12.4811 Blender units -> 9.0 m; uniform factor 0.721089 kept on object node(s) [\'Armature\'] (armature-space pose fcurves stay in source units)',
      'grounding (land): shifted z by +0.00680 m so the lowest vertex rests at z=0 (object node translation)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
      'Removed 6 unused source clips after retiming the Idle take.',
    ],
    attribution: '“Parasaurolophus” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Parasaurolophus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 08bb9762a9d8be3f847fc9e01a06bbe198f05b80e83f567047ffb8e20b148197) rendered with seed 3991224688 for the land habitat.',
      sha256: '08bb9762a9d8be3f847fc9e01a06bbe198f05b80e83f567047ffb8e20b148197',
      bytes: 13330,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '76ad698cc7a1dcbb3a7538f9056bfd6e941f8f1b55f37a0d68ab4174720392cf',
      bytes: 15810,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Parasaurolophus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Parasaurolophus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 08bb9762a9d8be3f847fc9e01a06bbe198f05b80e83f567047ffb8e20b148197) rendered with seed 3991224688 for the land habitat.',
      sha256: '08bb9762a9d8be3f847fc9e01a06bbe198f05b80e83f567047ffb8e20b148197',
      bytes: 13330,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '17af207a2f7a1601b975076664339cb0f7d0ab456bc0be9883dddb2e3e1c3e41',
      bytes: 9800,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Parasaurolophus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Parasaurolophus transparent model still',
      generatedOn: '2026-08-13',
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
      sha256: '65d1161e203e52660ae666f219802daf13645ec6a84d37f612a3fd477c5f072e',
      bytes: 13562,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Parasaurolophus” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Parasaurolophus transparent portrait model still',
      generatedOn: '2026-08-13',
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
      sha256: '4e0df83bf4dd942dab86d6d199d7b3721b2bf46c3f89f214a6218b70c95b1a6b',
      bytes: 4220,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Parasaurolophus” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Parasaurolophus collection thumbnail',
      generatedOn: '2026-08-13',
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
      sha256: '98cc23c8398d211917b74fe8ddf8d40ac4e9230196fbf3389f72f03798168f9e',
      bytes: 3422,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Parasaurolophus” by Quaternius, CC0-1.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Parasaurolophus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: '这是副栉龙，一种生活在晚白垩世北美洲的植食性鸭嘴龙类恐龙。看看它脑袋后面那根长长的空心头冠，像不像一根弯曲的长管子？',
      sha256: '747ab960e305011d044823d894edae994e1dbc5e360fc88dd087a83c50f7cb76',
      bytes: 97772,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '747ab960e305011d044823d894edae994e1dbc5e360fc88dd087a83c50f7cb76',
      bytes: 97772,
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
      title: 'Parasaurolophus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-10',
      prompt: 'This is Parasaurolophus, a plant-eating duck-billed dinosaur from Late Cretaceous North America. Look at the long hollow crest behind its head. Does it look like a long curved tube?',
      sha256: '705b630c1da5fe9b98a72afad5802624caf91dae8d7be4df7b287c2af85e7564',
      bytes: 118892,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '705b630c1da5fe9b98a72afad5802624caf91dae8d7be4df7b287c2af85e7564',
      bytes: 118892,
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
