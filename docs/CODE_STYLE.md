# Code Style - Compute 50 Frontend

## Naming Conventions [from code]
- **React Components**: PascalCase (`SpeakersSection.tsx`, `AboutCompute50.tsx`).
- **Custom Hooks**: camelCase starting with `use` (`useAuth.ts`, `useTheme.ts`, `useToast.ts`, `useCountdown.ts`).
- **Services**: camelCase with `.service.ts` extension (`auth.service.ts`, `user.service.ts`, `hackathon.service.ts`).
- **Mock Data**: camelCase prefixed with `mock` (`mockSpeakers`, `mockSponsors`, `mockTracks`).
- **CSS Custom Properties**: kebab-case prefixed with `--` (`--accent`, `--bg-main`, `--border-color`).

## Folder Organization Rules [from code]
- Feature components must be placed in `src/components/<feature_name>/` (e.g. `src/components/home/`, `src/components/about/`, `src/components/auth/`).
- Shared / reusable UI elements must be placed in `src/components/common/`.
- Page views mapping directly to routes must be placed in `src/pages/`.
- Type interfaces must be grouped in `src/types/` (`auth.ts`, `common.ts`, `hackathon.ts`, `user.ts`).

## Import Rules & Path Aliases [from code]
- Path alias `@/` maps to `./src/*` as configured in [`vite.config.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/vite.config.ts) and [`tsconfig.app.json`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/tsconfig.app.json).
- Import React explicitly at top of files where required (`import React from 'react'`).

## Error & Loading Handling [from code]
- Use standard feedback components for async states:
  - [`LoadingState.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/LoadingState.tsx) for pending queries.
  - [`EmptyState.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/EmptyState.tsx) when dataset arrays are empty.
  - [`ErrorState.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/common/ErrorState.tsx) for network or API failures.
- Trigger user feedback notifications using `useToast()` from [`useToast.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/hooks/useToast.ts).

## Formatter & Linter [from code]
- **Linter**: Oxlint (`oxlint` ^1.81.0) configured via [`.oxlintrc.json`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/.oxlintrc.json).
- Command: `npm run lint`.

