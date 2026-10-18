import React, { useEffect } from 'react';
import { isMuted, tone, unlockAudio } from '../../lib/sound';

const HOVER_TARGETS = 'button, a[href], [class*="hover:border-"], [role="button"]';

/** Global, futuristic hover and click sound ticks */
export const SoundEffects: React.FC = () => {
  useEffect(() => {
    let last: Element | null = null;

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

    const handlePointerOver = (e: PointerEvent) => {
      if (isMuted()) return;
      if (e.pointerType === 'touch') return;
      if (isNoSound(e.target)) {
        last = null;
        return;
      }

      const el = (e.target as Element).closest?.(HOVER_TARGETS) ?? null;
      if (el && !el.closest('[data-nosound]')) {
        if (el !== last) {
          last = el;
          // Gentle, warm tactile hover tick (soft 30ms sine pulse)
          tone(620, 0.03, 0.03);
        }
      } else {
        last = null;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isMuted()) return;
      if (isNoSound(e.target)) return;

      const el = (e.target as Element).closest?.('button, a[href], [role="button"]') ?? null;
      if (el && !el.closest('[data-nosound]')) {
        unlockAudio();
        // Soft tactile confirmation click
        tone(520, 0.06, 0.08, 760);
      }
    };

    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null;
};
