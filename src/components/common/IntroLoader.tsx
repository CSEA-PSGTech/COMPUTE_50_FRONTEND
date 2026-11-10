import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSmoothScroll } from "../../context/SmoothScrollContext";
import { DecryptText } from "./DecryptText";


interface IntroLoaderProps {
  onComplete?: () => void;
}

/*
  Intro (~3.3s before the curtain):
   1. Count  – 1976 → 2026 along a decade timeline, a translucent clock turning behind it
   2. Reveal – the year lifts away, COMPUTE 50 decrypts in (same effect as the hero) over a
               translucent "50", a gold light sweeps across it and the slogan arrives
   3. Exit   – cream curtain lifts with a gold layer trailing behind
*/
const END_YEAR = 2026;
const START_YEAR = END_YEAR - 50;
const ENTRANCE_MS = 400; // let the first frame settle before counting
const COUNT_MS = 1800; // 1976 → 2026
const BEAT_MS = 250; // brief beat on 2026
const REVEAL_MS = 1550; // COMPUTE 50 on screen before the curtain lifts
const SLOGAN = ["From", "Legacy", "to", "Limitless"];
const DECADES = Array.from({ length: 6 }, (_, i) => START_YEAR + i * 10);

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_CURTAIN: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Same Google Fonts URL the navbar uses, so the stylesheet is only added once
const DISPLAY_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap";
const DISPLAY_FONT = "'Space Grotesk', 'Inter', sans-serif";

const INK = "#060D21";
const GOLD = "#DAA520";
const GOLD_DEEP = "#B8860B";
const CREAM = "#F5EFE6";
const LINE = "#DBCBB4";
const MUTED = "#5C5349";

/* Slow-drifting gold motes for depth (fixed positions so they're stable between renders) */
type Phase = "count" | "reveal";

const MOTES = [
  { x: 12, y: 22, s: 4, d: 0 },
  { x: 84, y: 18, s: 3, d: 0.6 },
  { x: 22, y: 74, s: 5, d: 1.1 },
  { x: 76, y: 70, s: 4, d: 0.3 },
  { x: 50, y: 12, s: 3, d: 1.5 },
  { x: 92, y: 46, s: 3, d: 0.9 },
  { x: 6, y: 48, s: 4, d: 1.8 },
  { x: 62, y: 86, s: 3, d: 0.4 },
];

