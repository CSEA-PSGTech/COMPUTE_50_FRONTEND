// Web Audio helper for futuristic UI interaction tones.
// Handles browser autoplay restrictions via unlockAudio() on user gesture.
const KEY = 'compute50_muted';

let ctx: AudioContext | undefined;
let muted = (() => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
})();

export const isMuted = (): boolean => muted;

export const setMuted = (value: boolean): void => {
  muted = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    /* localStorage unavailable */
  }
};

export const unlockAudio = (): void => {
  try {
    ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
  } catch {
    /* audio unavailable */
  }
};

export const tone = (freq: number, duration: number, gain = 0.04, glideTo?: number): void => {
  if (muted || !ctx) return;
  try {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const t = ctx.currentTime;
    osc.frequency.value = freq;
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, t + duration);
    }
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.03);
  } catch {
    /* ignore audio errors */
  }
};

export const soundTap = (): void => {
  unlockAudio();
  tone(520, 0.06, 0.03, 780);
};

export const soundReveal = (): void => {
  unlockAudio();
  tone(220, 0.3, 0.05, 880);
};

export const soundSave = (): void => {
  unlockAudio();
  tone(587, 0.12, 0.05, 1174);
};

export const soundTeamComplete = (): void => {
  unlockAudio();
  tone(440, 0.25, 0.06, 880);
  setTimeout(() => tone(659, 0.35, 0.06, 1318), 120);
};
