# Design System - Compute 50 Frontend

## Style & Theme [from code]
- **Theme Concept**: Modern tech / futuristic dark-first layout with high contrast electric neon lime accent, dark surface cards, subtle SVG noise overlays, and floating orb background animations.

## Colors [from code] (Defined in [`src/index.css`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/index.css))
- **Light Theme (`:root`)**:
  - Main Background (`--bg-main`): `#FAFAFA`
  - Secondary Background (`--bg-secondary`): `#F4F4F5`
  - Surface Card (`--bg-surface`): `#FFFFFF`
  - Border Color (`--border-color`): `#E4E4E7`
  - Primary Text (`--text-primary`): `#09090B`
  - Secondary Text (`--text-secondary`): `#52525B`
  - Accent Lime (`--accent`): `#65A30D`
  - Accent Hover (`--accent-hover`): `#4D7C0F`
  - Accent Muted (`--accent-muted`): `rgba(101, 163, 13, 0.12)`
- **Dark Theme (`.dark`)**:
  - Main Background (`--bg-main`): `#050505`
  - Secondary Background (`--bg-secondary`): `#0D0D0F`
  - Surface Card (`--bg-surface`): `#121216`
  - Border Color (`--border-color`): `#24242A`
  - Primary Text (`--text-primary`): `#F5F5F5`
  - Secondary Text (`--text-secondary`): `#A1A1AA`
  - Accent Electric Neon Lime (`--accent`): `#B6FF00`
  - Accent Hover (`--accent-hover`): `#C8FF33`
  - Accent Muted (`--accent-muted`): `rgba(182, 255, 0, 0.12)`

## Typography [from code]
- **Primary Body Font**: `'Inter', system-ui, -apple-system, sans-serif`
- **Monospace Font**: `'JetBrains Mono', ui-monospace, monospace` (utility class `.font-mono`)
- **Heading Helpers**:
  - `.text-heading-h1`: `clamp(2.5rem, 8vw, 5.5rem)`
  - `.text-heading-h2`: `clamp(1.75rem, 4.5vw, 3rem)`
  - `.text-heading-h3`: `clamp(1.25rem, 2.5vw, 1.85rem)`

## Spacing & Radius Conventions [from code]
- **Section Padding**: `.section-padding` (`py-20` / `5rem` mobile, `py-28` / `7rem` desktop).
- **Corner Radii**: `rounded-xl` (`12px`), `rounded-2xl` (`16px`), `rounded-3xl` (`24px`), `rounded-full`.

## Animation Techniques & Libraries [from code]

### 1. Framer Motion (`framer-motion` ^13.4.4)
- **Speaker Cards Expand/Collapse**: [`src/components/home/SpeakersSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SpeakersSection.tsx)
  - Dynamically calculates card grid center offsets (`cardOffsets`).
  - Collapsed state stacks cards at center with Y-offsets (`idx * 6`), tilt angles (`-2°` / `+2°`), scale (`1.15`), and 3D card flip (`rotateY(180deg)`).
  - Expanded state uses spring transitions (`stiffness: 180, damping: 22`) to unpack cards into grid position with staggered delays (`idx * 0.07`).
- **Counter-Clockwise Sponsor Rotation**: [`src/components/home/SponsorsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SponsorsSection.tsx)
  - Uses `useAnimation()` controls on a duplicated array of sponsor items.
  - Auto-slides items leftwards (`x: -step`) every 3000ms, rotating array head to tail on complete step. Pauses on hover, focus, tab-hide, or reduced motion.
### 4. Scroll Focus-Pull Section Transitions ([`src/components/common/SectionTransition.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/SectionTransition.tsx))
- **Mechanism**: Scroll-linked motion wrapper using Framer Motion's `useScroll()` (`offset: ['start end', 'end start']`) and `useTransform()`.
- **Target Parameters**:
  - **Entering Phase** (`0.00` to `0.35` scroll progress):
    - `opacity`: `0` → `1`
    - `translateY`: `+48px` → `0px` (`+24px` → `0px` on mobile)
    - `scale`: `0.97` → `1.0` (`1.0` on mobile)
    - `filter blur`: `10px` → `0px` (`0px` on mobile)
  - **Visible Phase** (`0.35` to `0.75` scroll progress):
    - `opacity`: `1.0`, `translateY`: `0px`, `scale`: `1.0`, `filter blur`: `0px`
  - **Leaving Phase** (`0.75` to `1.00` scroll progress):
    - `opacity`: `1` → `0.25` (maintains visibility for tall sections)
    - `translateY`: `0px` → `-24px` (`-12px` on mobile)
    - `filter blur`: `0px` → `4px` (`0px` on mobile)
- **Accessibility & Mobile Optimization**: Automatically disables scale/blur on mobile viewports (<768px) for 60fps performance and respects `prefers-reduced-motion`.

### 5. Prize Pool Redesign ([`src/components/home/PrizePool.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/PrizePool.tsx))
- **Hero Display Number**: Huge display figure (`text-5xl sm:text-7xl lg:text-8xl`) with white-to-lime gradient text, soft radial glow, and odometer count-up on scroll entry.
- **3D Podium**: 3-column podium on desktop (**2nd, 1st, 3rd** order) with spring-ease grow-up bars (`scaleY: 0` → `1`) staggered by 0.1s. 1st place pillar is tallest with dedicated accent glow.
- **Rotating Border Beam**: Hardware-accelerated CSS conic gradient rotation (`.animate-border-beam`) around the inner backdrop-blurred container card.
- **Interactive Cursor Spotlight**: Real-time cursor-following radial light beam on desktop (`onMouseMove`), auto-fading on touch.
- **Accessible Prize Details Modal** ([`src/components/home/PrizeDetailsModal.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/PrizeDetailsModal.tsx)): Focus-trapped, backdrop-closable, `Escape`-listening modal providing in-page breakdown and rules without page redirect.

### 6. Smooth Scroll & Textured Background System
- **Lenis Smooth Scroll** ([`src/context/SmoothScrollContext.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/context/SmoothScrollContext.tsx)):
  - Smooth wheel scrolling (`duration: 1.1s`, `lerp: 0.1`) on mouse and trackpad. Native touch scrolling preserved on mobile.
  - Automatically disabled when `prefers-reduced-motion` is active.
  - Immediate `(0, 0)` scroll reset on route changes (`pathname`).
  - Anchor & dot navigation scroll with `duration: 1.0s` and `-90px` sticky navbar offset.
  - Modals and drawers call `stop()` on open and `start()` on close, with `data-lenis-prevent` on scrollable containers.
- **Textured Background Layer** ([`src/components/common/TexturedBackground.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/TexturedBackground.tsx)):
  - Single fixed root container rendered outside the page transition wrapper (`position: fixed; inset: 0; pointer-events: none; z-index: 0`).
  - **Tokens & Layers** ([`src/index.css`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/index.css)):
    - `--bg-noise-opacity`: `0.04` (dark) / `0.03` (light) — Tiled SVG film grain noise.
    - `--bg-grid-opacity`: `0.04` (dark) / `0.03` (light) — 36px neon green tech grid with radial edge mask.
    - `--bg-glow-opacity`: `0.05` (dark) / `0.04` (light) — Soft ambient green radial glowing orbs.
    - Vignette: `radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)`.
    - Desktop Spotlight: Smooth cursor-following light beam (`requestAnimationFrame`, disabled on touch & reduced motion).
  - **Contrast Compliance**: Primary text `19.5:1`, Muted text (`#A1A1AA` on `#050505`) `12.4:1` (exceeds WCAG AAA threshold 7.0:1).