/*
  Translucent clock behind the stage. `turn` is 0 → 1 over the count:
  the hour hand makes one full turn (50 years), the minute hand ten (one per 5 years),
  both easing to rest pointing at 12 when 2026 is reached.
*/
const BackgroundClock: React.FC<{ turn: number; settled: boolean }> = ({
  turn,
  settled,
}) => {
  const R = 300;
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  const hourAngle = turn * 360;
  const minuteAngle = turn * 3600;
  return (
    <svg
      viewBox="-320 -320 640 640"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Rings */}
      <circle r={R} fill="none" stroke={GOLD} strokeWidth="2" />
      <circle
        r={R - 26}
        fill="none"
        stroke={GOLD}
        strokeWidth="1"
        strokeDasharray="2 10"
      />
      <circle
        r={R * 0.42}
        fill="none"
        stroke={GOLD}
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Minute ticks; every 5th is a longer hour tick */}
      {ticks.map((i) => {
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            x1="0"
            y1={-R + 6}
            x2="0"
            y2={-R + (major ? 30 : 16)}
            stroke={GOLD}
            strokeWidth={major ? 3 : 1.25}
            strokeLinecap="round"
            transform={`rotate(${i * 6})`}
          />
        );
      })}
      {/* Hour hand */}
      <line
        x1="0"
        y1="24"
        x2="0"
        y2={-R * 0.5}
        stroke={INK}
        strokeWidth="9"
        strokeLinecap="round"
        transform={`rotate(${hourAngle})`}
        style={{
          transition: settled
            ? "transform 700ms cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
      />
      {/* Minute hand */}
      <line
        x1="0"
        y1="32"
        x2="0"
        y2={-R * 0.78}
        stroke={GOLD_DEEP}
        strokeWidth="5"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle})`}
      />
      <circle r="12" fill={GOLD} />
      <circle r="4" fill={CREAM} />
    </svg>
  );
};

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem("compute50_intro_seen");
    } catch {
      return true;
    }
  });
  const shouldReduceMotion = useReducedMotion();
  const [yearsDone, setYearsDone] = useState(() =>
    shouldReduceMotion ? 50 : 0,
  );
  const [turn, setTurn] = useState(() => (shouldReduceMotion ? 1 : 0)); // continuous 0 → 1 for the clock hands
  const [phase, setPhase] = useState<Phase>(() =>
    shouldReduceMotion ? "reveal" : "count",
  );
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();

  // Load Space Grotesk for the labels (no-op if the navbar already added it)
  useEffect(() => {
    if (document.querySelector(`link[href="${DISPLAY_FONTS_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = DISPLAY_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  // Stable refs so the timer effect isn't re-triggered by changing callbacks
  const scrollControlsRef = useRef({ stop: stopScroll, start: startScroll });
  useEffect(() => {
    scrollControlsRef.current = { stop: stopScroll, start: startScroll };
  }, [stopScroll, startScroll]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finishLoader = useCallback(() => {
    setLoading(false);
    try {
      sessionStorage.setItem("compute50_intro_seen", "true");
    } catch {
      // sessionStorage unavailable in restricted environments
    }
    if (onCompleteRef.current) onCompleteRef.current();
  }, []);

  // Escape skips the intro
  useEffect(() => {
    if (!loading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishLoader();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, finishLoader]);

  useEffect(() => {
    if (!loading) {
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Lock page scrolling while the intro plays
    scrollControlsRef.current.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const release = () => {
      document.body.style.overflow = prevOverflow;
      scrollControlsRef.current.start();
    };

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (shouldReduceMotion) {
      timers.push(
        setTimeout(() => {
          release();
          finishLoader();
        }, 900),
      );
      return () => {
        timers.forEach(clearTimeout);
        release();
      };
    }

    // Act 1: count. Truncated easeOutCubic → quick start, even slowdown, no stall on the last years.
    let raf = 0;
    const startedAt = performance.now() + ENTRANCE_MS;
    const CUT = 0.7;
    const curve = (x: number) => 1 - Math.pow(1 - x, 3);
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - startedAt) / COUNT_MS));
      const eased = curve(t * CUT) / curve(CUT);
      const years = Math.floor(eased * 50 + 1e-6);
      setYearsDone(years);
      setTurn(Math.min(1, eased));
      if (years < 50 && t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setYearsDone(50);
        setTurn(1);
        // Beat on 2026 → reveal COMPUTE 50 → curtain
        timers.push(setTimeout(() => setPhase("reveal"), BEAT_MS));
        timers.push(
          setTimeout(() => {
            release();
            finishLoader();
          }, BEAT_MS + REVEAL_MS),
        );
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      release();
    };
  }, [loading, shouldReduceMotion, finishLoader]);

  const year = START_YEAR + yearsDone;
  const reachedEnd = yearsDone >= 50;
  const progress = (yearsDone / 50) * 100;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="intro-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Compute 50"
          className="fixed inset-0 z-[9999] overflow-hidden select-none"
          exit={{ opacity: shouldReduceMotion ? 0 : 1 }}
          transition={{ duration: shouldReduceMotion ? 0.25 : 1 }}
        >
          {/* Gold under-curtain trailing the main panel */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0"
              style={{ background: GOLD }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.85, ease: EASE_CURTAIN, delay: 0.12 }}
            />
          )}

          {/* Main panel */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            style={{ background: CREAM, color: INK }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: "-100%" }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.85,
              ease: EASE_CURTAIN,
            }}
          >
            {/* Warm glow that brightens on the reveal */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: phase === "reveal" ? 1 : 0.7 }}
              transition={{ duration: 0.8 }}
              style={{
                background:
                  "radial-gradient(55% 45% at 50% 48%, rgba(218,165,32,0.22) 0%, rgba(218,165,32,0) 70%)",
              }}
            />
            {/* Faint vignette grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `linear-gradient(${LINE}66 1px, transparent 1px), linear-gradient(90deg, ${LINE}66 1px, transparent 1px)`,
                backgroundSize: "64px 64px",
                maskImage:
                  "radial-gradient(65% 55% at 50% 50%, black 25%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(65% 55% at 50% 50%, black 25%, transparent 80%)",
              }}
            />
            {/* Drifting motes */}
            {!shouldReduceMotion &&
              MOTES.map((m, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                    width: m.s,
                    height: m.s,
                    background: GOLD,
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.55, 0], y: -40 }}
                  transition={{
                    duration: 3.2,
                    delay: m.d,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}

            {/* Translucent clock: time running through fifty years */}
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: "min(92vh, 120vw)", height: "min(92vh, 120vw)" }}
              initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
              animate={{
                opacity: phase === "reveal" ? 0 : 0.13,
                scale: phase === "reveal" ? 1.12 : 1,
                rotate: 0,
              }}
              transition={{
                duration: phase === "reveal" ? 0.45 : 1.2,
                ease: EASE_OUT,
              }}
            >
              <BackgroundClock turn={turn} settled={reachedEnd} />
            </motion.div>

            {/* Giant outlined "50": takes over from the clock once 2026 is reached */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none font-black leading-none tracking-[-0.06em]"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: phase === "reveal" ? 0.18 : 0,
                scale: phase === "reveal" ? 1 : 0.88,
              }}
              transition={{
                duration: 0.7,
                ease: EASE_OUT,
                delay: phase === "reveal" ? 0.1 : 0,
              }}
              style={{
                fontSize: "clamp(16rem, 52vw, 40rem)",
                color: "transparent",
                WebkitTextStroke: `2px ${GOLD}`,
              }}
            >
              50
            </motion.div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-7">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="flex items-center gap-2.5"
              >
                
                
              </motion.div>

              <motion.button
                type="button"
                onClick={finishLoader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/60 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer hover:bg-white focus:outline-none focus-visible:ring-2"
                style={{ borderColor: LINE, color: MUTED }}
                aria-label="Skip intro animation"
              >
                Skip
                <span
                  className="px-1.5 py-px rounded border text-[9px] tracking-normal"
                  style={{ borderColor: LINE }}
                >
                  Esc
                </span>
              </motion.button>
            </div>

            {/* Stage */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-5 text-center">
              <AnimatePresence mode="wait">
                {phase === "count" ? (
                  <motion.div
                    key="count"
                    className="flex flex-col items-center w-full"
                    exit={{
                      opacity: 0,
                      y: -22,
                      filter: "blur(8px)",
                      scale: 0.96,
                    }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    {/* "CSEA presents" line drawn in */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5"
                    >
                      <motion.span
                        className="h-px w-6 sm:w-14 origin-right"
                        style={{ background: GOLD }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.7,
                          ease: EASE_OUT,
                          delay: 0.2,
                        }}
                      />
                      <span
                        className="text-[15px] sm:text-xl md:text-2xl font-medium tracking-[0.18em] uppercase tabular-nums whitespace-nowrap"
                        style={{ color: INK, fontFamily: DISPLAY_FONT }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: GOLD_DEEP }}
                        >
                          {String(yearsDone).padStart(2, "0")}
                        </span>{" "}
                        Years of <span className="font-bold">M.E. CSE</span>
                      </span>
                      <motion.span
                        className="h-px w-6 sm:w-14 origin-left"
                        style={{ background: GOLD }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.7,
                          ease: EASE_OUT,
                          delay: 0.2,
                        }}
                      />
                    </motion.div>

                    {/* Year */}
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "105%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: EASE_OUT }}
                        className="font-black leading-[0.95] tracking-[-0.05em] tabular-nums"
                        style={{ fontSize: "clamp(4.75rem, 19vw, 11rem)" }}
                        aria-label={String(year)}
                      >
                        <span style={{ color: INK }}>
                          {String(year).slice(0, 2)}
                        </span>
                        <span
                          className="transition-colors duration-500"
                          style={{ color: reachedEnd ? GOLD_DEEP : INK }}
                        >
                          {String(year).slice(2)}
                        </span>
                      </motion.div>
                    </div>

                    {/* Decade timeline */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: EASE_OUT,
                        delay: 0.25,
                      }}
                      className="w-full max-w-[560px] mt-7 sm:mt-10 px-1"
                    >
                      <div
                        className="relative h-[2px] w-full rounded-full"
                        style={{ background: LINE }}
                      >
                        <div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})`,
                            transition:
                              "width 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        />
                        {DECADES.map((d, i) => {
                          const passed = year >= d;
                          return (
                            <span
                              key={d}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                              style={{
                                left: `${(i / (DECADES.length - 1)) * 100}%`,
                                width: passed ? 9 : 7,
                                height: passed ? 9 : 7,
                                background: passed ? GOLD : CREAM,
                                border: `1.5px solid ${passed ? GOLD : LINE}`,
                                boxShadow: passed
                                  ? "0 0 0 4px rgba(218,165,32,0.16)"
                                  : "none",
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="relative mt-3 h-4">
                        {DECADES.map((d, i) => {
                          const last = i === DECADES.length - 1;
                          const edge =
                            i === 0
                              ? "translate-x-0"
                              : last
                                ? "-translate-x-full"
                                : "-translate-x-1/2";
                          return (
                            <span
                              key={d}
                              className={`absolute ${edge} font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.12em] transition-colors duration-300 ${
                                i > 0 && !last ? "hidden sm:block" : ""
                              }`}
                              style={{
                                left: `${(i / (DECADES.length - 1)) * 100}%`,
                                color:
                                  year >= d
                                    ? last
                                      ? GOLD_DEEP
                                      : INK
                                    : "#A89A87",
                              }}
                            >
                              {d}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reveal"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                  >
                    <motion.span
                      initial={{ opacity: 0, letterSpacing: "0.5em" }}
                      animate={{ opacity: 1, letterSpacing: "0.28em" }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                      className="text-xs sm:text-base font-medium uppercase mb-3 sm:mb-5"
                      style={{ color: GOLD_DEEP, fontFamily: DISPLAY_FONT }}
                    >
                      <span className="font-bold">CSEA</span> presents
                    </motion.span>

                    {/* Wordmark + gold light sweep clipped to the letters */}
                    <div className="relative">
                      <div
                        className="font-mono font-black leading-none tracking-[-0.02em] whitespace-nowrap"
                        style={{
                          fontSize: "clamp(2.6rem, 11.5vw, 7.5rem)",
                          color: INK,
                        }}
                        aria-label="COMPUTE 50"
                      >
                        <DecryptText
                          text="COMPUTE 50"
                          highlightText="50"
                          highlightClassName="text-[#B8860B]"
                          speed={16}
                        />
                      </div>
                      {!shouldReduceMotion && (
                        <motion.div
                          aria-hidden="true"
                          className="absolute inset-0 font-mono font-black leading-none tracking-[-0.02em] whitespace-nowrap pointer-events-none"
                          style={{
                            fontSize: "clamp(2.6rem, 11.5vw, 7.5rem)",
                            color: "transparent",
                            backgroundImage:
                              "linear-gradient(110deg, transparent 38%, rgba(255,244,205,0.95) 50%, transparent 62%)",
                            backgroundSize: "250% 100%",
                            backgroundRepeat: "no-repeat",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                          }}
                          initial={{ backgroundPosition: "150% 0" }}
                          animate={{ backgroundPosition: "-50% 0" }}
                          transition={{
                            duration: 0.75,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        >
                          COMPUTE 50
                        </motion.div>
                      )}
                    </div>

                    <motion.span
                      className="block h-[2px] w-24 sm:w-32 mt-4 sm:mt-6 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
                    />

                    <p
                      className="mt-3 sm:mt-5 text-base sm:text-xl font-medium tracking-tight"
                      style={{ color: MUTED, fontFamily: DISPLAY_FONT }}
                    >
                      {SLOGAN.map((w, i) => (
                        <motion.span
                          key={w}
                          className="inline-block mr-[0.3em] last:mr-0"
                          style={
                            w === "Limitless"
                              ? { color: GOLD_DEEP, fontWeight: 700 }
                              : undefined
                          }
                          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.35,
                            ease: EASE_OUT,
                            delay: 0.3 + i * 0.08,
                          }}
                        >
                          {w}
                        </motion.span>
                      ))}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom caption */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "count" ? 1 : 0 }}
              transition={{ duration: 0.4, delay: phase === "count" ? 0.3 : 0 }}
              className="relative z-10 flex items-center justify-center gap-3 pb-7 sm:pb-9 text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: MUTED, fontFamily: DISPLAY_FONT }}
            >
              <span>{START_YEAR}</span>
              <span
                className="w-8 h-px"
                style={{ background: LINE }}
                aria-hidden="true"
              />
              <span style={{ color: GOLD_DEEP }}>{END_YEAR}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};