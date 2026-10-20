import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Container } from '../common/Container';
import { EVENT_CONFIG } from '../../config/event';
import compute50Logo from '../../assets/logos/compute 50 logo.png';
import { HolographicContactSection } from './HolographicContactSection';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { InstagramIcon } from '../common/InstagramIcon';
import { RepellingTeamOrb } from './RepellingTeamOrb';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-14 pb-28 md:pb-14 text-[var(--text-secondary)] text-sm transition-colors relative z-10 overflow-hidden"
    >
      {/* Background Circuit Grid & Tech Trace Overlay (Infinitum aesthetic) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--accent) 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Decorative Cyberpunk Circuit Traces */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15 dark:opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 60 L 300 60 L 340 100 L 700 100 M 740 100 L 1100 100 L 1140 60 L 1920 60"
          stroke="var(--accent)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 120 180 L 400 180 L 440 140 L 800 140 M 860 140 L 1200 140 L 1240 180 L 1800 180"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d="M 50 320 L 280 320 L 320 360 L 650 360 M 750 360 L 1050 360 L 1090 320 L 1880 320"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="none"
        />
        {/* Terminal node circles with subtle pulse */}
        <circle cx="300" cy="60" r="3" fill="var(--accent)" className="animate-pulse" />
        <circle cx="700" cy="100" r="3" fill="var(--accent)" className="animate-pulse [animation-delay:400ms]" />
        <circle cx="740" cy="100" r="3" fill="var(--accent)" className="animate-pulse [animation-delay:800ms]" />
        <circle cx="1140" cy="60" r="3" fill="var(--accent)" className="animate-pulse [animation-delay:1200ms]" />
        <circle cx="440" cy="140" r="2.5" fill="var(--accent)" className="animate-pulse [animation-delay:600ms]" />
        <circle cx="800" cy="140" r="2.5" fill="var(--accent)" className="animate-pulse [animation-delay:1000ms]" />
        <circle cx="320" cy="360" r="2.5" fill="var(--accent)" className="animate-pulse [animation-delay:300ms]" />
        <circle cx="1050" cy="360" r="2.5" fill="var(--accent)" className="animate-pulse [animation-delay:900ms]" />
      </svg>

      <Container size="lg" className="relative z-10">
        {/* ========================================================= */}
        {/* TOP BRANDING: COMPUTE 50 GLOWING EMBLEM                    */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <Link to="/" className="group inline-flex items-center gap-3 mb-2 focus:outline-hidden">
            <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src={compute50Logo}
                alt="Compute 50 Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"
              />
            </div>
            <span className="font-mono font-black text-2xl sm:text-3xl tracking-[0.25em] text-[var(--text-primary)] uppercase drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]">
              COMPUTE <span className="text-[var(--accent)]">50</span>
            </span>
          </Link>

          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent)] uppercase font-bold flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>50 YEARS OF M.E. CSE · PSG COLLEGE OF TECHNOLOGY</span>
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          </p>
        </div>

        {/* ========================================================= */}
        {/* HOLOGRAPHIC 5-CATEGORY CONTACT SECTION                    */}
        {/* (Loads names & contact details with holographic laser unroll) */}
        {/* ========================================================= */}
        <HolographicContactSection />

        {/* ========================================================= */}
        {/* MEET THE DEV TEAM INTERACTIVE ORB & HOLOGRAPHIC REVEAL    */}
        {/* (Pressing orb reveals Frontend, Backend, Coordinator)     */}
        {/* ========================================================= */}
        <RepellingTeamOrb />

        {/* ========================================================= */}
        {/* CENTER SOCIAL ICONS (Instagram, Mail, WhatsApp, Globe)    */}
        {/* ========================================================= */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {EVENT_CONFIG.instagramUrl && (
            <a
              href={EVENT_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @csea_psgtech"
              className="p-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-xs group"
            >
              <InstagramIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </a>
          )}

          <a
            href={`mailto:${EVENT_CONFIG.contactEmail}?subject=${encodeURIComponent(
              'Compute 50 General Enquiry'
            )}`}
            aria-label="Email CSEA Helpdesk"
            className="p-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-xs group"
          >
            <Mail className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          </a>

          {EVENT_CONFIG.whatsappLink && (
            <a
              href={EVENT_CONFIG.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Official WhatsApp Announcement Channel"
              className="p-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-xs group"
            >
              <WhatsAppIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </a>
          )}

          <a
            href={EVENT_CONFIG.organizerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CSEA Official Website"
            className="p-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-xs group"
          >
            <Globe className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          </a>
        </div>

        {/* ========================================================= */}
        {/* EXPLORE NAVIGATION & VENUE ROW                             */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[var(--border-color)] text-xs font-mono">
          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[var(--text-secondary)]">
            <Link to="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-[var(--accent)] transition-colors">
              About
            </Link>
            <Link to="/hackathon" className="hover:text-[var(--accent)] transition-colors">
              Hackathon
            </Link>
            <Link to="/#faq" className="hover:text-[var(--accent)] transition-colors">
              FAQs
            </Link>
            <Link to="/register" className="text-[var(--accent)] font-bold hover:underline">
              Register Squad →
            </Link>
          </div>

          {/* Campus Location */}
          <a
            href={EVENT_CONFIG.venueMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span>{EVENT_CONFIG.collegeShort}, Coimbatore - 641004</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM COPYRIGHT & ATTRIBUTION BAR                        */}
        {/* ========================================================= */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--text-secondary)] gap-2 text-center sm:text-left border-t border-[var(--border-color)]/50">
          <p>© 2026 COMPUTE 50 · ALL RIGHTS RESERVED</p>
          <p className="text-[11px] text-[var(--text-secondary)]">
            ORGANIZED BY <span className="text-[var(--text-primary)] font-bold">CSEA</span>,{' '}
            <span className="text-[var(--text-primary)] font-bold">PSG TECH</span>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
