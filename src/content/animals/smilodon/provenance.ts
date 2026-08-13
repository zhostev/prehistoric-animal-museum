import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Smilodon',
      author: 'Eric (Tepuitrouble)',
      url: 'https://archive.org/details/thingiverse-4759291',
      accessedOn: '2026-08-11',
      sha256: '6692fab97423b64a7d32e43bb31cb89375ba45b82b952b930aad883c0101e98d',
      bytes: 11642584,
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: 'cf1025e69e0f3112ba4443d8cedb877df567f0bc450494bedf9c85f315ce2bc9',
      bytes: 2621804,
    },
    modifications: [
      'pipeline: unrigged Smilodon STL -> exact pedestal/component check, decimate to the web target, grounded two-bone deformation rig, 8 s breathing + head-sway Idle',
      'smilodon: source faces Blender -Y; rotated 180 deg about Z, applied to mesh data -> head now toward +Y (glTF -Z)',
      'decimate: ratio 0.386515 (232850 -> 90000 tris, 45002 verts); <= 90000 target',
      'scale: source body length 51.8764 Blender units -> 2.1 m; uniform factor 0.040481 applied to mesh data',
      'grounding (land): shifted z by +0.52114 m so the lowest vertex rests at z=0',
      'armature synthesized: 2 bones [\'Body\', \'Head\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, LINEAR per-frame keys; grounded Body breathes for two cycles at +/-1.8% width, +/-1.2% height and +/-0.4% length about a z=0 bone origin while Head combines a slow +/-5.5 deg look with a two-cycle +/-2.0 deg nod; frame 192 repeats frame 0 exactly',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Smilodon” by Eric (Tepuitrouble), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Smilodon habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 3eb15f5d6a5300d1901a19806d01fc3893f7bcc8786627d20e0651b6248b1973) rendered with seed 851121318 for the land habitat.',
      sha256: '3eb15f5d6a5300d1901a19806d01fc3893f7bcc8786627d20e0651b6248b1973',
      bytes: 13311,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '868374d7b189c89daa45f3228049931cba715c5c94cd9424e5e24207bfb3b38f',
      bytes: 15598,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Smilodon landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Smilodon habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 3eb15f5d6a5300d1901a19806d01fc3893f7bcc8786627d20e0651b6248b1973) rendered with seed 851121318 for the land habitat.',
      sha256: '3eb15f5d6a5300d1901a19806d01fc3893f7bcc8786627d20e0651b6248b1973',
      bytes: 13311,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'b904f2556d2df36f295971b9c669b63ecb91e4c7aa32e1392d0795641a40e58d',
      bytes: 9920,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Smilodon portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Smilodon transparent model still',
      generatedOn: '2026-08-13',
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
      sha256: '427488c1305e17fa7b2123a16266da055708881bf0bd5f057a5de05a58b2d00d',
      bytes: 16180,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Smilodon” by Eric (Tepuitrouble), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Smilodon transparent portrait model still',
      generatedOn: '2026-08-13',
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
      sha256: 'd9030d640e5c142cc50171c4a7015ca7f196e25e6f922a9c55dc9b5ea217f1d1',
      bytes: 5498,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Smilodon” by Eric (Tepuitrouble), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Smilodon collection thumbnail',
      generatedOn: '2026-08-13',
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
      sha256: 'e293052835b8da7ce400c5db4f67c81a60835838142937a5c2b010458d025991',
      bytes: 4248,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Smilodon” by Eric (Tepuitrouble), CC-BY-4.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Smilodon Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: '这是剑齿虎，一类生活在美洲、长着扁长上犬齿的肉食性猫科动物。看看它上颌伸出的两枚扁长犬齿，像不像两把收在嘴边的弯刀？',
      sha256: '02ee3670ead964923d0247fa239940982fdc0ee908b2ba6fe2887c4d897e5926',
      bytes: 106028,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '02ee3670ead964923d0247fa239940982fdc0ee908b2ba6fe2887c4d897e5926',
      bytes: 106028,
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
      title: 'Smilodon English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: 'This is Smilodon, a meat-eating cat from the Americas with long, flattened upper canine teeth. Look at the two long, flattened upper canines. Do they look like curved blades resting beside its mouth?',
      sha256: '0083f1175ae61845807453b6192c844ab778059a6def0ad55e1524aa37b07c91',
      bytes: 138668,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '0083f1175ae61845807453b6192c844ab778059a6def0ad55e1524aa37b07c91',
      bytes: 138668,
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
