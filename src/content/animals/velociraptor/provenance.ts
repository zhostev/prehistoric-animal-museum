import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Raptor Pack (Standing pose)',
      author: 'Greg Criddle (Noximous)',
      url: 'https://archive.org/details/thingiverse-3784576',
      accessedOn: '2026-08-12',
      sha256: 'f0f140e48918eb9cea64ba0f33b6b47d058aae5038cfa1012d0d4602252d4ed3',
      bytes: 27489484,
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: '8004180e66e6eea54ea7d9f96e02bbaabaad2cdd7c243e25d2e732a3f6777e9b',
      bytes: 5932980,
    },
    modifications: [
      'pipeline: static sculpt (velociraptor) -> keep configured meshes, author materials, optional normal bake, synthesize Body/Head/Tail rig + 8 s Idle',
      'velociraptor: source faces Blender -Y; rotated 180 deg about Z, applied to mesh data -> head now toward +Y (glTF -Z)',
      'decimate: ratio 0.163699 (549788 -> 90000 tris, 44741 verts); <= 90000 target',
      'scale: source body length 39.4398 Blender units -> 2.0 m; uniform factor 0.050710 applied to mesh data',
      'grounding (land): shifted z by +0.00000 m so the lowest vertex rests at z=0',
      'armature synthesized: 3 bones [\'Body\', \'Head\', \'Tail\']',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, LINEAR per-frame keys; Body breathes for two cycles at +/-1.8% width, +/-1.2% height, +/-0.4% length about a z=0 bone origin; Head combines a slow +/-5.5 deg look and two-cycle +/-2.0 deg nod; Tail combines a three-cycle +/-7.0 deg sway with a slow +/-1.5 deg lift; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Raptor Pack (Standing pose)” by Greg Criddle (Noximous), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Raptor Pack (Standing pose) habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 ccacef4a64ef146bb951bda5c02f57e40c6634872027b92387bb133bb1e3125c) rendered with seed 4036161673 for the land habitat.',
      sha256: 'ccacef4a64ef146bb951bda5c02f57e40c6634872027b92387bb133bb1e3125c',
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
    attribution: 'Project-generated Raptor Pack (Standing pose) landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Raptor Pack (Standing pose) habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-13',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 ccacef4a64ef146bb951bda5c02f57e40c6634872027b92387bb133bb1e3125c) rendered with seed 4036161673 for the land habitat.',
      sha256: 'ccacef4a64ef146bb951bda5c02f57e40c6634872027b92387bb133bb1e3125c',
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
    attribution: 'Project-generated Raptor Pack (Standing pose) portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Raptor Pack (Standing pose) transparent model still',
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
      sha256: '87c85ebab54daae36f97712c4bc782dac6d761d5093dfa6dc20a1ee375e9ddbd',
      bytes: 23978,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Raptor Pack (Standing pose)” by Greg Criddle (Noximous), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Raptor Pack (Standing pose) transparent portrait model still',
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
      sha256: '0712ebdcdcb64a1fbe0dc39942a87d7a5d0a9ea3f6a98a8b0bcad575dc1d90e3',
      bytes: 6050,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Raptor Pack (Standing pose)” by Greg Criddle (Noximous), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Raptor Pack (Standing pose) collection thumbnail',
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
      sha256: '0bcfa38ae5d58cccdd7e81b4f6d0e65266ebe6ea2152134690f8fb4b4880ab9f',
      bytes: 5318,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Raptor Pack (Standing pose)” by Greg Criddle (Noximous), CC-BY-4.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Raptor Pack (Standing pose) Mandarin narration',
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
      title: 'Raptor Pack (Standing pose) English narration',
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
