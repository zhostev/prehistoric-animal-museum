export {
  NARRATION_UNAVAILABLE_LABEL,
  NarrationController,
  getNarrationControlLabel,
} from './narration-controller'
export type {
  NarrationAvailability,
  NarrationControlLabels,
  NarrationControllerOptions,
  NarrationMedia,
  NarrationMediaFactory,
  NarrationPlayback,
  NarrationPlayResult,
  NarrationSnapshot,
  NarrationTrack,
} from './narration-controller'

export {
  VocalController,
} from './vocal-controller'
export type {
  VocalSnapshot,
  VocalControllerOptions,
} from './vocal-controller'

export {
  ANIMAL_VOCAL_ARCHETYPES,
  getAnimalVocalArchetype,
  synthesizeAnimalVocal,
} from './vocal-synthesizer'
export type {
  VocalArchetype,
} from './vocal-synthesizer'
