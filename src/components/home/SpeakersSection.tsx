import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockSpeakers } from '../../data/speakers';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Users, User, Layers, Sparkles, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { soundReveal } from '../../lib/sound';

const SpeakerAvatar: React.FC<{ name: string; image?: string; confirmed?: boolean }> = ({ name, image, confirmed }) => {
  const [imgError, setImgError] = React.useState(false);

  if (confirmed === false) {
    return (
      <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-4 shadow-xs">
        <User className="w-10 h-10 opacity-50" />
      </div>
    );
  }

  if (!image || imgError) {
    const parts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/, '').trim().split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
    return (
      <div className="w-24 h-24 rounded-full bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-mono font-bold text-2xl mb-4 shadow-xs">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-full mb-4 border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] transition-colors">
      <motion.img
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
        src={image}
        alt={name}
        onError={() => setImgError(true)}
        className="w-24 h-24 rounded-full object-cover bg-[var(--bg-secondary)]"
      />
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
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const autoExpandedRef = useRef<boolean>(false);

  const allUnconfirmed = mockSpeakers.every((s) => s.confirmed === false);
  const confirmedGuests = mockSpeakers.filter((s) => s.confirmed !== false);
  const unconfirmedGuests = mockSpeakers.filter((s) => s.confirmed === false);
  const hasUnconfirmed = unconfirmedGuests.length > 0;

  const totalCards = confirmedGuests.length + (unconfirmedGuests.length > 0 ? 1 : 0);

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

  // Mobile Carousel Auto-Scroll (advances every 3.5s when expanded; pauses on user interaction or reduced motion)
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
    if (!expanded || shouldReduceMotion || allUnconfirmed || totalCards <= 1 || isUserInteracting) {
      return;
    }

    const interval = setInterval(() => {
      setActiveMobileIndex((prev) => {
        const next = (prev + 1) % totalCards;
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
  }, [expanded, shouldReduceMotion, allUnconfirmed, totalCards, isUserInteracting]);

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

    const newOffsets = mockSpeakers.map((_, idx) => {
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

  if (!mockSpeakers || mockSpeakers.length === 0) {
    return (
      <section id="speakers" ref={sectionRef} className="py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
        <Container size="lg">
          <Reveal>
            <SectionHeading
              badge="GUESTS & JUDGES"
              title="Guests & Judges"
              subtitle="Our speakers and judges will be announced soon."
            />
          </Reveal>
          <Reveal>
            <EmptyState
              category="GUESTS & JUDGES"
              title="Guests & Judges Announcing Soon"
              subtitle="Our speakers and judges will be announced soon."
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
      if (window.innerWidth < 640 && sectionRef.current) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 100);
      }
    } else {
      setExpanded(true);
    }
  };

  return (
    <section id="speakers" ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="GUESTS & JUDGES"
            title="Guests & Judges"
            subtitle="Our speakers and judges will be announced soon."
          />
        </Reveal>

        {/* MOBILE VIEW (< 640px): Normal-flow height, single card when collapsed / swipeable carousel when expanded */}
        <div className="block sm:hidden w-full my-4">
          {allUnconfirmed ? (
            /* All Unconfirmed: Single static deck card, no expand controls */
            <div className="w-full rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] p-6 text-center flex flex-col items-center justify-center shadow-xs min-h-[220px]">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)] mb-3">
                <Users className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 text-[10px] font-bold font-mono tracking-widest uppercase mb-2">
                GUESTS & JUDGES
              </span>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                Guests & judges will be announced soon
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-medium">
                Check back later for confirmed speakers and event judges.
              </p>
            </div>
          ) : (
            /* Confirmed guests present: Normal-flow collapsible deck */
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
                    {mockSpeakers.length} Guests
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
                      <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--accent)] uppercase bg-[var(--accent)]/15 px-2.5 py-0.5 rounded-full border border-[var(--accent)]/30">
                        {activeMobileIndex + 1} / {totalCards}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                        Swipe or tap arrows
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
                        onClick={() => scrollToIndex(Math.min(totalCards - 1, activeMobileIndex + 1))}
                        disabled={activeMobileIndex === totalCards - 1}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors cursor-pointer"
                        aria-label="Next speaker"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Native horizontal touch carousel */}
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
                    {confirmedGuests.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="snap-center shrink-0 w-[78vw] max-w-[290px]"
                      >
                        <Card className="group text-center flex flex-col items-center justify-center p-6 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs min-h-[290px] h-full">
                          <SpeakerAvatar
                            name={speaker.name}
                            image={speaker.image}
                            confirmed={speaker.confirmed}
                          />
                          <Badge
                            variant="outline"
                            className="mb-2 uppercase text-[10px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
                          >
                            {speaker.type}
                          </Badge>
                          <h3 className="text-base font-extrabold text-[var(--text-primary)] mt-1">
                            {speaker.name}
                          </h3>
                          <p className="text-[13px] text-[var(--accent)] font-bold mb-1 mt-1">
                            {speaker.role}
                          </p>
                          <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">
                            {speaker.organization}
                          </p>
                          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3 w-full">
                            {speaker.bio}
                          </p>
                        </Card>
                      </div>
                    ))}

                    {unconfirmedGuests.length > 0 && (
                      <div className="snap-center shrink-0 w-[78vw] max-w-[290px]">
                        <div className="h-full min-h-[290px] rounded-2xl bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-color)] p-6 flex flex-col items-center justify-center text-center shadow-xs">
                          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3">
                            <Sparkles className="w-6 h-6 text-[var(--accent)]" />
                          </div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                            +{unconfirmedGuests.length} More
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-medium">
                            To be announced soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Clickable Dot Indicators */}
                  <div className="flex justify-center items-center gap-1.5 mt-2 mb-4">
                    {Array.from({ length: totalCards }).map((_, i) => (
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
                </motion.div>
              )}

              {/* Mobile Collapse Control */}
              {!allUnconfirmed && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <button
                    type="button"
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
              )}
            </motion.div>
          )}
        </div>

        {/* DESKTOP VIEW (>= 640px): 3-column Stack & Flyout Grid preserved unchanged */}
        <div className="hidden sm:block">
          <div className="relative w-full">
            <div
              ref={gridRef}
              id="guests-grid"
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative"
            >
              {mockSpeakers.map((speaker, idx) => {
                const isUnconfirmed = speaker.confirmed === false;
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
                    key={speaker.id}
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
                            delay: expanded ? idx * 0.07 : 0,
                          }
                      }
                      className="w-full h-full relative z-10"
                      style={{ perspective: 1000 }}
                    >
                      {/* 3D Flip Container */}
                      <motion.div
                        animate={{
                          rotateY: expanded || shouldReduceMotion ? 0 : 180,
                        }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                              duration: 0.5,
                              delay: expanded ? idx * 0.07 + 0.1 : 0,
                            }
                        }
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative w-full h-full"
                      >
                        {/* CARD FRONT FACE */}
                        <Card
                          hoverable={expanded}
                          className="group text-center flex flex-col items-center justify-center overflow-hidden h-full p-6 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs min-h-[280px]"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <SpeakerAvatar
                            name={isUnconfirmed ? 'To Be Announced' : speaker.name}
                            image={speaker.image}
                            confirmed={speaker.confirmed}
                          />
                          <Badge
                            variant="outline"
                            className="mb-2 uppercase text-[10px] font-mono tracking-wider font-bold border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10"
                          >
                            {isUnconfirmed ? 'TBA' : speaker.type}
                          </Badge>
                          <h3 className="text-base font-extrabold text-[var(--text-primary)] transition-colors mt-1">
                            {isUnconfirmed ? 'To be announced' : speaker.name}
                          </h3>
                          {isUnconfirmed ? (
                            <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5">
                              Guest details will be announced soon
                            </p>
                          ) : (
                            <>
                              <p className="text-[13px] text-[var(--accent)] font-bold mb-1 mt-1">
                                {speaker.role}
                              </p>
                              <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">
                                {speaker.organization}
                              </p>
                              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3 w-full">
                                {speaker.bio}
                              </p>
                            </>
                          )}
                        </Card>

                        {/* CARD BACK FACE (Visible when stacked) */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent)]/40 p-6 flex flex-col items-center justify-center text-center shadow-lg bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-secondary)] to-[var(--bg-surface)]"
                          style={{
                            backfaceVisibility: 'hidden',
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
                  aria-label={`Expand deck of ${mockSpeakers.length} guests and judges`}
                >
                  <span className="px-3.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 text-xs font-bold font-mono tracking-widest uppercase mb-3">
                    GUESTS & JUDGES
                  </span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-1.5">
                    {mockSpeakers.length} Guests
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

          {/* DESKTOP CONTROLS BELOW GRID */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleToggleExpand}
              className="px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] dark:hover:text-[var(--accent)] text-sm font-semibold transition-all shadow-xs flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
              aria-expanded={expanded}
              aria-controls="guests-grid"
            >
              {expanded ? (
                <>
                  <RotateCcw className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm">Collapse Deck</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm">Expand Deck</span>
                </>
              )}
            </button>

            {hasUnconfirmed && (
              <p className="text-sm text-[var(--text-secondary)] font-medium flex items-center gap-1.5 mt-1">
                <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>More guests will be announced soon</span>
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};



