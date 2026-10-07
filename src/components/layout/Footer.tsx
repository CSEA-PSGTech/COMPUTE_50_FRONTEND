import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Share2 } from 'lucide-react';
import { Container } from '../common/Container';
import { EVENT_CONFIG } from '../../config/event';

import compute50Logo from '../../assets/logos/compute 50 logo.png';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-12 pb-8 text-[var(--text-secondary)] text-sm transition-colors">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[var(--border-color)]">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 cursor-pointer">
                <img src={compute50Logo} alt="Compute 50" className="w-full h-full object-contain transition-transform duration-200" />
              </div>
              <span className="font-extrabold text-lg text-[var(--text-primary)] tracking-tight">
                COMPUTE <span className="text-[var(--accent)]">50</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              National 2-Day Hackathon hosted by {EVENT_CONFIG.organizerFull} at {EVENT_CONFIG.college}.
            </p>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <a href="https://psgtech.edu" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="hover:text-[var(--accent)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href={EVENT_CONFIG.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[var(--text-primary)] font-semibold text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[var(--accent)] transition-colors">About {EVENT_CONFIG.collegeShort} & {EVENT_CONFIG.organizerShort}</Link>
              </li>
              <li>
                <Link to="/hackathon" className="hover:text-[var(--accent)] transition-colors">Hackathon Tracks & Rules</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[var(--accent)] transition-colors">Participant Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[var(--accent)] transition-colors">Register</Link>
              </li>
              <li>
                <a href={EVENT_CONFIG.organizerWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1">
                  <span>CSEA Official Website</span>
                  <Globe className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <h4 className="text-[var(--text-primary)] font-semibold text-xs uppercase tracking-wider">Event Details</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-[var(--text-secondary)]">Event Mode: Round 1 Online · Finals at PSG Tech</li>
              <li className="text-[var(--text-secondary)]">Duration: {EVENT_CONFIG.duration}</li>
              <li className="text-[var(--text-secondary)]">Team Size: {EVENT_CONFIG.teamSize}</li>
              <li className="text-[var(--text-secondary)]">Eligibility: All College Students</li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-[var(--text-primary)] font-semibold text-xs uppercase tracking-wider">Contact & Venue</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>{EVENT_CONFIG.venueFull}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>{EVENT_CONFIG.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4">
          <p>{EVENT_CONFIG.footerCopyright}</p>
        </div>
      </Container>
    </footer>
  );
};
