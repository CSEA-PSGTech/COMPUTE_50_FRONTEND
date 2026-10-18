import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isMuted, soundTick, unlockAudio } from '../../lib/sound';

/** Global click sound ticks and page navigation ticks */
export const SoundEffects: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const lastClickTimeRef = useRef<number>(0);

  // Play tick on page navigation/back (e.g. browser back/forward buttons)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // If navigation happened via link click, the click already played tick.
    // Only play tick if navigation was triggered without a recent click (e.g. browser back/forward).
    if (Date.now() - lastClickTimeRef.current >= 350) {
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

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });

    const isNoSound = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(target.closest('[data-nosound]'));
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isMuted()) return;
      if (isNoSound(e.target)) return;

      const el = (e.target as Element).closest?.('button, a[href], [role="button"]') ?? null;
      if (el && !el.closest('[data-nosound]')) {
        lastClickTimeRef.current = Date.now();
        unlockAudio();
        // Play foley-tick.wav
        soundTick();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null;
};
