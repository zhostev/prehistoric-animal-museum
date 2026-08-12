import type { AssetProvenance } from '../../types'

export const provenance = [
  {
    assetPath: 'model/model.glb',
    kind: 'model',
    source: {
      type: 'third-party',
      title: 'Jaekelopterus',
      author: 'chris mckenzie (dinoking27)',
      url: 'https://archive.org/details/thingiverse-4702654',
      accessedOn: '2026-08-11',
      sha256: '1344b4843ecbde4321f2fffc903442a4cda5d13ebf87b138c0e136d9ea6281ac',
      bytes: 3014284,
    },
    license: {
      spdx: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    runtime: {
      sha256: 'c90667b959ee191f5ef32b2441b6a72fbac53f18740471935290f254c446c0b7',
      bytes: 3333064,
    },
    modifications: [
      'Added deterministic project-authored procedural baked textures (Smart UV unwrap + Cycles diffuse bake, texture_materials.py); geometry, rig and Idle animation unchanged.',
      'pipeline: unrigged static STL (jaekelopterus) -> topology-budget check/decimate, author materials, synthesize 5-bone articulated spine chain + 8 s swim Idle',
      'jaekelopterus: source faces Blender -Y; rotated 180 deg about Z, applied to mesh data -> head now toward +Y (glTF -Z)',
      'shading: smooth (source STL was flat-shaded)',
      'materials authored (source had none): eurypterid body/segments; \'Body\' (0.36, 0.31, 0.22) + \'HeadPlates\' (0.5, 0.43, 0.27), roughness 0.8/0.85; head plates assigned to faces with local centre y > 33.788 (front 30%, the armoured head): 20092/60284 faces; choices remain human-reviewable (humanApprovals.materials stays false)',
      'scale: source body length 168.7734 Blender units -> 2.5 m; uniform factor 0.014813 applied to mesh data',
      'centring (water): shifted by [-0.00038, -0.0005, -0.72229] m so the bounding-box centre sits at the origin (x/y centred, centred vertically in the water column)',
      'armature synthesized: 5-bone spine chain Spine1..Spine5 along -Y (head end y=0.38 m to tail tip y=-1.25 m), roll 0',
      'Idle synthesized: frames 0..192 at 24 fps = 8.0 s, one LINEAR key per frame; lateral wave amplitudes [2.0, 4.0, 7.0, 10.0, 13.0] deg (Spine1->Spine5, travelling phase -0.55 rad/bone), vertical bob +/-0.035 m on the armature object, no root travel; frame 192 repeats frame 0 exactly (seamless loop)',
      'mouth motion stays DISABLED (profile declares mode=disabled); inspection recorded as evidence only',
    ],
    attribution: '“Jaekelopterus” by chris mckenzie (dinoking27), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Jaekelopterus habitat scene — landscape',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 6649b7a3e202cfc961d25b66c29daf56b738a994fb0fd940bc7f8a9529b124b1) rendered with seed 2082533189 for the water habitat.',
      sha256: '6649b7a3e202cfc961d25b66c29daf56b738a994fb0fd940bc7f8a9529b124b1',
      bytes: 18967,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'c5b1ae3a9fdcffb2e3cafde6c9ce13250272cd67759d8ef331296891343a4202',
      bytes: 28744,
    },
    modifications: [
      'Rendered the landscape pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Jaekelopterus landscape habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Jaekelopterus habitat scene — portrait',
      tool: 'Blender 4.5.12 (project-authored habitat scene, deterministic seed)',
      generatedOn: '2026-08-11',
      prompt: 'Deterministic project-authored Blender habitat scene; scene spec qa/derivatives-scene-spec.json (SHA-256 6649b7a3e202cfc961d25b66c29daf56b738a994fb0fd940bc7f8a9529b124b1) rendered with seed 2082533189 for the water habitat.',
      sha256: '6649b7a3e202cfc961d25b66c29daf56b738a994fb0fd940bc7f8a9529b124b1',
      bytes: 18967,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Blender habitat render',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: 'cbd1992bed622cf83262939e4018b7b3e455effc058116cd9dcbeb1f4f87a198',
      bytes: 18928,
    },
    modifications: [
      'Rendered the portrait pass deterministically from the project-authored habitat scene spec with EEVEE Next.',
      'Encoded as lossy WebP at quality 82 without text, logos, UI, or watermarks.',
    ],
    attribution: 'Project-generated Jaekelopterus portrait habitat background rendered by the Prehistoric Animal Museum Blender pipeline.',
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
      title: 'Jaekelopterus transparent model still',
      generatedOn: '2026-08-11',
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
      sha256: 'c13a25c74bbdccbc0824d7b6a896e0bf77adc404ad8b36ef0c3d7c1d80a2621e',
      bytes: 16410,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Jaekelopterus” by chris mckenzie (dinoking27), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Jaekelopterus transparent portrait model still',
      generatedOn: '2026-08-11',
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
      sha256: 'd36d281e7371015a2607657632012f78ad5f05d7b42112e75731afb86cc63584',
      bytes: 4384,
    },
    modifications: [
      'Removed the habitat composite and all interface chrome; kept only the model and contact shadow on a transparent background.',
      'Encoded as exact lossless WebP without text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Jaekelopterus” by chris mckenzie (dinoking27), CC-BY-4.0; modified for the Prehistoric Animal Museum.',
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
      title: 'Jaekelopterus collection thumbnail',
      generatedOn: '2026-08-11',
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
      sha256: '2e693ec56c21b76a7918ea9db97f8696a5eb2d417cf33b41c735c4ce75e68f85',
      bytes: 3150,
    },
    modifications: [
      'Selected a card-size crop that keeps the animal readable.',
      'Exported without embedded text, controls, labels, logos, or watermarks.',
    ],
    attribution: '“Jaekelopterus” by chris mckenzie (dinoking27), CC-BY-4.0; modified for the Prehistoric Animal Museum. Scene art generated for this project.',
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
      title: 'Jaekelopterus Mandarin narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: '模型包内文件名把它标作耶克尔鲎，但来源条目标题写的是巨型鲎属，身份还需要核对。看看它身体前端那对带刺的大附肢，像不像两把用来抓住猎物的钳子？',
      sha256: '573c0deade449fbc7db3d59e649357bb8f679002e9fc03f084fdc4187465564c',
      bytes: 120812,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '573c0deade449fbc7db3d59e649357bb8f679002e9fc03f084fdc4187465564c',
      bytes: 120812,
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
      title: 'Jaekelopterus English narration',
      tool: 'Qwen3-TTS CustomVoice',
      model: 'Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice',
      revision: '85e237c12c027371202489a0ec509ded67b5e4b5; Serena built-in voice; deterministic local generation',
      generatedOn: '2026-08-11',
      prompt: 'The file inside this model package is labelled Jaekelopterus, but the source item is titled Megalograptus, so its identity still needs checking. Look at the big spiny appendages at the front of its body. Do they look like two pincers for holding prey?',
      sha256: '534c0c72e6df12dd699f9e1fa927cbcf7851076638bb8cb1987a24c7b5a2f4ba',
      bytes: 147692,
    },
    license: {
      spdx: 'CC-BY-NC-SA-4.0',
      name: 'CC BY-NC-SA 4.0 project-owned Qwen3-TTS output',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    runtime: {
      sha256: '534c0c72e6df12dd699f9e1fa927cbcf7851076638bb8cb1987a24c7b5a2f4ba',
      bytes: 147692,
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
