import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isMuted, soundTick, unlockAudio } from '../../lib/sound';

let lastGlobalClickTime = 0;

/** Global click sound ticks and page navigation ticks */
export const SoundEffects: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Play tick on page navigation/back (e.g. browser back/forward buttons)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // If navigation happened via link click, the click already played tick.
    // Only play tick if navigation was triggered without a recent click (e.g. browser back/forward).
    if (Date.now() - lastGlobalClickTime >= 400) {
      soundTick();
    }
  }, [location.pathname]);

  useEffect(() => {
    // Unlock Web Audio on first user gesture if not muted
    const handleFirstGesture = () => {
      if (!isMuted()) {
        unlockAudio();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    const isNoSound = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(target.closest('[data-nosound]'));
    };

    // Use standard 'click' event instead of 'pointerdown'.
    // On mobile touch devices, 'pointerdown' fires on scroll/swipe touchstart,
    // which caused accidental audio clicks while scrolling. 'click' only fires on intentional taps.
    const handleClick = (e: MouseEvent) => {
      if (isMuted()) return;
      if (isNoSound(e.target)) return;

      const el = (e.target as Element).closest?.('button, a[href], [role="button"]') ?? null;
      if (el && !el.closest('[data-nosound]')) {
        lastGlobalClickTime = Date.now();
        unlockAudio();
        // Play subtle foley-tick.wav
        soundTick();
      }
    };

    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
};
