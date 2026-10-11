import React, { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/layout/BottomNav';
import { BackToTop } from '../components/common/BackToTop';
import { CursorGlow } from '../components/common/CursorGlow';
import { AnnouncementPopup } from '../components/common/AnnouncementPopup';
import { SectionDotNav } from '../components/common/SectionDotNav';

import { ScrollProgressBar } from '../components/common/ScrollProgressBar';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { IntroLoader } from '../components/common/IntroLoader';
import { SoundEffects } from '../components/common/SoundEffects';
import { TexturedBackground } from '../components/common/TexturedBackground';

// Preserves the route element corresponding to the motion.div key so that exiting pages keep rendering their own content during AnimatePresence exit animations
const FrozenOutlet: React.FC = () => {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
};

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors pb-[140px] md:pb-0 relative overflow-x-hidden">
      <TexturedBackground />
      <SoundEffects />
      <ScrollProgressBar />
      <IntroLoader />
      <ScrollToTop />
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <AnnouncementPopup />
      <CursorGlow />
      <Navbar />

      {/* Desktop Section Navigation Dots */}
      <SectionDotNav />

      <main id="main-content" className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <FrozenOutlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BackToTop />
      <BottomNav />
    </div>
  );
};
