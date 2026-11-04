import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isMuted, soundTick, unlockAudio } from '../../lib/sound';

let lastGlobalSoundTime = 0;

/** Global click sound ticks and page navigation ticks */
export const SoundEffects: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Play subtle tick on page navigation (e.g. browser back/forward buttons)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (Date.now() - lastGlobalSoundTime >= 350) {
      soundTick();
    }
  }, [location.pathname]);

  useEffect(() => {
    // Unlock Web Audio on first user gesture
    const handleFirstGesture = () => {
      if (!isMuted()) {
        unlockAudio();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    const isNoSound = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(target.closest('[data-nosound]'));
    };

    // Track touch positions to distinguish intentional taps from scrolls with 0ms lag
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchTarget: Element | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      if (isMuted()) return;
      if (isNoSound(e.target)) return;

      const el = (e.target as Element).closest?.('button, a[href], [role="button"]') ?? null;
      if (!el || el.closest('[data-nosound]')) return;

      if (e.pointerType === 'mouse') {
        // Desktop mouse: Play IMMEDIATELY on pointerdown for 0ms instantaneous tactile response
        lastGlobalSoundTime = Date.now();
        unlockAudio();
        soundTick();
      } else {
        // Touch screen: Record start position to verify it's a tap and not a scroll
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        touchStartTime = Date.now();
        touchTarget = el;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return; // Handled on pointerdown
      if (isMuted()) return;
      if (!touchTarget) return;

      const elapsed = Date.now() - touchStartTime;
      const dist = Math.hypot(e.clientX - touchStartX, e.clientY - touchStartY);

      // Tap detection: finger must not have moved more than 10px and duration < 500ms
      // Fires the millisecond the finger lifts with ZERO 300ms mobile browser delay!
      if (dist < 10 && elapsed < 500) {
        lastGlobalSoundTime = Date.now();
        unlockAudio();
        soundTick();
      }

      touchTarget = null;
    };

    const handlePointerCancel = () => {
      touchTarget = null;
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerCancel, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, []);

  return null;
};
