/**
 * Bio-acoustic Web Audio physical synthesizer for prehistoric animals.
 * Generates procedural, zero-latency, zero-download vocalizations
 * tailored to palaeontological cranial & vocal tract archetypes.
 */

export type VocalArchetype =
  | 'apex_theropod'
  | 'sabertooth_feline'
  | 'hadrosaur_crest'
  | 'sauropod_infrasound'
  | 'proboscidean'
  | 'pterosaur_avian'
  | 'marine_behemoth'
  | 'armored_herbivore'
  | 'arthropod_drone'

export const ANIMAL_VOCAL_ARCHETYPES: Readonly<Record<string, VocalArchetype>> = {
  // Apex theropods & large carnivores
  'tyrannosaurus-rex': 'apex_theropod',
  spinosaurus: 'apex_theropod',
  allosaurus: 'apex_theropod',
  carcharodontosaurus: 'apex_theropod',
  carnotaurus: 'apex_theropod',
  ceratosaurus: 'apex_theropod',
  albertosaurus: 'apex_theropod',
  acrocanthosaurus: 'apex_theropod',
  baryonyx: 'apex_theropod',
  gigantoraptor: 'apex_theropod',

  // Felines
  smilodon: 'sabertooth_feline',

  // Hadrosaurs (Cranial crest acoustic resonators)
  parasaurolophus: 'hadrosaur_crest',
  corythosaurus: 'hadrosaur_crest',
  maiasaura: 'hadrosaur_crest',
  edmontosaurus: 'hadrosaur_crest',

  // Giant Sauropods (Infrasound deep body resonance)
  brachiosaurus: 'sauropod_infrasound',
  diplodocus: 'sauropod_infrasound',
  apatosaurus: 'sauropod_infrasound',
  argentinosaurus: 'sauropod_infrasound',

  // Proboscideans & Megafauna
  mammoth: 'proboscidean',
  megaloceros: 'proboscidean',

  // Pterosaurs & Agoraphobic small theropods/avians
  pteranodon: 'pterosaur_avian',
  quetzalcoatlus: 'pterosaur_avian',
  tupandactylus: 'pterosaur_avian',
  anhanguera: 'pterosaur_avian',
  rhamphorhynchus: 'pterosaur_avian',
  microraptor: 'pterosaur_avian',
  velociraptor: 'pterosaur_avian',
  deinonychus: 'pterosaur_avian',
  compsognathus: 'pterosaur_avian',
  dilophosaurus: 'pterosaur_avian',

  // Marine behemoths & paleo-aquatic predators
  megalodon: 'marine_behemoth',
  mosasaurus: 'marine_behemoth',
  plesiosaurus: 'marine_behemoth',
  elasmosaurus: 'marine_behemoth',
  ichthyosaur: 'marine_behemoth',
  ophthalmosaurus: 'marine_behemoth',
  dunkleosteus: 'marine_behemoth',

  // Armored herbivores & basal reptiles
  triceratops: 'armored_herbivore',
  ankylosaurus: 'armored_herbivore',
  stegosaurus: 'armored_herbivore',
  sauropelta: 'armored_herbivore',
  pachycephalosaurus: 'armored_herbivore',
  dimetrodon: 'armored_herbivore',
  herrerasaurus: 'armored_herbivore',
  glyptodon: 'armored_herbivore',

  // Ancient arthropods & invertebrates
  meganeura: 'arthropod_drone',
  anomalocaris: 'arthropod_drone',
  jaekelopterus: 'arthropod_drone',
  ammonite: 'arthropod_drone',
}

export function getAnimalVocalArchetype(animalId: string): VocalArchetype {
  return ANIMAL_VOCAL_ARCHETYPES[animalId] ?? 'armored_herbivore'
}

/**
 * Creates a white noise audio buffer for airflow and throat friction simulation.
 */
function createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const bufferSize = Math.floor(sampleRate * durationSeconds)
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

/**
 * Procedurally synthesizes a biologically plausible vocal call in AudioContext.
 * Injects organic micro-variations so each playback is unique.
 */
