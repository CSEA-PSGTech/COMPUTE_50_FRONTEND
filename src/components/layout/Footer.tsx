import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  HelpCircle,
  UserCheck,
  Calendar,
  Cpu,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Container } from '../common/Container';
import { EVENT_CONFIG, SUPPORT_CONTACTS } from '../../config/event';
import compute50Logo from '../../assets/logos/compute 50 logo.png';

// Accessible Instagram SVG Icon
const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  general: <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
  registration: <UserCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
  event: <Calendar className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
  technical: <Cpu className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
};

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-14 pb-8 text-[var(--text-secondary)] text-sm transition-colors relative z-10"
    >
      <Container size="lg">
        {/* ========================================================= */}
        {/* TIER 1: CONTACT & SUPPORT HEADER                           */}
        {/* ========================================================= */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[var(--accent)] uppercase">
            ASSISTANCE & DIRECT SUPPORT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[var(--text-primary)] uppercase">
            NEED HELP? WE'RE HERE.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Have questions about Compute 50? Reach out to the appropriate team and we'll help you get sorted.
          </p>
        </div>

        {/* ========================================================= */}
        {/* TIER 2: FOUR CONTACT CATEGORY COLUMNS                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-[var(--border-color)]">
          {SUPPORT_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--accent)]/50 transition-all duration-200 group"
            >
              {/* Header & Role */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                  {CATEGORY_ICONS[item.id]}
                  <span>{item.category}</span>
                </div>

                <div>
                  <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                    {item.contactName}
                  </h3>
                  <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                    {item.role}
                  </p>
                </div>

                <p className="text-xs text-[var(--text-secondary)]/80 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              {/* Direct Communication Channels */}
              <div className="pt-4 mt-3 border-t border-[var(--border-color)]/60 space-y-2">
                {item.phone && (
                  <div>
                    <a
                      href={`tel:${item.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                      aria-label={`Call ${item.contactName} at ${item.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span>{item.phone}</span>
                    </a>
                  </div>
                )}

                <div>
                  <a
                    href={`mailto:${item.email}?subject=${encodeURIComponent(`Compute 50 - ${item.category}`)}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors break-all"
                    aria-label={`Email ${item.contactName} at ${item.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span>{item.email}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TIER 3: BRANDING, EXPLORE & CONNECT                        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b border-[var(--border-color)]">
          {/* Column 1: Compute 50 Branding (5 cols) */}
          <div className="space-y-4 md:col-span-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 cursor-pointer">
                <img
                  src={compute50Logo}
                  alt="Compute 50 Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-mono font-extrabold text-lg text-[var(--text-primary)] tracking-tight">
                COMPUTE <span className="text-[var(--accent)]">50</span>
              </span>
            </Link>

            <p className="text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
              {EVENT_CONFIG.tagline}
            </p>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              2-Day Technical Innovation Challenge commemorating 50 years of the M.E. CSE
              programme at {EVENT_CONFIG.college}. Hosted by {EVENT_CONFIG.organizerFull}. Open to {EVENT_CONFIG.eligibility.toLowerCase()}.
            </p>

            {/* Venue & Location Link */}
            <div className="pt-1">
              <a
                href={EVENT_CONFIG.venueMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
                aria-label="View PSG Tech campus location on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="leading-snug">{EVENT_CONFIG.venueFull}</span>
              </a>
            </div>
          </div>

          {/* Column 2: EXPLORE (3 cols) */}
          <div className="space-y-3.5 md:col-span-3">
            <h4 className="text-[var(--text-primary)] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link
                  to="/"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block"
                >
                  Home Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block"
                >
                  About {EVENT_CONFIG.collegeShort} & {EVENT_CONFIG.organizerShort}
                </Link>
              </li>
              <li>
                <Link
                  to="/hackathon"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block"
                >
                  Hackathon Tracks & Rules
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[var(--accent)] hover:underline font-bold inline-block"
                >
                  Register Team →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CONNECT (4 cols) */}
          <div className="space-y-3.5 md:col-span-4">
            <h4 className="text-[var(--text-primary)] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              CONNECT
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <a
                  href={EVENT_CONFIG.organizerWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>CSEA Official Website</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                </a>
              </li>
              {EVENT_CONFIG.instagramUrl && (
                <li>
                  <a
                    href={EVENT_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span>Instagram (@csea_psgtech)</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                  </a>
                </li>
              )}
              <li>
                <a
                  href={EVENT_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Official WhatsApp Channel</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EVENT_CONFIG.contactEmail}`}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Email: {EVENT_CONFIG.contactEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={EVENT_CONFIG.collegeWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                  <span>PSG Tech Main Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TIER 4: COPYRIGHT & ATTRIBUTION BAR                        */}
        {/* ========================================================= */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--text-secondary)] gap-3 text-center sm:text-left">
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
