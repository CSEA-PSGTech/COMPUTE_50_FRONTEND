# Testing Strategy - Compute 50 Frontend

## Current Status [from code]
- **Unit & Integration Tests**: `UNKNOWN - ask owner` (No test runner or test files currently configured in `package.json` or source tree).
- **Manual Verification**: Perform runtime UI verification using the `ui-verify` skill. Run `npm run build` and `npm run lint` for type checking and static analysis.

## Regression Checklist (Page Transitions & SPA Navigation)

When modifying router layouts, page transitions, or Framer Motion `AnimatePresence` wrappers:

- [ ] **Home → About → Home (SPA Navbar)**: Verify Home page content is fully visible (`opacity: 1`, `transform: none`) upon returning to Home.
- [ ] **Home → Hackathon → Home (SPA Navbar)**: Verify Home page sections render properly without remaining in an invisible exit state.
- [ ] **Browser Back/Forward Navigation**: Verify navigation history back/forward renders pages at full opacity.
- [ ] **Rapid Route Switching**: Click rapidly between routes (Home → About → Home → Hackathon → Home 10+ times) to verify `AnimatePresence` does not freeze or lock the container at `opacity: 0`.
- [ ] **Same Route Clicks**: Clicking "Home" while already on Home does not trigger a broken exit animation or hide page content.
- [ ] **Mobile Drawer Navigation**: Verify mobile width (375px) drawer navigation transitions smoothly without blank pages.
- [ ] **Direct URL Loads & Refreshes**: Direct loads of `/`, `/about`, `/hackathon` load cleanly.
- [ ] **Preserved Core Animations**:
  - Speaker cards expand/collapse deck animation (`src/components/home/SpeakersSection.tsx`).
  - Sponsor counter-clockwise rotation carousel (`src/components/home/SponsorsSection.tsx`).
