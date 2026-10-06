# Architecture - Compute 50 Frontend

## Stack [from code]
- **Frontend**: React 19 (`react` ^19.2.8), Vite (`vite` ^8.3.0), Tailwind CSS v4 (`tailwindcss` ^4.3.3), TypeScript (`typescript` ~6.0.2), React Router (`react-router-dom` ^7.18.4), TanStack React Query (`@tanstack/react-query` ^5.104.0), Framer Motion (`framer-motion` ^13.4.4).
- **Backend**: External REST API target specified by `VITE_API_BASE_URL` (default `http://localhost:5000/api`). No backend server code in repository.
- **Database**: N/A (Frontend client only).
- **Auth**: JWT Bearer token stored in `localStorage` (`compute50_auth_token`), managed by [`AuthContext.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/context/AuthContext.tsx) and attached automatically via Axios request interceptor in [`api.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/services/api.ts).
- **Hosting**: Static web host (Vite SPA production build via `npm run build`).

## Pattern & Rationale [from code]
Client-side rendered Single-Page Application (SPA). React Router manages browser navigation without full page reloads, while Framer Motion handles fluid UI state transitions and card deck animations.

## Folder Structure [from code]
- `src/components/`: Feature-grouped React components (`about`, `auth`, `common`, `hackathon`, `home`, `layout`, `profile`).
- `src/pages/`: Top-level page views rendered by route definitions.
- `src/routes/`: App routing configuration (`AppRouter.tsx`) and route guards (`ProtectedRoute.tsx`, `GuestRoute.tsx`).
- `src/services/`: Centralized HTTP client (`api.ts`) and API service wrappers (`auth.service.ts`, `user.service.ts`, `hackathon.service.ts`).
- `src/context/`: App-wide state context providers (`AuthContext.tsx`, `ThemeContext.tsx`, `ToastContext.tsx`).
- `src/data/`: Mock static data sets (`speakers.ts`, `sponsors.ts`, `events.ts`, `tracks.ts`, `faqs.ts`, `schedule.ts`, `clubs.ts`).
- `src/types/`: TypeScript interface declarations (`auth.ts`, `common.ts`, `hackathon.ts`, `user.ts`).

## Data Flow (Request to Response) [from code]
1. User interacts with UI component in `src/components/` or `src/pages/`.
2. Component invokes service method in `src/services/` (or React Context / TanStack Query hook).
3. Service calls `apiClient` in [`api.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/services/api.ts), which attaches `Authorization: Bearer <token>` header if present.
4. Response returns to service layer (or mock data handler fallback) and updates component React state / Context.

