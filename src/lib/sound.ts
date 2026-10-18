// Web Audio & Foley Sound Engine for Compute 50 UI Interactions.
// Supports low-latency Web Audio buffer playback with HTML5 Audio fallback.

const KEY = 'compute50_muted';

let ctx: AudioContext | undefined;
let inMemoryMuted = false;

// Initialize in-memory mute state from localStorage safely
try {
  const stored = localStorage.getItem(KEY);
  if (stored !== null) {
    inMemoryMuted = stored === '1';
  }
} catch {
  inMemoryMuted = false;
}

export const isMuted = (): boolean => {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) {
      return stored === '1';
    }
  } catch {
    /* localStorage unavailable */
  }
  return inMemoryMuted;
};

export const setMuted = (value: boolean): void => {
  inMemoryMuted = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
    // Notify all listeners and components in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('compute50_sound_toggle', { detail: { muted: value } })
      );
    }
  } catch {
    /* localStorage unavailable */
  }
};

export const getAudioContext = (): AudioContext | undefined => {
  if (isMuted()) return undefined;

  try {
    if (!ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return undefined;
  }
};

// =========================================================================
// FOLEY AUDIO FILES & ZERO-LATENCY WEB AUDIO BUFFER PLAYBACK
// =========================================================================

export type SoundEffectName =
  | 'tick'
  | 'hover'
  | 'swoosh'
  | 'on'
  | 'warning'
  | 'success';

const SOUND_CONFIG: Record<SoundEffectName, { url: string; volume: number }> = {
  tick: { url: '/sounds/foley-tick.wav', volume: 0.45 },
  hover: { url: '/sounds/foley-hover.wav', volume: 0.2 },
  swoosh: { url: '/sounds/foley-tick.wav', volume: 0.45 },
  on: { url: '/sounds/foley-on.wav', volume: 0.45 },
  warning: { url: '/sounds/foley-warning.wav', volume: 0.55 },
  success: { url: '/sounds/foley-success.wav', volume: 0.55 },
};

const audioBufferCache: Partial<Record<SoundEffectName, AudioBuffer>> = {};
const bufferFetchPromises: Partial<Record<SoundEffectName, Promise<AudioBuffer | null>>> = {};

// Preload and decode a sound buffer in memory
const loadBuffer = async (name: SoundEffectName): Promise<AudioBuffer | null> => {
  if (audioBufferCache[name]) return audioBufferCache[name]!;
  if (bufferFetchPromises[name]) return bufferFetchPromises[name]!;

  const audio = getAudioContext();
  if (!audio) return null;

  bufferFetchPromises[name] = (async () => {
    try {
      const res = await fetch(SOUND_CONFIG[name].url);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await audio.decodeAudioData(arrayBuffer);
      audioBufferCache[name] = decoded;
      return decoded;
    } catch {
      return null;
    }
  })();

  return bufferFetchPromises[name]!;
};

// Preload all sounds on first user interaction for zero latency
export const preloadSounds = (): void => {
  if (isMuted()) return;
  (Object.keys(SOUND_CONFIG) as SoundEffectName[]).forEach((name) => {
    void loadBuffer(name);
  });
};

export const unlockAudio = (): void => {
  if (!isMuted()) {
    getAudioContext();
    preloadSounds();
  }
};

/**
 * Plays a mapped foley audio effect.
 * Uses Web Audio Buffer for 0ms latency; gracefully falls back to HTMLAudioElement.
 */
export const playSound = (name: SoundEffectName, customVolume?: number): void => {
  if (isMuted()) return;

  const config = SOUND_CONFIG[name];
  if (!config) return;
  const volume = customVolume ?? config.volume;

  const audio = getAudioContext();
  if (audio) {
    if (audioBufferCache[name]) {
      try {
        const source = audio.createBufferSource();
        source.buffer = audioBufferCache[name]!;
        const gainNode = audio.createGain();
        gainNode.gain.setValueAtTime(volume, audio.currentTime);
        source.connect(gainNode);
        gainNode.connect(audio.destination);
        source.start(0);
        return;
      } catch {
        // Fallback to HTMLAudioElement
      }
    } else {
      void loadBuffer(name);
    }
  }

  // Fallback to HTMLAudioElement
  try {
    const fallbackAudio = new Audio(config.url);
    fallbackAudio.volume = Math.min(1, Math.max(0, volume));
    void fallbackAudio.play().catch(() => {});
  } catch {
    // Ignore autoplay or audio restriction
  }
};

// =========================================================================
// MAPPED INTERACTION SOUND FUNCTIONS
// =========================================================================

/** 1. Button click: foley-tick.wav */
export const soundTick = (): void => playSound('tick');
export const soundTap = (): void => playSound('tick');

/** 2. Hover disabled per user request */
export const soundHover = (): void => {};

/** 3. Page transition: replaced swoosh with foley-tick.wav per user preference */
export const soundSwoosh = (): void => playSound('tick');

/** 4. Toggling (theme switch or mute icon): foley-on.wav */
export const soundSwitch = (_toDark?: boolean): void => playSound('on');
export const soundToggle = (): void => playSound('on');

/** 5. Incorrect password / validation error: foley-warning.wav */
export const soundWarning = (): void => playSound('warning');

/** 6. Correct password / registration success: foley-success.wav */
export const soundSuccess = (): void => playSound('success');
export const soundSave = (): void => playSound('success');
export const soundTeamComplete = (): void => playSound('success');

/** Reveal / unroll animation (uses tick) */
export const soundReveal = (): void => playSound('tick');

/** Modal open / close */
export const soundModalOpen = (): void => playSound('tick');
export const soundModalClose = (): void => playSound('tick');

// Fallback oscillator tone generator (retained for backward compatibility)
export const tone = (
  freq: number,
  duration = 0.08,
  gain = 0.1,
  glideTo?: number,
  type: OscillatorType = 'sine'
): void => {
  if (isMuted()) return;
  const audio = getAudioContext();
  if (!audio) return;

  try {
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    const now = audio.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), now + duration);
    }

    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.008);
    amp.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(amp);
    amp.connect(audio.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    /* ignore audio errors */
  }
};
