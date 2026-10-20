import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
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

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-14 pb-8 text-[var(--text-secondary)] text-sm transition-colors relative z-10"
    >
      <Container size="lg">
        <div className="mx-auto mb-10 flex w-fit flex-col items-center gap-3">
          <Link to="/" className="group flex flex-col items-center gap-3" aria-label="Compute 50 home">
            <img
              src={compute50Logo}
              alt="Compute 50"
              className="h-14 w-14 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-mono text-sm font-bold tracking-[0.32em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
              COMPUTE <span className="text-[var(--accent)]">50</span>
            </span>
          </Link>
          <span className="h-px w-24 bg-[var(--accent)]/60" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-[var(--border-color)]/80">
          {SUPPORT_CONTACTS.map((item, index) => (
            <section
              key={item.id}
              className={`group px-5 py-6 text-center ${index > 0 ? 'lg:border-l border-[var(--border-color)]/70' : ''} ${index % 2 === 1 ? 'sm:border-l border-[var(--border-color)]/70' : ''} ${index >= 2 ? 'sm:border-t lg:border-t-0 border-[var(--border-color)]/70' : ''}`}
            >
              <h2 className="mb-4 border-b border-[var(--border-color)]/70 pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                {item.category}
              </h2>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                  {item.contactName}
                </p>
                <p className="text-[11px] italic text-[var(--text-secondary)]">{item.role}</p>
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/\s+/g, '')}`}
                    className="mx-auto flex w-fit items-center gap-2 pt-1 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                    aria-label={`Call ${item.contactName} at ${item.phone}`}
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.phone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${item.email}?subject=${encodeURIComponent(`Compute 50 - ${item.category}`)}`}
                  className="mx-auto flex w-fit max-w-full items-center gap-2 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                  aria-label={`Email ${item.contactName} at ${item.email}`}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">{item.email}</span>
                </a>
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex items-center gap-5">
            {EVENT_CONFIG.instagramUrl && (
              <a
                href={EVENT_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compute 50 on Instagram"
                className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            <a
              href={`mailto:${EVENT_CONFIG.contactEmail}`}
              aria-label={`Email ${EVENT_CONFIG.contactEmail}`}
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            © 2026 Compute 50 · Organized by CSEA, PSG Tech
          </p>
        </div>
      </Container>
    </footer>
  );
};
