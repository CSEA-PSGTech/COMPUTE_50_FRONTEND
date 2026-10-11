# PRD - Compute 50 Frontend

## Overview
- **Name**: Compute 50 Frontend [from code]
- **One-liner**: Official web platform for the Compute 50 anniversary celebration and national hackathon hosted by CSEA at PSG College of Technology. [from code]
- **Platform**: Web (Responsive Single-Page Application using React 19 + Vite) [from code]

## Problem and Users
- **Problem**: Need an interactive, high-impact web portal for Compute 50 event announcements, hackathon guidelines, speaker rosters, track definitions, sponsor visibility, user authentication, and team registration management. [from code]
- **Who has it**: Engineering students, hackathon participants, judges, event organizers (CSEA), and corporate sponsors. [from code]
- **How they cope today**: Navigating static PDFs, disparate registration links, and fragmented social media channels. [from code]

## Current Pages & Structure [from code]
- **Home Page (`/`)**: [`src/pages/Home.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/Home.tsx)
  - Hero ([`Hero.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/Hero.tsx))
  - Prize Pool ([`PrizePool.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/PrizePool.tsx))
  - About Section ([`AboutSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/AboutSection.tsx))
  - Schedule Section ([`ScheduleSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/ScheduleSection.tsx))
  - Tracks Section ([`TracksSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/TracksSection.tsx))
  - Speakers Section ([`SpeakersSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SpeakersSection.tsx))
  - Sponsors Section ([`SponsorsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SponsorsSection.tsx))
  - Events Section ([`EventsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/EventsSection.tsx))
  - FAQ Section ([`FaqSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/FaqSection.tsx))
- **About Page (`/about`)**: [`src/pages/About.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/About.tsx)
  - Sticky Sub-Navigation ([`AboutStickyNav.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/AboutStickyNav.tsx))
  - Photo Strip ([`PhotoStrip.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/PhotoStrip.tsx))
  - Event Theme ([`EventTheme.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/EventTheme.tsx))
  - About Compute 50 ([`AboutCompute50.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/AboutCompute50.tsx))
  - PSG Tech Overview ([`AboutPsgTech.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/AboutPsgTech.tsx))
  - CSEA Overview ([`AboutCsea.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/AboutCsea.tsx))
  - Affiliated Clubs ([`AffiliatedClubs.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/AffiliatedClubs.tsx))
- **Hackathon Portal (`/hackathon`)**: [`src/pages/Hackathon.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/Hackathon.tsx)
  - Overview, Prize Breakdown, Tracks, Problem Statements, Rules & Guidelines, Schedule, Important Info
- **Authentication & User Profile**:
  - `/login`: [`src/pages/Login.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/Login.tsx)
  - `/register`: [`src/pages/Register.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/Register.tsx) — Features 4 interactive Clash Royale style team reveal cards (`TeamRevealCards.tsx`) with 3D Y-axis flip transforms, particle bursts, focus-trapped edit dialogs / mobile bottom sheets, per-member roll number/phone validation, duplicate detection, and progress indicator (`x / 4 Members Ready`).
  - `/profile`: [`src/pages/Profile.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/Profile.tsx)
- **Error Page (`*`)**: [`src/pages/NotFound.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/pages/NotFound.tsx)

## Stakeholder Feedback
- **Feedback Summary**: Seniors noted that the site currently has too much content, requires excessive vertical scrolling, and needs stronger dynamic animations to captivate visitors.
- **Must Preserve**:
  1. **Color Theme**: Neon lime & sleek dark theme tokens (`:root` & `.dark` defined in [`src/index.css`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/index.css)).
  2. **Expandable/Collapsible Speaker Deck Animation**: 3D stack and flyout grid transformation in [`src/components/home/SpeakersSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SpeakersSection.tsx).
  3. **Counter-Clockwise Sponsor Rotation**: Infinite scrolling carousel in [`src/components/home/SponsorsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SponsorsSection.tsx).

## Non-goals
- Building backend server infrastructure in this frontend repository.
- Managing database schemas or direct SQL/ORM migrations in client repository.

## Open Questions & UNKNOWN Items
- `UNKNOWN - ask owner`: What unit and component testing framework (e.g., Vitest + React Testing Library) should be installed and configured for test script compliance?
- `UNKNOWN - ask owner`: What is the official live backend API URL for production deployment?
- `UNKNOWN - ask owner`: Should stub components returning `null` (`ParticleBackground.tsx`, `StickyMobileRegister.tsx`) be implemented or pruned?
- `UNKNOWN - ask owner`: Should duplicate `CountUp` components ([`about/CountUp.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/about/CountUp.tsx) vs [`common/CountUp.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/CountUp.tsx)) be refactored into a single shared utility?

