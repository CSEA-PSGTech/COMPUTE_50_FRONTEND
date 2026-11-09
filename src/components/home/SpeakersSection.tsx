import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockSpeakers } from '../../data/speakers';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Users, User, Layers, ChevronRight, ChevronLeft, RotateCcw, X } from 'lucide-react';
import { soundReveal } from '../../lib/sound';
import { Speaker } from '../../types/hackathon';

// Only confirmed guests are shown; anyone with confirmed: false is hidden entirely.
const speakers: Speaker[] = mockSpeakers.filter((s) => s.confirmed !== false);
const PAGE_SIZE = 8;

/* Fullscreen photo card shown when a speaker photo is clicked.
   Rendered through a portal so parent transforms (deck/flip animations) can't break fixed positioning. */
const SpeakerPhotoModal: React.FC<{ speaker: Speaker | null; onClose: () => void }> = ({ speaker, onClose }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {speaker && (
        <motion.div
          key="speaker-photo-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          data-lenis-prevent="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo of ${speaker.name}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full aspect-square object-cover object-[center_20%] bg-[var(--bg-secondary)]"
            />

            <div className="p-5 text-center">
              <Badge
                variant="outline"
                className="mb-2 uppercase text-[10px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
              >
                {speaker.type}
              </Badge>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{speaker.name}</h3>
              <p className="text-sm text-[var(--accent)] font-bold mt-1">{speaker.role}</p>
              <p className="text-sm text-[var(--text-secondary)] font-medium">{speaker.organization}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const SpeakerAvatar: React.FC<{ name: string; image?: string; confirmed?: boolean; onOpen?: () => void; compact?: boolean }> = ({ name, image, confirmed, onOpen, compact = false }) => {
  const [imgError, setImgError] = React.useState(false);
  // compact = smaller desktop grid avatar so all 8 cards fit on screen
  const sizeCls = compact ? 'w-16 h-16' : 'w-20 h-20';
  const gapCls = compact ? 'mb-2.5' : 'mb-4';

  if (confirmed === false || name.toLowerCase().includes('announced')) {
    return (
      <div className={`${sizeCls} ${gapCls} rounded-full bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] shadow-xs`}>
        <User className="w-9 h-9 opacity-50" />
      </div>
    );
  }

  if (!image || imgError) {
    const parts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/, '').trim().split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
    return (
      <div className={`${sizeCls} ${gapCls} rounded-full bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-mono font-bold text-xl shadow-xs`}>
        {initials}
      </div>
    );
  }

  const photo = (
    <motion.img
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.3 }}
      src={image}
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizeCls} rounded-full object-cover object-[center_20%] bg-[var(--bg-secondary)]`}
    />
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={`View photo of ${name}`}
        className={`relative overflow-hidden rounded-full ${gapCls} border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] transition-colors cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
      >
        {photo}
      </button>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-full ${gapCls} border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] transition-colors`}>
      {photo}
    </div>
  );
};

export const SpeakersSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { amount: 0.4, once: true });

  const [expanded, setExpanded] = useState<boolean>(Boolean(shouldReduceMotion));
  const [showDeckOverlay, setShowDeckOverlay] = useState<boolean>(!expanded);
  const [cardOffsets, setCardOffsets] = useState<{ x: number; y: number }[]>([]);
  const autoExpandedRef = useRef<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<Speaker | null>(null);

  // Pagination state (8 per page)
  const totalPages = Math.ceil(speakers.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // True continuous 3D card flip architecture
  // Front face holds frontPage, Back face holds backPage.
  // When flipAngle is 0, Front face is facing user.
  // When flipAngle is 180, Back face is facing user.
  const [frontPage, setFrontPage] = useState<number>(1);
  const [backPage, setBackPage] = useState<number>(2);
  const [flipAngle, setFlipAngle] = useState<number>(0);
  const [isFlippingPage, setIsFlippingPage] = useState<boolean>(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipCleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile carousel state scoped to current group
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const mobilePageSpeakers = speakers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const mobileGroupTotal = mobilePageSpeakers.length;

  // Photo modal: close on Escape, lock page scroll while open
  useEffect(() => {
    if (!activePhoto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhoto(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activePhoto]);

  // Clean up flip timeouts on unmount
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
      if (flipCleanupTimeoutRef.current) clearTimeout(flipCleanupTimeoutRef.current);
    };
  }, []);

  // Handle mobile horizontal scroll indicator
  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = container.querySelectorAll<HTMLElement>('.snap-center');
    if (items.length === 0) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;
    items.forEach((item, idx) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const diff = Math.abs(containerCenter - itemCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setActiveMobileIndex(closestIndex);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = container.querySelectorAll<HTMLElement>('.snap-center');
    if (items[index]) {
      items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveMobileIndex(index);
    }
  };

  // Mobile Carousel Auto-Scroll (advances every 3.5s within current group; pauses on user interaction or reduced motion)
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!expanded || shouldReduceMotion || mobileGroupTotal <= 1 || isUserInteracting || activePhoto) {
      return;
    }

    const interval = setInterval(() => {
      setActiveMobileIndex((prev) => {
        const next = (prev + 1) % mobileGroupTotal;
        if (scrollContainerRef.current) {
          const items = scrollContainerRef.current.querySelectorAll<HTMLElement>('.snap-center');
          if (items[next]) {
            items[next].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [expanded, shouldReduceMotion, mobileGroupTotal, isUserInteracting, activePhoto]);

  // Synchronize overlay label: hide immediately when expanding, delay when collapsing
  useEffect(() => {
    if (expanded) {
      setShowDeckOverlay(false);
    } else {
      const timer = setTimeout(() => {
        setShowDeckOverlay(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  // Calculate center offsets for collapsed deck transform
  const calculateOffsets = useCallback(() => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;

    let targetX = gridRect.left + gridRect.width / 2;
    let targetY = gridRect.top + gridRect.height / 2;

    // On mobile, stack at top card (first grid slot)
    if (isMobile && cardRefs.current[0]) {
      const firstRect = cardRefs.current[0].getBoundingClientRect();
      targetX = firstRect.left + firstRect.width / 2;
      targetY = firstRect.top + firstRect.height / 2;
    }

    const newOffsets = Array.from({ length: PAGE_SIZE }).map((_, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      return {
        x: targetX - cardCenterX,
        y: targetY - cardCenterY,
      };
    });

    setCardOffsets(newOffsets);
  }, []);

  useEffect(() => {
    calculateOffsets();
    const observer = new ResizeObserver(() => {
      calculateOffsets();
    });
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    window.addEventListener('resize', calculateOffsets);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateOffsets);
    };
  }, [calculateOffsets]);

  // Auto-expand once when 40% in view after 400ms pause (only on first visit per session)
  useEffect(() => {
    if (isInView && !autoExpandedRef.current && !shouldReduceMotion) {
      autoExpandedRef.current = true;
      const hasSessionAutoExpanded = sessionStorage.getItem('compute50_speakers_auto_expanded');
      if (!hasSessionAutoExpanded) {
        sessionStorage.setItem('compute50_speakers_auto_expanded', 'true');
        const timer = setTimeout(() => {
          setExpanded(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, shouldReduceMotion]);

  if (speakers.length === 0) {
    return (
      <section id="speakers" ref={sectionRef} className="py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
        <Container size="lg">
          <Reveal>
            <SectionHeading
              badge="GUESTS & JUDGES"
              title="Guests & Judges"
            />
          </Reveal>
          <Reveal>
            <EmptyState
              category="GUESTS & JUDGES"
              title="Guests & Judges Announcing Soon"
              subtitle="Our speakers and judges will be announced soon. Check back later!"
              icon={<Users className="w-7 h-7" />}
            />
          </Reveal>
        </Container>
      </section>
    );
  }

  const handleToggleExpand = () => {
    soundReveal();
    if (expanded) {
      setExpanded(false);
      // Reset page to 1 on collapse
      setCurrentPage(1);
      setFrontPage(1);
      setBackPage(2);
      setFlipAngle(0);
      setIsFlippingPage(false);
      setActiveMobileIndex(0);
      if (window.innerWidth < 640 && sectionRef.current) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 100);
      }
    } else {
      setExpanded(true);
    }
  };

  // True Continuous 3D Y-Axis Flip Navigation
  const handlePageChange = (targetPage: number) => {
    if (isFlippingPage || targetPage === currentPage || targetPage < 1 || targetPage > totalPages) {
      return;
    }
    soundReveal();

    if (shouldReduceMotion) {
      setCurrentPage(targetPage);
      if (flipAngle === 0) {
        setBackPage(targetPage);
        setFlipAngle(180);
      } else {
        setFrontPage(targetPage);
        setFlipAngle(0);
      }
      setActiveMobileIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
      }
      return;
    }

    setIsFlippingPage(true);
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    if (flipCleanupTimeoutRef.current) clearTimeout(flipCleanupTimeoutRef.current);

    // Prepare content on the hidden opposite face BEFORE initiating rotation
    if (flipAngle === 0) {
      // Currently on Front Face (Page 1) -> Rotating to Back Face
      setBackPage(targetPage);
      setFlipAngle(180);
    } else {
      // Currently on Back Face (Page 2) -> Rotating to Front Face
      setFrontPage(targetPage);
      setFlipAngle(0);
    }

    // Midpoint: at 420ms (when cards reach 90° edge-on), synchronize pagination indicator
    flipTimeoutRef.current = setTimeout(() => {
      setCurrentPage(targetPage);
      setActiveMobileIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 420);

    // Full transition complete at 850ms: release the navigation lock
    flipCleanupTimeoutRef.current = setTimeout(() => {
      setIsFlippingPage(false);
    }, 850);
  };

  // Mobile Group Change (with smooth reset to first card)
  const handleMobileGroupChange = (targetPage: number) => {
    soundReveal();
    setCurrentPage(targetPage);
    setActiveMobileIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="speakers" ref={sectionRef} className="py-12 sm:py-14 md:py-16 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="GUESTS & JUDGES"
            title="Guests & Judges"
            subtitle="Meet our distinguished industry leaders, alumni, and hackathon judges."
          />
        </Reveal>

        {/* MOBILE VIEW (< 640px): Compact summary card ⇄ Swipeable carousel for current 8 cards */}
        <div className="block sm:hidden w-full my-4">
          <motion.div layout className="w-full overflow-hidden">
            {!expanded ? (
              /* Collapsed Mobile Deck (~220px height) */
              <motion.div
                layout="position"
                onClick={() => {
                  soundReveal();
                  setExpanded(true);
                }}
                className="w-full rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent)]/60 p-6 text-center flex flex-col items-center justify-center shadow-lg relative cursor-pointer min-h-[220px]"
              >
                <span className="px-3 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 text-[10px] font-bold font-mono tracking-widest uppercase mb-2">
                  GUESTS & JUDGES
                </span>
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-1">
                  {speakers.length} {speakers.length === 1 ? 'Guest' : 'Guests'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4 font-medium">
                  Tap to view speakers & judges
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-black font-bold text-xs shadow-xs">
                  <span>Meet the guests</span>
                  <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
                </span>
              </motion.div>
            ) : (
              /* Expanded Mobile Horizontal Swipeable Carousel */
              <motion.div layout="position" className="w-full">
                {/* Top Mobile Control Bar: Counter + Previous/Next Buttons */}
                <div className="flex items-center justify-between px-1 mb-3">
                  <div className="flex items-center gap-2">
                    {totalPages > 1 && (
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--accent)] uppercase bg-[var(--accent)]/15 px-2 py-0.5 rounded-full border border-[var(--accent)]/30">
                        {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                      </span>
                    )}
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-primary)]">
                      {activeMobileIndex + 1} of {mobileGroupTotal}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollToIndex(Math.max(0, activeMobileIndex - 1))}
                      disabled={activeMobileIndex === 0}
                      className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors cursor-pointer"
                      aria-label="Previous speaker"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToIndex(Math.min(mobileGroupTotal - 1, activeMobileIndex + 1))}
                      disabled={activeMobileIndex === mobileGroupTotal - 1}
                      className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors cursor-pointer"
                      aria-label="Next speaker"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Native horizontal touch carousel scoped to current group */}
                <div
                  ref={scrollContainerRef}
                  onScroll={handleMobileScroll}
                  onTouchStart={handleUserInteraction}
                  onPointerDown={handleUserInteraction}
                  onMouseEnter={() => setIsUserInteracting(true)}
                  onMouseLeave={() => setIsUserInteracting(false)}
                  data-lenis-prevent="true"
                  style={{
                    touchAction: 'pan-x',
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorX: 'contain',
                  }}
                  className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 px-1 scrollbar-none"
                >
                  {mobilePageSpeakers.map((speaker) => (
                    <div
                      key={speaker.id}
                      className="snap-center shrink-0 w-[78vw] max-w-[290px]"
                    >
                      <Card className="group text-center flex flex-col items-center justify-start p-5 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs min-h-[320px] h-full">
                        <SpeakerAvatar
                          name={speaker.name}
                          image={speaker.image}
                          confirmed={speaker.confirmed}
                          onOpen={speaker.image ? () => setActivePhoto(speaker) : undefined}
                        />
                        <Badge
                          variant="outline"
                          className="mb-2 uppercase text-[10px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
                        >
                          {speaker.type}
                        </Badge>
                        <h3 className="text-base font-extrabold text-[var(--text-primary)] mt-1 line-clamp-1">
                          {speaker.name}
                        </h3>
                        <p className="text-[13px] text-[var(--accent)] font-bold mb-1 mt-1 line-clamp-1">
                          {speaker.role}
                        </p>
                        <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3 line-clamp-1">
                          {speaker.organization}
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3 w-full line-clamp-3">
                          {speaker.bio}
                        </p>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Interactive Clickable Dot Indicators for Current Group */}
                <div className="flex justify-center items-center gap-1.5 mt-2 mb-3">
                  {Array.from({ length: mobileGroupTotal }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Jump to speaker ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeMobileIndex === i
                          ? 'w-6 bg-[var(--accent)] shadow-xs'
                          : 'w-2 bg-[var(--border-color)] hover:bg-[var(--accent)]/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Mobile Group Navigation Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                    {currentPage > 1 && (
                      <button
                        type="button"
                        onClick={() => handleMobileGroupChange(currentPage - 1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer"
                        aria-label="Previous 8 judges"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" />
                        <span>PREVIOUS {PAGE_SIZE}</span>
                      </button>
                    )}
                    {currentPage < totalPages && (
                      <button
                        type="button"
                        onClick={() => handleMobileGroupChange(currentPage + 1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer"
                        aria-label="Meet the next 8 judges"
                      >
                        <span>MEET THE NEXT {Math.min(PAGE_SIZE, speakers.length - currentPage * PAGE_SIZE)}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Mobile Collapse Control */}
            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                data-nosound="true"
                onClick={handleToggleExpand}
                className="px-6 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] dark:hover:text-[var(--accent)] text-xs font-semibold transition-all shadow-xs flex items-center gap-2 focus:outline-none cursor-pointer"
              >
                {expanded ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Collapse Deck</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Expand Deck</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* DESKTOP VIEW (>= 640px): 4-column × 2-row Stack & Continuous 3D Flip Deck */}
        <div className="hidden sm:block">
          <div className="relative w-full">
            <div
              ref={gridRef}
              id="guests-grid"
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, idx) => {
                const frontSpeaker = speakers[(frontPage - 1) * PAGE_SIZE + idx];
                const backSpeaker = speakers[(backPage - 1) * PAGE_SIZE + idx];
                const offset = cardOffsets[idx] || { x: 0, y: 0 };

                // Collapsed stack offsets (intentional ~1.15 scale for top card)
                const stackYOffset = idx < 3 ? idx * 6 : 0;
                const stackRotation = idx === 0 ? 0 : idx === 1 ? -2 : idx === 2 ? 2 : 0;
                const stackScale = idx < 3 ? 1.15 - idx * 0.05 : 0.8;
                const isStackVisible = idx < 3;

                const targetX = expanded || shouldReduceMotion ? 0 : offset.x;
                const targetY = expanded || shouldReduceMotion ? 0 : offset.y + stackYOffset;
                const targetScale = expanded || shouldReduceMotion ? 1 : stackScale;
                const targetRotate = expanded || shouldReduceMotion ? 0 : stackRotation;
                const targetOpacity = expanded || shouldReduceMotion ? 1 : isStackVisible ? 1 : 0;

                return (
                  <div
                    key={`judge-slot-${idx}`}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    role="listitem"
                    className="h-full relative"
                  >
                    {/* Soft Accent Glow Ring pulsing gently while idle (top card only) */}
                    {!expanded && isStackVisible && idx === 0 && !shouldReduceMotion && (
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute -inset-2 rounded-3xl bg-[var(--accent)]/20 blur-md pointer-events-none z-10"
                      />
                    )}

                    {/* Outer Positioning Container (Handles Grid Placement & Collapsed Deck Fly-in) */}
                    <motion.div
                      animate={{
                        x: targetX,
                        y: targetY,
                        scale: targetScale,
                        rotate: targetRotate,
                        opacity: targetOpacity,
                      }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                            type: 'spring',
                            stiffness: 180,
                            damping: 22,
                            delay: expanded ? idx * 0.04 : 0,
                          }
                      }
                      className="w-full h-full relative z-10"
                      style={{ perspective: 1200 }}
                    >
                      {/* Deck State Container (0° when expanded, 180° when collapsed showing Guest Pass back face) */}
                      <motion.div
                        animate={{
                          rotateY: expanded || shouldReduceMotion ? 0 : 180,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.5,
                          delay: expanded ? idx * 0.04 + 0.1 : 0,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative w-full h-full"
                      >
                        {/* DECK STACK BACK FACE: Guest Pass (Visible only when stacked in collapsed deck) */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent)]/40 p-6 flex flex-col items-center justify-center text-center shadow-lg bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-secondary)] to-[var(--bg-surface)]"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)] mb-3">
                            <Layers className="w-6 h-6 text-[var(--accent)]" />
                          </div>
                          <span className="font-mono text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
                            COMPUTE <span className="text-[var(--accent)]">50</span>
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono mt-1 font-semibold">
                            Guest Pass #{idx + 1}
                          </span>
                        </div>

                        {/* DECK STACK FRONT FACE: Interactive 3D Two-Faced Page Flip Container */}
                        <motion.div
                          animate={{
                            rotateY: flipAngle,
                          }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.85,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d',
                          }}
                          className="relative w-full h-full"
                        >
                          {/* CARD FACE 1 (Front Face: Page 1 Judges, at 0°) */}
                          <div
                            className="w-full h-full relative"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(0deg)',
                            }}
                          >
                            {frontSpeaker ? (
                              <Card
                                hoverable={expanded && currentPage === frontPage && !isFlippingPage}
                                className="group text-center flex flex-col items-center justify-start overflow-hidden h-full p-4 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs min-h-[236px]"
                              >
                                <SpeakerAvatar
                                  name={frontSpeaker.name}
                                  image={frontSpeaker.image}
                                  confirmed={frontSpeaker.confirmed}
                                  compact
                                  onOpen={
                                    frontSpeaker.image && (expanded || shouldReduceMotion) && !isFlippingPage
                                      ? () => setActivePhoto(frontSpeaker)
                                      : undefined
                                  }
                                />
                                <Badge
                                  variant="outline"
                                  className="mb-1.5 uppercase text-[9px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
                                >
                                  {frontSpeaker.type}
                                </Badge>
                                <h3 className="text-sm font-extrabold text-[var(--text-primary)] transition-colors line-clamp-1">
                                  {frontSpeaker.name}
                                </h3>
                                <p className="text-[12px] text-[var(--accent)] font-bold mt-0.5 line-clamp-1">
                                  {frontSpeaker.role}
                                </p>
                                <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-2 line-clamp-1">
                                  {frontSpeaker.organization}
                                </p>
                                <p className="text-[11px] text-[var(--text-secondary)] leading-snug border-t border-[var(--border-color)] pt-2 w-full line-clamp-2">
                                  {frontSpeaker.bio}
                                </p>
                              </Card>
                            ) : (
                              <div className="w-full h-full min-h-[236px]" />
                            )}
                          </div>

                          {/* CARD FACE 2 (Back Face: Page 2 Judges, at 180°) */}
                          <div
                            className="absolute inset-0 w-full h-full"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                            }}
                          >
                            {backSpeaker ? (
                              <Card
                                hoverable={expanded && currentPage === backPage && !isFlippingPage}
                                className="group text-center flex flex-col items-center justify-start overflow-hidden h-full p-4 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs min-h-[236px]"
                              >
                                <SpeakerAvatar
                                  name={backSpeaker.name}
                                  image={backSpeaker.image}
                                  confirmed={backSpeaker.confirmed}
                                  compact
                                  onOpen={
                                    backSpeaker.image && (expanded || shouldReduceMotion) && !isFlippingPage
                                      ? () => setActivePhoto(backSpeaker)
                                      : undefined
                                  }
                                />
                                <Badge
                                  variant="outline"
                                  className="mb-1.5 uppercase text-[9px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
                                >
                                  {backSpeaker.type}
                                </Badge>
                                <h3 className="text-sm font-extrabold text-[var(--text-primary)] transition-colors line-clamp-1">
                                  {backSpeaker.name}
                                </h3>
                                <p className="text-[12px] text-[var(--accent)] font-bold mt-0.5 line-clamp-1">
                                  {backSpeaker.role}
                                </p>
                                <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-2 line-clamp-1">
                                  {backSpeaker.organization}
                                </p>
                                <p className="text-[11px] text-[var(--text-secondary)] leading-snug border-t border-[var(--border-color)] pt-2 w-full line-clamp-2">
                                  {backSpeaker.bio}
                                </p>
                              </Card>
                            ) : (
                              <div className="w-full h-full min-h-[236px]" />
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* COLLAPSED DECK OVERLAY LABEL FOR DESKTOP */}
            {showDeckOverlay && !expanded && !shouldReduceMotion && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleToggleExpand}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleExpand();
                    }
                  }}
                  className="pointer-events-auto px-8 py-7 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent)] shadow-2xl flex flex-col items-center justify-center text-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/50 transition-all hover:scale-105 max-w-sm"
                  aria-expanded={expanded}
                  aria-controls="guests-grid"
                  aria-label={`Expand deck of ${speakers.length} guests and judges`}
                >
                  <span className="px-3.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 text-xs font-bold font-mono tracking-widest uppercase mb-3">
                    GUESTS & JUDGES
                  </span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-1.5">
                    {speakers.length} {speakers.length === 1 ? 'Guest' : 'Guests'}
                  </h3>
                  <p className="text-sm text-[var(--text-primary)]/80 mb-5 font-medium">
                    Click or press Enter to unpack guest deck
                  </p>
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-black dark:text-black font-extrabold text-sm shadow-md group-hover:brightness-110 transition-all">
                    <span>Meet the guests</span>
                    <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
                  </span>
                </motion.button>
              </div>
            )}
          </div>

          {/* DESKTOP CONTROLS & PAGINATION BELOW GRID */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {/* 8+8 Coordinated Page Navigation Bar */}
            {expanded && totalPages > 1 && (
              <div
                className="flex items-center gap-2 bg-[var(--bg-surface)] px-2 py-1.5 rounded-2xl border border-[var(--border-color)] shadow-xs transition-colors"
                role="region"
                aria-label="Judges pagination"
              >
                {/* Previous 8 CTA */}
                {currentPage > 1 && (
                  <button
                    type="button"
                    disabled={isFlippingPage}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-extrabold text-[11px] tracking-wider uppercase shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous 8 judges"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[3]" />
                    <span>PREVIOUS {PAGE_SIZE}</span>
                  </button>
                )}

                {/* Pagination Indicator 01 / 02 */}
                <div className="px-3 py-1 font-mono text-xs font-bold text-[var(--text-primary)] tracking-widest flex items-center gap-1.5">
                  <span className="text-[var(--accent)]">{String(currentPage).padStart(2, '0')}</span>
                  <span className="opacity-40">/</span>
                  <span>{String(totalPages).padStart(2, '0')}</span>
                </div>

                {/* Meet the Next 8 CTA */}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    disabled={isFlippingPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-extrabold text-[11px] tracking-wider uppercase shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Meet the next 8 judges"
                  >
                    <span>MEET THE NEXT {Math.min(PAGE_SIZE, speakers.length - currentPage * PAGE_SIZE)}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            )}

            {/* Collapse Deck Toggle Button */}
            <button
              type="button"
              onClick={handleToggleExpand}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] dark:hover:text-[var(--accent)] text-xs font-semibold transition-all shadow-xs flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
              aria-expanded={expanded}
              aria-controls="guests-grid"
            >
              {expanded ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Collapse Deck</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Expand Deck</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Container>

      <SpeakerPhotoModal speaker={activePhoto} onClose={() => setActivePhoto(null)} />
    </section>
  );
};