import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, UserPlus, LogIn, Laptop, AlertCircle, RotateCcw, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { useCountdown } from '../../hooks/useCountdown';
import { DecryptText } from '../common/DecryptText';
import { MOTION_EASE } from '../../lib/motion';
import { soundModalOpen } from '../../lib/sound';
import psgLogo from '../../assets/logos/psg-logo.png';
import cseaLogo from '../../assets/logos/csea-logo.png';
import compute50HeroEmblem from '../../assets/logos/compute-50-hero-emblem.png';
import { EVENT_CONFIG } from '../../config/event';
import { home } from '../../data/content';
import { ParticleBackground } from './ParticleBackground';

const Compute50HeroLogo: React.FC<{ shouldReduceMotion: boolean | null }> = ({
  shouldReduceMotion,
}) => {
  const [unrollKey, setUnrollKey] = React.useState<number>(0);
  const [isUnrolling, setIsUnrolling] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnrolling(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, [unrollKey]);

  const handleReplay = () => {
    soundModalOpen();
    setIsUnrolling(true);
    setUnrollKey((prev) => prev + 1);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleReplay}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleReplay();
        }
      }}
      aria-label="Compute 50 Emblem - Click to replay holographic unroll animation"
      title="Click to replay holographic unroll animation"
      className="relative flex flex-col items-center justify-center pt-1 pb-1 select-none cursor-pointer group focus:outline-hidden"
    >
      {/* Top Cyber Circuit Accent Lines (Expanding on Entry) */}
      <div className="w-full max-w-[260px] sm:max-w-xs flex items-center justify-between mb-1 px-1 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            //
          </span>
          <motion.div
            key={`circuit-l-${unrollKey}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-10 sm:w-16 md:w-20 h-[1px] bg-gradient-to-r from-[var(--accent)]/80 to-transparent origin-left"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            key={`circuit-r-${unrollKey}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-10 sm:w-16 md:w-20 h-[1px] bg-gradient-to-l from-[var(--accent)]/80 to-transparent origin-right"
          />
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            \\
          </span>
        </div>
      </div>

      {/* Holographic Projected Cyber Card / Logo Unroll Container */}
      <div className="relative overflow-hidden p-1.5">
        {/* Sci-Fi Hologram Laser Scanline (Sweeping Down on Enter / Replay) */}
        {!shouldReduceMotion && (
          <motion.div
            key={`laser-${unrollKey}`}
            initial={{ top: '-4%', opacity: 1 }}
            animate={{ top: ['0%', '102%'], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute -left-4 -right-4 h-[2.5px] bg-[var(--accent)] shadow-[0_0_15px_var(--accent),0_0_30px_var(--accent),0_0_6px_#ffffff] z-30 pointer-events-none"
          >
            {/* Laser light flare fan trailing behind the beam */}
            <div className="w-full h-10 sm:h-14 bg-gradient-to-b from-[var(--accent)]/35 to-transparent" />
          </motion.div>
        )}

        {/* Holographic Projected Emblem Image (Top-to-Bottom Unrolling) */}
        <motion.div
          key={`emblem-${unrollKey}`}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', opacity: 0.25 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  opacity: 1,
                  transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                }
          }
          onAnimationComplete={() => setIsUnrolling(false)}
          className={`relative transition-all duration-300 ${!isUnrolling ? 'animate-hero-emblem' : ''}`}
        >
          <img
            src={compute50HeroEmblem}
            alt="Compute 50 Emblem"
            className="w-40 sm:w-56 md:w-64 lg:w-72 h-auto object-contain filter drop-shadow-[0_0_24px_rgba(var(--accent-rgb),0.3)] transition-transform duration-300 group-hover:scale-105 select-none"
          />
        </motion.div>
      </div>

      {/* Subtle replay helper indicator shown on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 flex items-center gap-1 text-[10px] font-mono tracking-wider text-[var(--accent)] font-semibold">
        <RotateCcw className="w-3 h-3 animate-spin-reverse" />
        <span>Click to replay holographic reveal</span>
      </div>
    </div>
  );
};

const InstitutionLogo: React.FC<{
  name: string;
  shortName: string;
  logoSrc: string;
  href: string;
}> = ({ name, shortName, logoSrc, href }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${name} website`}
        title={`Visit ${name} official website`}
        className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]/60 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] font-mono text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
        <span>{shortName}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name} website`}
      title={`Visit ${name} official website`}
      className="flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]/60 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] font-mono text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs group"
    >
      <img
        src={logoSrc}
        alt={name}
        onError={() => setHasError(true)}
        className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 dark:filter dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] group-hover:scale-105 shrink-0"
      />
      <span className="group-hover:text-[var(--accent)] transition-colors whitespace-nowrap">
        {shortName}
      </span>
      <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all shrink-0" />
    </a>
  );
};

const PresenterHeader: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none pt-1 pb-1 px-2 sm:px-4">
      {/* Subtle Cyber Circuit Trace Overlay matching reference */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-35 dark:opacity-55 overflow-hidden">
        <svg
          className="w-full h-full max-w-3xl text-[var(--accent)]"
          viewBox="0 0 800 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Top subtle circuit traces with node terminals */}
          <line x1="30" y1="20" x2="280" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
          <line x1="280" y1="20" x2="310" y2="40" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="310" cy="40" r="2.5" fill="currentColor" fillOpacity="0.7" />

          {/* Bottom subtle circuit traces with node terminals */}
          <circle cx="490" cy="65" r="2.5" fill="currentColor" fillOpacity="0.7" />
          <line x1="490" y1="65" x2="520" y2="85" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="520" y1="85" x2="770" y2="85" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />

          {/* Fine horizontal accent guide lines */}
          <line x1="60" y1="50" x2="220" y2="50" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
          <line x1="580" y1="50" x2="740" y2="50" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
        </svg>
      </div>

      {/* Line 1: COMPUTER SCIENCE AND ENGINEERING ASSOCIATION */}
      <h2 className="font-mono text-xs sm:text-base md:text-xl lg:text-2xl font-black uppercase tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.32em] text-[var(--text-primary)] drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)] transition-colors leading-relaxed">
        Computer Science and Engineering Association
      </h2>

      {/* Line 2: PRESENTS */}
      <p className="font-mono text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.55em] sm:tracking-[0.7em] text-[var(--accent)] drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.6)] pl-[0.55em] sm:pl-[0.7em] mt-1 sm:mt-1.5">
        Presents
      </p>
    </div>
  );
};

export const Hero: React.FC = () => {
  const eventDate = EVENT_CONFIG.isoDate;
  const countdown = useCountdown(eventDate);
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: MOTION_EASE,
      },
    },
  };

  return (
    <section id="hero" className="relative py-12 sm:py-16 md:py-20 overflow-hidden border-b border-[var(--border-color)] bg-transparent transition-colors">
      <ParticleBackground />
      <Container size="lg" className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto"
        >
          {/* 0. Presenter Header (Above Logo, Below Navbar - Exactly like user screenshot) */}
          <motion.div variants={itemVariants} className="w-full">
            <PresenterHeader />
          </motion.div>

          {/* 1. Compute 50 Logo with Sci-Fi Hologram Unrolling Animation */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
            <Compute50HeroLogo shouldReduceMotion={shouldReduceMotion} />

            {/* Event Duration Legacy Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs sm:text-sm font-semibold shadow-2xs mt-3">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              <span>{EVENT_CONFIG.duration}</span>
            </div>
          </motion.div>

          {/* 2. Hero Title (Order: 2) - Only H1 in the hero with Cyberpunk Decrypt effect */}
          <motion.h1
            variants={itemVariants}
            aria-label="COMPUTE 50"
            className="font-mono font-black tracking-normal text-[var(--text-primary)] leading-none text-center select-none"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)', letterSpacing: '0' }}
          >
            <span aria-hidden="true">
              <DecryptText
                text="COMPUTE 50"
                highlightText="50"
                highlightClassName="text-[var(--accent)]"
              />
            </span>
          </motion.h1>

          {/* 3. Slogan (Order: 3) - Slogan <p>, not a heading */}
          <motion.p
            variants={itemVariants}
            aria-label="From Legacy to Limitless"
            className="font-medium text-[var(--text-primary)] max-w-2xl mx-auto leading-snug tracking-tight text-center [text-wrap:balance]"
            style={{ fontSize: 'clamp(1.25rem, 3.2vw, 2.25rem)' }}
          >
            <span aria-hidden="true" className="inline-block">
              <span className="inline-block whitespace-nowrap">From</span>{' '}
              <span className="inline-block whitespace-nowrap">Legacy</span>{' '}
              <span className="inline-block whitespace-nowrap">to</span>{' '}
              <span className="inline-block whitespace-nowrap text-[var(--accent)] font-bold">
                Limitless
              </span>
            </span>
          </motion.p>

          {/* 4. Muted Tagline (Order: 4) */}
          <motion.p
            variants={itemVariants}
            aria-label={home.tagline}
            className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed text-center [text-wrap:balance]"
          >
            <span aria-hidden="true" className="inline-block">
              <span className="inline-block whitespace-nowrap">Celebrating</span>{' '}
              <span className="inline-block whitespace-nowrap">50</span>{' '}
              <span className="inline-block whitespace-nowrap">Years.</span>{' '}
              <span className="inline-block whitespace-nowrap">Creating</span>{' '}
              <span className="inline-block whitespace-nowrap">the</span>{' '}
              <span className="inline-block whitespace-nowrap">Next.</span>
            </span>
          </motion.p>

          {/* 5. Two-Round Format & Important Notice */}
          <motion.div variants={itemVariants} className="w-full max-w-xl sm:max-w-2xl space-y-4 pt-2">
            {/* Event Dates — Prominent highlighted badge */}
            <div className="flex items-center justify-center">
              <div className="animate-hero-date-glow inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--accent-muted)] border border-[var(--accent)]/40">
                <Calendar className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-[var(--accent)] tracking-wide whitespace-nowrap">
                  {EVENT_CONFIG.dates}
                </span>
              </div>
            </div>

            {/* Separate Round Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
              {/* Round 1 — Online */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                  <Laptop className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] tracking-wide">
                      ROUND 1
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-slate-950 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Participate remotely from your location.
                  </p>
                </div>
              </div>

              {/* Round 2 — On Campus */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors flex items-start gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] tracking-wide">
                      ROUND 2
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-[10px] font-bold uppercase tracking-wider">
                      ON CAMPUS
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    PSG College of Technology, Coimbatore.
                  </p>
                </div>
              </div>
            </div>

            {/* Notice Strip */}
            <div className="w-full p-3 sm:py-3 sm:px-4 rounded-xl bg-[var(--accent-muted)]/50 border border-[var(--accent)]/30 text-left flex items-start gap-2.5 sm:gap-3">
              <AlertCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                <strong className="text-[var(--accent)] font-mono font-bold uppercase tracking-wider mr-1.5">
                  IMPORTANT:
                </strong>
                Round 1 is conducted entirely online. Only shortlisted teams will attend the on-campus final round at PSG Tech.
              </p>
            </div>
          </motion.div>

          {/* 6. Countdown (Order: 6) */}
          <motion.div variants={itemVariants} className="w-full max-w-xl sm:max-w-2xl">
            <div className="w-full p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-lg">
              <p className="text-xs uppercase font-semibold text-[var(--text-secondary)] tracking-wider mb-4 font-mono">
                Hackathon starts in
              </p>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-[var(--accent)] font-mono">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase">Days</span>
                </div>
                <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-[var(--accent)] font-mono">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase">Hours</span>
                </div>
                <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-[var(--accent)] font-mono">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase">Mins</span>
                </div>
                <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                  <span className="animate-countdown-tick block text-2xl sm:text-4xl font-extrabold text-[var(--accent)] font-mono">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase">Secs</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 7. Action Buttons (Order: 7) */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button
                size="lg"
                variant="primary"
                className="bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] font-extrabold shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.55)] transition-all"
                leftIcon={<UserPlus className="w-5 h-5 text-[var(--accent-text)]" />}
                rightIcon={<ArrowRight className="w-5 h-5 text-[var(--accent-text)]" />}
              >
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" leftIcon={<LogIn className="w-5 h-5" />}>
                Participant Login
              </Button>
            </Link>
          </motion.div>

          {/* 8. Supporting Logos Bar (Order: 8 - Compact Balanced Row) */}
          <motion.div
            variants={itemVariants}
            className="pt-5 border-t border-[var(--border-color)] w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 opacity-90"
          >
            <div className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest font-mono">
              Organized by
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-[var(--text-primary)] font-semibold text-sm">
              <InstitutionLogo
                name={EVENT_CONFIG.college}
                shortName={EVENT_CONFIG.collegeShort}
                logoSrc={psgLogo}
                href={EVENT_CONFIG.collegeWebsite}
              />
              <InstitutionLogo
                name={EVENT_CONFIG.organizerFull}
                shortName={EVENT_CONFIG.organizerShort}
                logoSrc={cseaLogo}
                href={EVENT_CONFIG.organizerWebsite}
              />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
