import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { soundReveal, soundModalClose } from '../../lib/sound';
import { HolographicDevTeamSection } from './HolographicDevTeamSection';

export const RepellingTeamOrb: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleToggle = () => {
    if (isRevealed) {
      soundModalClose();
      setIsRevealed(false);
    } else {
      soundReveal();
      setIsRevealed(true);
    }
  };

  const handleClose = () => {
    soundModalClose();
    setIsRevealed(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Clean static "Meet the Team" trigger button with Users icon */}
      <div className="my-4 text-center select-none">
        <button
          type="button"
          onClick={handleToggle}
          data-nosound="true"
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-xs cursor-pointer active:scale-95"
          aria-label={isRevealed ? 'Hide team' : 'Meet the Team'}
        >
          {/* Subtle Ambient Hover Glow */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: '0 0 16px rgba(var(--accent-rgb), 0.25)',
            }}
          />

          <Users className="w-4 h-4 text-[var(--accent)] transition-transform group-hover:scale-110" />
          <span className="tracking-wide uppercase font-bold text-xs">
            {isRevealed ? 'Hide Team' : 'Meet the Team'}
          </span>
        </button>
      </div>

      {/* Holographic Dev Team Section Revealed on Click */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <HolographicDevTeamSection onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RepellingTeamOrb;
