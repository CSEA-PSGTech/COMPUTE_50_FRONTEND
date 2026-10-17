import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, UserPlus, LogIn, Sparkles, Laptop, AlertCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useCountdown } from '../../hooks/useCountdown';
import { DecryptText } from '../common/DecryptText';
import { MOTION_EASE } from '../../lib/motion';
import psgLogo from '../../assets/logos/psg-logo.png';
import cseaLogo from '../../assets/logos/csea-logo.png';
import compute50HeroEmblem from '../../assets/logos/compute-50-hero-emblem.png';
import { EVENT_CONFIG } from '../../config/event';
import { home } from '../../data/content';
import { ParticleBackground } from './ParticleBackground';

const InstitutionLogo: React.FC<{ name: string; shortName: string; logoSrc: string }> = ({
  name,
  shortName,
  logoSrc,
}) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="flex items-center gap-2.5 px-3.5 py-2 text-[var(--text-primary)] font-mono text-sm font-bold transition-transform duration-200 hover:scale-105 cursor-pointer">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
        <span>{shortName}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]/60 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm sm:text-base font-bold transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs">
      <img
        src={logoSrc}
        alt={name}
        onError={() => setHasError(true)}
        className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 dark:filter dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
      />
      <span>{shortName}</span>
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
    <section id="hero" className="relative py-20 md:py-28 overflow-hidden border-b border-[var(--border-color)] bg-transparent transition-colors">
      <ParticleBackground />
      <Container size="lg" className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto"
        >
          {/* 0. Top Emblem Logo */}
          <motion.div variants={itemVariants} className="flex items-center justify-center pt-1 pb-1">
            <img
              src={compute50HeroEmblem}
              alt="Compute 50 Emblem"
              className="animate-hero-emblem w-40 sm:w-56 md:w-64 lg:w-72 h-auto object-contain filter drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] transition-transform duration-300 hover:scale-105 select-none"
            />
          </motion.div>

          {/* 1. Top Badges (Order: 1) */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="primary" className="px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline text-[var(--accent)]" /> {EVENT_CONFIG.organizerShort}, {EVENT_CONFIG.collegeShort} Presents
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-[var(--text-primary)] font-semibold">
              {EVENT_CONFIG.duration}
            </Badge>
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

          {/* 8. Supporting Logos Bar (Order: 8) */}
          <motion.div
            variants={itemVariants}
            className="pt-8 border-t border-[var(--border-color)] w-full flex flex-wrap items-center justify-center gap-6 opacity-90"
          >
            <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest font-mono">
              Organized by
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--text-primary)] font-semibold text-sm">
              <InstitutionLogo
                name={EVENT_CONFIG.college}
                shortName={EVENT_CONFIG.collegeShort}
                logoSrc={psgLogo}
              />
              <InstitutionLogo
                name={EVENT_CONFIG.organizerFull}
                shortName={EVENT_CONFIG.organizerShort}
                logoSrc={cseaLogo}
              />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
