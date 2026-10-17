# Compute 50 Frontend — UX Feature Additions

> **Author:** Vishnu  
> **Date:** October 2, 2026  
> **Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion

This document outlines the 12 UX/UI features added to the Compute 50 hackathon portal frontend to enhance user experience, interactivity, and overall polish.

---

## Table of Contents

1. [Toast Notification System](#1-toast-notification-system)
2. [Smooth Page Transitions](#2-smooth-page-transitions)
3. [Back-to-Top Button](#3-back-to-top-button)
4. [Skeleton Loading States](#4-skeleton-loading-states)
5. [Password Strength Indicator](#5-password-strength-indicator)
6. [Hero Particle Background](#6-hero-particle-background)
7. [Cursor Glow Effect](#7-cursor-glow-effect)
8. [Confetti on Registration Success](#8-confetti-on-registration-success)
9. [Swipeable Schedule Cards](#9-swipeable-schedule-cards)
10. [Mobile Bottom Navigation Bar](#10-mobile-bottom-navigation-bar)
11. [Pull-to-Refresh on Profile](#11-pull-to-refresh-on-profile)
12. [Custom 404 Page](#12-custom-404-page)

---

## 1. Toast Notification System

**What it does:**  
A global notification system that shows contextual feedback toasts (success, error, warning, info) in the bottom-right corner of the screen. Toasts auto-dismiss after 4 seconds and can be manually dismissed. Used across login, registration, profile updates, team creation, and logout flows.

**How it works:**  
- A `ToastContext` manages toast state globally via React Context.
- `ToastContainer` renders an `AnimatePresence`-powered stack of animated toasts.
- Any component can trigger a toast via the `useToast()` hook: `addToast('Message', 'success')`.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/context/ToastContext.tsx` | Context provider managing toast state (add, remove, auto-dismiss) |
| `src/components/common/ToastContainer.tsx` | Renders animated toast notifications with icons and color-coded borders |
| `src/hooks/useToast.ts` | Custom hook to access `addToast` and `removeToast` from any component |

**Files Edited:**
| File | Change |
|------|--------|
| `src/App.tsx` | Wrapped app in `<ToastProvider>` and added `<ToastContainer />` |
| `src/components/auth/LoginForm.tsx` | Added toast calls on login success, failure, and password reset |
| `src/components/auth/RegisterForm.tsx` | Added toast calls on registration success and failure |
| `src/pages/Profile.tsx` | Added toast calls on profile load error, save, team create, and logout |

---

## 2. Smooth Page Transitions

**What it does:**  
Adds animated fade + slide transitions between route changes instead of hard page swaps. Uses Framer Motion's `AnimatePresence` with `mode="wait"` to smoothly exit the current page and enter the new one.

**How it works:**  
- The `<Outlet />` in `MainLayout` is wrapped in `AnimatePresence` and a `motion.div` keyed by `location.pathname`.
- Each page fades in with a slight upward slide (12px), and exits with a slight upward slide (-8px).

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/common/PageTransition.tsx` | Reusable page transition wrapper component (available for standalone use) |

**Files Edited:**
| File | Change |
|------|--------|
| `src/layouts/MainLayout.tsx` | Wrapped `<Outlet />` in `AnimatePresence` + `motion.div` with location-keyed transitions |

---

## 3. Back-to-Top Button

**What it does:**  
A floating circular button with an arrow icon that appears in the bottom-right corner after scrolling 400px. Clicking it smoothly scrolls back to the top. Positioned above the mobile bottom nav bar to avoid overlap.

**How it works:**  
- Listens to `scroll` events (with `{ passive: true }` for performance).
- Uses Framer Motion for enter/exit animations (scale + fade).
- Includes hover and tap micro-interactions.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/common/BackToTop.tsx` | Floating scroll-to-top button with animated show/hide |

**Files Edited:**
| File | Change |
|------|--------|
| `src/layouts/MainLayout.tsx` | Added `<BackToTop />` to the layout |

---

## 4. Skeleton Loading States

**What it does:**  
Replaces the generic spinner loading screen on the Profile page with skeleton loaders — pulsing placeholder shapes that mirror the actual page layout. This gives users a visual preview of the content structure while data loads.

**How it works:**  
- A base `Skeleton` component supports `text`, `circle`, and `rect` variants with configurable dimensions.
- `ProfileSkeleton` is a pre-composed layout matching the Profile page structure (header, personal details grid, status cards, team section).

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/common/Skeleton.tsx` | Base skeleton component + `ProfileSkeleton` pre-composed layout |

**Files Edited:**
| File | Change |
|------|--------|
| `src/pages/Profile.tsx` | Replaced `<LoadingState>` spinner with `<ProfileSkeleton />` |

---

## 5. Password Strength Indicator

**What it does:**  
Shows real-time password strength feedback on the registration form. Includes an animated progress bar (Very Weak → Excellent) and a checklist of 5 requirements with check/cross icons.

**Criteria scored:**
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

**How it works:**  
- Evaluates password against 5 regex-based criteria.
- Animated bar width and color update live via Framer Motion.
- Requirements show green checkmarks when met, gray crosses when not.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/auth/PasswordStrength.tsx` | Password strength bar + requirements checklist component |

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/auth/RegisterForm.tsx` | Added `<PasswordStrength password={formData.password} />` below password input |

---

## 6. Hero Particle Background

**What it does:**  
Renders floating code characters (`0`, `1`, `{`, `}`, `<`, `>`, `#`, `@`, etc.) on a canvas behind the hero section. Characters drift slowly, react to mouse movement (repulsion effect), and connect with faint lines when close to each other.

**How it works:**  
- Uses HTML5 `<canvas>` with `requestAnimationFrame` for smooth 60fps rendering.
- 60 particles with random velocities, sizes, and opacity.
- Mouse proximity triggers a repulsion force within 120px radius.
- Faint connection lines drawn between particles within 140px.
- Characters randomly change to create a "matrix" effect.
- Respects `prefers-reduced-motion` media query.
- Theme-aware: adapts particle color for dark/light mode.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/home/ParticleBackground.tsx` | Canvas-based particle system with mouse interaction |

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/home/Hero.tsx` | Added `<ParticleBackground />` inside the hero `<section>` |

---

## 7. Cursor Glow Effect

**What it does:**  
A subtle radial glow (400×400px, 4% opacity, 80px blur) that smoothly follows the mouse cursor across the entire page. Creates a premium, interactive ambient light feel. Only visible on desktop (hidden on mobile via `md:block`).

**How it works:**  
- Tracks mouse position via `mousemove` event.
- Applies lerp (linear interpolation) smoothing at factor 0.1 for fluid movement.
- Renders as a fixed-position `div` with CSS blur — no canvas overhead.
- Respects `prefers-reduced-motion`.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/common/CursorGlow.tsx` | Mouse-following radial glow effect |

**Files Edited:**
| File | Change |
|------|--------|
| `src/layouts/MainLayout.tsx` | Added `<CursorGlow />` to the layout |

---

## 8. Confetti on Registration Success

**What it does:**  
Fires a celebratory confetti burst when a user successfully registers. Three waves of confetti particles in hackathon-themed colors (lime green, amber, orange) burst from different origin points.

**How it works:**  
- Uses the `canvas-confetti` library (lightweight, ~4KB).
- Three staggered bursts from left, right, and center create a full-screen effect.
- Navigation to `/profile` is delayed by 1.2 seconds so users can enjoy the moment.

**Dependencies Added:**
| Package | Purpose |
|---------|---------|
| `canvas-confetti` | Lightweight confetti animation library |
| `@types/canvas-confetti` | TypeScript type definitions |

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/auth/RegisterForm.tsx` | Added `fireConfetti()` on successful registration |
| `package.json` | Added `canvas-confetti` and `@types/canvas-confetti` |

---

## 9. Swipeable Schedule Cards

**What it does:**  
The 2-day event schedule now supports horizontal swipe gestures on mobile to switch between Day 1 and Day 2. Also adds animated slide transitions when switching days (either via swipe or tab click), staggered card entry animations, and an animated tab indicator.

**How it works:**  
- Framer Motion's `drag="x"` enables horizontal drag on the schedule container.
- `onDragEnd` checks if swipe distance exceeds 50px threshold to trigger day switch.
- `AnimatePresence` with custom directional variants animates content in/out.
- A "Swipe to switch days" hint is shown on mobile.
- Tab indicator uses `layoutId` for smooth animated tab switching.

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/home/ScheduleSection.tsx` | Full rewrite with swipe support, animated transitions, and staggered entry |

---

## 10. Mobile Bottom Navigation Bar

**What it does:**  
Replaces the hamburger menu pattern on mobile with a persistent bottom navigation bar containing 4 primary destinations: Home, About, Hackathon, and Login/Profile (context-aware based on auth state).

**Features:**
- Animated active indicator (top border line) with `layoutId` spring animation.
- Scale animation on active icon.
- Safe area padding for phones with gesture bars (`env(safe-area-inset-bottom)`).
- Hidden on desktop via `md:hidden`.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/layout/BottomNav.tsx` | Persistent mobile bottom navigation bar |

**Files Edited:**
| File | Change |
|------|--------|
| `src/layouts/MainLayout.tsx` | Added `<BottomNav />` and `pb-16 md:pb-0` padding to prevent content overlap |

---

## 11. Pull-to-Refresh on Profile

**What it does:**  
On mobile, users can pull down on the Profile page to refresh their profile data (registration status, team info, etc.). Shows an animated refresh indicator with rotation feedback proportional to pull distance.

**How it works:**  
- Touch events (`touchstart`, `touchmove`, `touchend`) track pull gesture.
- Pull distance is dampened (×0.5) with resistance for natural feel.
- 80px threshold triggers refresh callback.
- Spinning `RefreshCw` icon during data fetch.
- Only renders on mobile (`md:hidden` wrapper).

**Files Added:**
| File | Purpose |
|------|---------|
| `src/components/common/PullToRefresh.tsx` | Touch-based pull-to-refresh component with animated indicator |

**Files Edited:**
| File | Change |
|------|--------|
| `src/pages/Profile.tsx` | Wrapped profile content in `<PullToRefresh>` for mobile |

---

## 12. Custom 404 Page

**What it does:**  
Replaces the silent redirect-to-home with a themed 404 error page. Features a large animated "4 `</>` 4" display (with the Compute 50 code icon as the zero), a descriptive message, navigation buttons (Back to Home, Go Back), and a terminal-style easter egg that shows the actual broken URL.

**Features:**
- Pulsing glow effect on the "4" digits.
- Fake terminal UI with traffic light dots and blinking cursor.
- Dynamically shows `window.location.pathname` in the terminal output.
- Smooth entry animation via Framer Motion.

**Files Added:**
| File | Purpose |
|------|---------|
| `src/pages/NotFound.tsx` | Custom themed 404 error page with terminal easter egg |

**Files Edited:**
| File | Change |
|------|--------|
| `src/routes/AppRouter.tsx` | Changed `<Navigate to="/" replace />` to `<NotFound />` for catch-all route |

---

## Additional Fixes

Along with the 12 features above, the following theme/accessibility fixes were also applied:

| File | Fix |
|------|-----|
| `src/components/auth/LoginForm.tsx` | Replaced hardcoded `text-slate-*` and `bg-slate-*` colors with `var(--text-primary)`, `var(--text-secondary)`, `var(--bg-surface)`, `var(--border-color)`, and `var(--accent)` CSS variables for proper light/dark mode support |
| `src/components/auth/LoginForm.tsx` | Replaced `alert()` for password reset with toast notification |
| `src/components/auth/RegisterForm.tsx` | Same theme variable fixes as LoginForm |

---

## Complete File Summary

### New Files Created (12)

| # | File Path | Feature |
|---|-----------|---------|
| 1 | `src/context/ToastContext.tsx` | Toast system |
| 2 | `src/components/common/ToastContainer.tsx` | Toast system |
| 3 | `src/hooks/useToast.ts` | Toast system |
| 4 | `src/components/common/BackToTop.tsx` | Back-to-top |
| 5 | `src/components/common/Skeleton.tsx` | Skeleton loading |
| 6 | `src/components/common/PageTransition.tsx` | Page transitions |
| 7 | `src/components/common/CursorGlow.tsx` | Cursor glow |
| 8 | `src/components/common/PullToRefresh.tsx` | Pull-to-refresh |
| 9 | `src/components/auth/PasswordStrength.tsx` | Password strength |
| 10 | `src/components/home/ParticleBackground.tsx` | Hero particles |
| 11 | `src/components/layout/BottomNav.tsx` | Bottom nav |
| 12 | `src/pages/NotFound.tsx` | 404 page |

### Existing Files Modified (8)

| # | File Path | Features Integrated |
|---|-----------|---------------------|
| 1 | `src/App.tsx` | Toast provider |
| 2 | `src/layouts/MainLayout.tsx` | Page transitions, back-to-top, cursor glow, bottom nav, announcement popup |
| 3 | `src/routes/AppRouter.tsx` | 404 page route |
| 4 | `src/components/home/Hero.tsx` | Particle background |
| 5 | `src/components/home/ScheduleSection.tsx` | Swipeable schedule |
| 6 | `src/components/auth/RegisterForm.tsx` | Password strength, confetti, toasts, theme fixes |
| 7 | `src/components/auth/LoginForm.tsx` | Toasts, theme fixes |
| 8 | `src/pages/Profile.tsx` | Skeleton loading, pull-to-refresh, toasts |

### Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `canvas-confetti` | latest | Confetti animation on registration success |
| `@types/canvas-confetti` | latest | TypeScript types for canvas-confetti |

---

## 13. Hero Section Animations & Event Date Highlight

**What it does:**  
Adds gentle, subtle entrance and micro-animations to key elements of the Hero section, and redesigns the event date into a prominent, glowing pill badge.

**Key changes:**
- **Floating Emblem**: 4s ease-in-out infinite floating animation (`animate-hero-emblem`) for the Compute 50 emblem logo.
- **Pulsing Date Badge**: Redesigned the event date from a plain, small text string into a bold `text-base sm:text-lg md:text-xl` font inside a rounded pill badge with `var(--accent-muted)` background, accent border, and a 3s pulsing glow shadow (`animate-hero-date-glow`).
- **Countdown Tick**: Subtle scale pulse on the countdown seconds digit (`animate-countdown-tick`).
- **Accessibility**: All animations are automatically disabled when `prefers-reduced-motion` is active.

**Files Edited:**
| File | Change |
|------|--------|
| `src/index.css` | Added `--accent-rgb` tokens, `@keyframes hero-emblem-float`, `@keyframes hero-date-glow`, and `@keyframes countdown-tick` utilities |
| `src/components/home/Hero.tsx` | Integrated animation classes and redesigned the event date section |

---

## 14. Prize Pool Light Mode Contrast & Alignment Fix

**What it does:**  
Fixes text glare/invisibility in light mode and prevents the `+` symbol from breaking onto a separate line underneath the amount.

**Key changes:**
- **Light Mode Visibility**: The huge amount (`₹2,50,000`) previously used a hardcoded `from-white` gradient designed only for dark mode. Replaced with `from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--accent)]`, ensuring high-contrast readability against both white and dark backgrounds.
- **Single-Line '+' Alignment**: Used `flex items-baseline flex-nowrap whitespace-nowrap` with `shrink-0` on the `+` sign and adjusted responsive font scale (`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`), ensuring the `+` is locked on the same line as the number across all screen sizes.
- **Palette Consistency**: Converted all hardcoded lime green RGB values to `rgba(var(--accent-rgb), ...)` and button text to `text-[var(--accent-text)]` to work harmoniously with both the amber/gold and neon color palettes.

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/home/PrizePool.tsx` | Theme-aware gradient text, single-line flex baseline layout for the `+` sign, and dynamic accent RGB variables |

---

## 15. Team Reveal Cards Theme Color Consistency Fix

**What it does:**  
Resolves mismatched card background colors where uncompleted cards (Card 03 and Card 04) rendered as solid black `#121216` cards even in light mode, while completed cards rendered as white.

**Key changes:**
- **Uniform Surface Colors**: Replaced hardcoded `#121216` background and `#24242A` border with semantic `var(--bg-surface)` and `var(--border-color)`. Now, all four cards (01, 02, 03, 04) share identical surface styling in both light and dark modes.
- **Theme Variables**: Replaced hardcoded `text-slate-950` with `text-[var(--accent-text)]` on action buttons and status badges.
- **Mobile & Flip Views**: Updated the flip form faces and mobile grid view to use `var(--bg-surface)` and `var(--border-color)`.

**Files Edited:**
| File | Change |
|------|--------|
| `src/components/hackathon/TeamRevealCards.tsx` | Replaced hardcoded `#121216` and `#24242A` with `var(--bg-surface)` and `var(--border-color)` across card deck and flip views |

---

## Architecture Decisions

1. **No new routing dependencies** — All animations use `framer-motion` which was already in the project.
2. **CSS variable-based theming** — All new components use `var(--*)` tokens from `index.css`, ensuring consistent light/dark mode support.
3. **Mobile-first approach** — Bottom nav, pull-to-refresh, and swipeable schedule specifically target mobile users via responsive breakpoints.
4. **Accessibility** — Particle background and cursor glow respect `prefers-reduced-motion`. All interactive elements have `aria-label` attributes.
5. **Performance** — Canvas rendering uses `requestAnimationFrame` with cleanup. Scroll listeners use `{ passive: true }`. Mouse tracking uses lerp smoothing instead of direct DOM updates.