export function synthesizeAnimalVocal(
  ctx: AudioContext,
  animalId: string,
): void {
  const archetype = getAnimalVocalArchetype(animalId)
  const now = ctx.currentTime

  // Organic jitter (±3% to ±5%)
  const jitter = 1.0 + (Math.random() * 0.08 - 0.04)

  const masterGain = ctx.createGain()
  masterGain.connect(ctx.destination)
  masterGain.gain.setValueAtTime(0.75, now)

  switch (archetype) {
    case 'apex_theropod': {
      // Deep guttural roar: low saw sweeping down + resonant formant filter + roar noise burst
      const duration = 2.1 * jitter
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const roarGain = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'triangle'

      const startFreq = 160 * jitter
      const endFreq = 62 * jitter
      osc1.frequency.setValueAtTime(startFreq, now)
      osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.7)
      osc2.frequency.setValueAtTime(startFreq * 0.98, now)
      osc2.frequency.exponentialRampToValueAtTime(endFreq * 0.98, now + duration * 0.7)

      filter.type = 'bandpass'
      filter.Q.value = 3.5
      filter.frequency.setValueAtTime(280 * jitter, now)
      filter.frequency.linearRampToValueAtTime(140 * jitter, now + duration)

      roarGain.gain.setValueAtTime(0.001, now)
      roarGain.gain.linearRampToValueAtTime(0.85, now + 0.25)
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(roarGain)
      roarGain.connect(masterGain)

      // Add chest breath noise
      const noise = ctx.createBufferSource()
      noise.buffer = createNoiseBuffer(ctx, duration)
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'lowpass'
      noiseFilter.frequency.setValueAtTime(320, now)
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.001, now)
      noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.3)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(masterGain)

      osc1.start(now)
      osc2.start(now)
      noise.start(now)
      osc1.stop(now + duration)
      osc2.stop(now + duration)
      noise.stop(now + duration)
      break
    }

    case 'sabertooth_feline': {
      // Deep predatory feline snarl: FM growl + high breath/tooth hiss
      const duration = 1.8 * jitter
      const carrier = ctx.createOscillator()
      const modulator = ctx.createOscillator()
      const modGain = ctx.createGain()
      const felineGain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      carrier.type = 'sawtooth'
      modulator.type = 'sine'

      // FM parameters for throat purr/snarl flutter
      const baseFreq = 185 * jitter
      carrier.frequency.setValueAtTime(baseFreq, now)
      carrier.frequency.linearRampToValueAtTime(baseFreq * 1.25, now + 0.4)
      carrier.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, now + duration)

      modulator.frequency.setValueAtTime(34, now)
      modGain.gain.setValueAtTime(80, now)

      modulator.connect(carrier.frequency)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(550 * jitter, now)
      filter.Q.value = 2.0

      felineGain.gain.setValueAtTime(0.001, now)
      felineGain.gain.linearRampToValueAtTime(0.9, now + 0.18)
      felineGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      carrier.connect(filter)
      filter.connect(felineGain)
      felineGain.connect(masterGain)

      // Tooth-hiss noise
      const hiss = ctx.createBufferSource()
      hiss.buffer = createNoiseBuffer(ctx, duration)
      const hissFilter = ctx.createBiquadFilter()
      hissFilter.type = 'bandpass'
      hissFilter.frequency.value = 2200
      hissFilter.Q.value = 2.5
      const hissGain = ctx.createGain()
      hissGain.gain.setValueAtTime(0.001, now)
      hissGain.gain.linearRampToValueAtTime(0.25, now + 0.2)
      hissGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      hiss.connect(hissFilter)
      hissFilter.connect(hissGain)
      hissGain.connect(masterGain)

      carrier.start(now)
      modulator.start(now)
      hiss.start(now)
      carrier.stop(now + duration)
      modulator.stop(now + duration)
      hiss.stop(now + duration)
      break
    }

    case 'hadrosaur_crest': {
      // Resonant cranial tube horn blast (trombone/conch horn)
      const duration = 2.3 * jitter
      const horn = ctx.createOscillator()
      const hornFilter1 = ctx.createBiquadFilter()
      const hornFilter2 = ctx.createBiquadFilter()
      const hornGain = ctx.createGain()

      horn.type = 'sawtooth'
      const freq = 210 * jitter
      horn.frequency.setValueAtTime(freq * 0.9, now)
      horn.frequency.linearRampToValueAtTime(freq * 1.08, now + 0.4)
      horn.frequency.exponentialRampToValueAtTime(freq * 0.92, now + duration)

      hornFilter1.type = 'bandpass'
      hornFilter1.frequency.value = freq * 1.5
      hornFilter1.Q.value = 5.0

      hornFilter2.type = 'bandpass'
      hornFilter2.frequency.value = freq * 3.0
      hornFilter2.Q.value = 4.0

      hornGain.gain.setValueAtTime(0.001, now)
      hornGain.gain.linearRampToValueAtTime(0.88, now + 0.35)
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      horn.connect(hornFilter1)
      horn.connect(hornFilter2)
      hornFilter1.connect(hornGain)
      hornFilter2.connect(hornGain)
      hornGain.connect(masterGain)

      horn.start(now)
      horn.stop(now + duration)
      break
    }

    case 'sauropod_infrasound': {
      // Sub-bass rumble and heavy exhalation
      const duration = 2.7 * jitter
      const osc = ctx.createOscillator()
      const subOsc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      subOsc.type = 'triangle'

      osc.frequency.setValueAtTime(58 * jitter, now)
      osc.frequency.linearRampToValueAtTime(42 * jitter, now + duration)
      subOsc.frequency.setValueAtTime(29 * jitter, now)
      subOsc.frequency.linearRampToValueAtTime(21 * jitter, now + duration)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.95, now + 0.6)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(gain)
      subOsc.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      subOsc.start(now)
      osc.stop(now + duration)
      subOsc.stop(now + duration)
      break
    }

    case 'proboscidean': {
      // Elephantine/mammoth trumpet
      const duration = 1.7 * jitter
      const trumpet = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      trumpet.type = 'sawtooth'
      trumpet.frequency.setValueAtTime(280 * jitter, now)
      trumpet.frequency.exponentialRampToValueAtTime(490 * jitter, now + 0.35)
      trumpet.frequency.exponentialRampToValueAtTime(240 * jitter, now + duration)

      filter.type = 'peaking'
      filter.frequency.value = 1100
      filter.Q.value = 3.0
      filter.gain.value = 8.0

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.9, now + 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      trumpet.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      trumpet.start(now)
      trumpet.stop(now + duration)
      break
    }

    case 'pterosaur_avian': {
      // Avian-reptilian high screech
      const duration = 1.3 * jitter
      const screech = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      screech.type = 'sawtooth'
      screech.frequency.setValueAtTime(1150 * jitter, now)
      screech.frequency.linearRampToValueAtTime(1850 * jitter, now + 0.25)
      screech.frequency.exponentialRampToValueAtTime(750 * jitter, now + duration)

      filter.type = 'bandpass'
      filter.frequency.value = 1500 * jitter
      filter.Q.value = 3.2

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.75, now + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      screech.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      screech.start(now)
      screech.stop(now + duration)
      break
    }

    case 'marine_behemoth': {
      // Underwater low pulse & aquatic groan
      const duration = 2.2 * jitter
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(95 * jitter, now)
      osc.frequency.linearRampToValueAtTime(65 * jitter, now + duration)

      filter.type = 'lowpass'
      filter.frequency.value = 220
      filter.Q.value = 4.0

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.85, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + duration)
      break
    }

    case 'armored_herbivore': {
      // Heavy nasal snort & bellow
      const duration = 1.6 * jitter
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(110 * jitter, now)
      osc.frequency.exponentialRampToValueAtTime(68 * jitter, now + duration)

      filter.type = 'lowpass'
      filter.frequency.value = 320
      filter.Q.value = 1.8

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.8, now + 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + duration)
      break
    }

    case 'arthropod_drone': {
      // High-speed wing flutter and chitin clicks
      const duration = 1.4 * jitter
      const drone = ctx.createOscillator()
      const flutter = ctx.createOscillator()
      const flutterGain = ctx.createGain()
      const gain = ctx.createGain()

      drone.type = 'sawtooth'
      drone.frequency.setValueAtTime(180 * jitter, now)

      flutter.type = 'square'
      flutter.frequency.value = 24
      flutterGain.gain.value = 45

      flutter.connect(drone.frequency)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.65, now + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      drone.connect(gain)
      gain.connect(masterGain)

      drone.start(now)
      flutter.start(now)
      drone.stop(now + duration)
      flutter.stop(now + duration)
      break
    }
  }
}
