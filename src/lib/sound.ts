// Web Audio helper for futuristic UI interaction tones.
// Handles browser autoplay restrictions via auto-resume and user gestures.
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

export const unlockAudio = (): void => {
  if (!isMuted()) {
    getAudioContext();
  }
};

export const tone = (
  freq: number,
  duration = 0.08,
  gain = 0.1,
  glideTo?: number,
  type: OscillatorType = 'sine'
): void => {
  // Hard early exit if muted
  if (isMuted()) return;

  const audio = getAudioContext();
  if (!audio) return;

  const play = () => {
    // Double check mute status before playing scheduled audio
    if (isMuted()) return;

    try {
      const osc = audio.createOscillator();
      const amp = audio.createGain();
      const now = audio.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (glideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), now + duration);
      }

      // Smooth attack & decay using linear ramps
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

  if (audio.state === 'suspended') {
    audio.resume().then(play).catch(() => {});
  } else {
    play();
  }
};

export const soundTap = (): void => {
  if (!isMuted()) {
    tone(580, 0.08, 0.12, 880);
  }
};

export const soundReveal = (): void => {
  if (!isMuted()) {
    tone(320, 0.22, 0.14, 960);
  }
};

export const soundSave = (): void => {
  if (!isMuted()) {
    tone(620, 0.12, 0.14, 1240);
  }
};

export const soundTeamComplete = (): void => {
  if (!isMuted()) {
    tone(520, 0.2, 0.14, 880);
    setTimeout(() => {
      if (!isMuted()) {
        tone(780, 0.3, 0.14, 1400);
      }
    }, 100);
  }
};

export const soundSwitch = (toDark?: boolean): void => {
  if (!isMuted()) {
    if (toDark) {
      tone(440, 0.08, 0.09, 680);
    } else {
      tone(680, 0.08, 0.09, 440);
    }
  }
};

export const soundModalOpen = (): void => {
  if (!isMuted()) {
    tone(380, 0.16, 0.09, 820);
  }
};

export const soundModalClose = (): void => {
  if (!isMuted()) {
    tone(620, 0.09, 0.06, 320);
  }
};
