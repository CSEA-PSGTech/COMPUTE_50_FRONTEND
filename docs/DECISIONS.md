# Decisions Log

## Architecture & Framework
- **Decided**: Use Vite + React 19 SPA architecture instead of SSR/Next.js. [inferred]
- **Rationale**: Fast client-side rendering and static deployment suitability for an event & hackathon site.

## Styling & Design Tokens
- **Decided**: Use Tailwind CSS v4 alongside native CSS custom properties in `src/index.css`. [inferred]
- **Rationale**: CSS custom properties (`--accent`, `--bg-main`) allow seamless dark/light theme switching (`.dark` class toggle) while Tailwind handles layout utility classes.

## Data Fetching & State
- **Decided**: Integrate TanStack React Query for async state management and React Context for app-wide UI/auth state. [inferred]
- **Rationale**: Decouples API state management from UI tree components and avoids prop drilling.

## Animations & UX
- **Decided**: Use Framer Motion for interactive deck flyout animations (`SpeakersSection.tsx`) and smooth infinite carousels (`SponsorsSection.tsx`). [inferred]
- **Rationale**: Delivers high-impact visual experience for event visitors while respecting `prefers-reduced-motion`.

## Mock Data Services
- **Decided**: Implement frontend service abstractions (`auth.service.ts`, `user.service.ts`, `hackathon.service.ts`) with artificial promise delays and `localStorage` mock session storage. [inferred]
- **Rationale**: Allows full UI development, routing, and user flow testing prior to backend API deployment.

## 001: [title] (date, status)
Context: | Decision: | Alternatives: | Reason: | Tradeoff:
