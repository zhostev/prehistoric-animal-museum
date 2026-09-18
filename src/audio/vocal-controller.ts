import { synthesizeAnimalVocal } from './vocal-synthesizer'
import type { NarrationController } from './narration-controller'

export interface VocalSnapshot {
  readonly isRoaring: boolean
  readonly activeAnimalId: string | null
}

export interface VocalControllerOptions {
  readonly audioContext?: AudioContext | null
  readonly synthesize?: (ctx: AudioContext, animalId: string) => Promise<void> | void
}

type Listener = () => void

export class VocalController {
  readonly getSnapshot = (): VocalSnapshot => this.snapshot

  readonly getServerSnapshot = (): VocalSnapshot => this.snapshot

  readonly subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private snapshot: VocalSnapshot = {
    isRoaring: false,
    activeAnimalId: null,
  }

  private readonly listeners = new Set<Listener>()
  private audioContext: AudioContext | null = null
  private readonly synthesize: (ctx: AudioContext, animalId: string) => Promise<void> | void
  private timerId: ReturnType<typeof setTimeout> | null = null
  private currentNarration: NarrationController | null = null

  constructor(options: VocalControllerOptions = {}) {
    this.audioContext = options.audioContext ?? null
    this.synthesize = options.synthesize ?? synthesizeAnimalVocal
  }

  async play(animalId: string, narration?: NarrationController): Promise<void> {
    this.stop()

    this.currentNarration = narration ?? null
    narration?.setDucked(true)

    this.setSnapshot({
      isRoaring: true,
      activeAnimalId: animalId,
    })

    try {
      if (!this.audioContext && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        if (AudioCtx) {
          this.audioContext = new AudioCtx()
        }
      }

      if (this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }
        await this.synthesize(this.audioContext, animalId)
      }
    } catch (err) {
      console.warn('Animal vocalization playback failed:', err)
    }

    this.timerId = setTimeout(() => {
      this.stop(this.currentNarration ?? undefined)
    }, 2400)
  }

  stop(narration?: NarrationController): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }

    const narrationToUnduck = narration ?? this.currentNarration
    narrationToUnduck?.setDucked(false)
    this.currentNarration = null

    if (this.snapshot.isRoaring || this.snapshot.activeAnimalId !== null) {
      this.setSnapshot({
        isRoaring: false,
        activeAnimalId: null,
      })
    }
  }

  destroy(): void {
    this.stop()
    this.listeners.clear()
    if (this.audioContext && typeof this.audioContext.close === 'function') {
      try {
        void this.audioContext.close().catch(() => {})
      } catch {
        // Ignored during cleanup
      }
      this.audioContext = null
    }
  }

  private setSnapshot(snapshot: VocalSnapshot): void {
    this.snapshot = snapshot
    for (const listener of this.listeners) {
      listener()
    }
  }
}
