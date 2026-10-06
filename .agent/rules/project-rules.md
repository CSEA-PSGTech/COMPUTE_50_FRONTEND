# Project Specific Rules - Compute 50 Frontend

- **Source of Truth**: Follow [`AGENTS.md`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/AGENTS.md) and [`/docs`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/docs) first. Do not contradict them.
- **Preserved Core Features**: NEVER modify, refactor, or delete the key preserved UI features without explicit user approval:
  1. Speaker cards expand/collapse 3D deck animation ([`src/components/home/SpeakersSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SpeakersSection.tsx)).
  2. Counter-clockwise sponsor rotation carousel ([`src/components/home/SponsorsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SponsorsSection.tsx)).
- **Data & Content Location**: Hardcoded event mock datasets live in [`src/data/`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/data) (`speakers.ts`, `sponsors.ts`, `events.ts`, `tracks.ts`, `faqs.ts`, `schedule.ts`, `clubs.ts`).
- **Design Tokens**: Color variables (`--accent`, `--bg-main`, `--bg-surface`, `--text-primary`) are defined in [`src/index.css`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/index.css). Use CSS variables or Tailwind utility classes that reference them.
- **Component Naming & Structure**: Use PascalCase for React components (`SpeakersSection.tsx`). Place shared components in `src/components/common/` and feature components in `src/components/<feature>/`.
- **Import Alias**: Use `@/` path alias for imports targeting `src/` (e.g. `@/components/common/Button`).
- **Clean Boundaries**: Never commit secrets or edit application source code when performing agent kit or documentation tasks.

