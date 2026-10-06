# Agent Instructions

## Project
- Name: Compute 50 Frontend
- One-line purpose: Hackathon and anniversary event platform for CSEA, PSG College of Technology celebrating 50 years of M.E. CSE.
- Stack: React 19 + Vite + Tailwind CSS v4 + TypeScript + TanStack React Query + Framer Motion
- Commands: install `npm install` | dev `npm run dev` | test `N/A (No test runner configured)` | lint `npm run lint` | build `npm run build`

## Project-specific rules
1. **Preserved Animations & Features**: Never modify or break the following core features without explicit approval:
   - Speaker cards expand/collapse deck animation ([`src/components/home/SpeakersSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SpeakersSection.tsx)).
   - Sponsor rotation counter-clockwise carousel ([`src/components/home/SponsorsSection.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/components/home/SponsorsSection.tsx)).
2. **Content & Tokens Location**:
   - Hardcoded mock event content lives in [`src/data/`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/data) (`speakers.ts`, `sponsors.ts`, `events.ts`, `tracks.ts`, `faqs.ts`, `schedule.ts`, `clubs.ts`).
   - Color tokens live in [`src/index.css`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/index.css) (`:root` and `.dark` CSS custom properties).
3. **Source Code Boundary**: Do not edit application source code in `src/` during agent kit or documentation maintenance tasks.

## Source of truth
Read the relevant files in `/docs` before significant work. Do not contradict them.
If code and docs disagree, or docs are silent on something important: STOP and ask. Do not guess requirements.

## Working rules
1. Plan first for any non-trivial task: files affected, DB/API changes, risks, tests. Wait for approval.
2. Smallest correct change. No unrelated refactors, no new dependencies without asking.
3. Reuse existing components, utilities and patterns before creating new ones.
4. Never hard-code or expose secrets. Validate input on the server. Check authorization on the server.
5. Add or update tests for new behaviour.
6. One task = one branch = small commits with clear messages.

## Definition of done
- [ ] Requirement from the plan is met
- [ ] Tests, lint, type check and build pass
- [ ] UI changes were checked in the running app (see skill `ui-verify`)
- [ ] Diff reviewed; no unintended files changed
- [ ] Docs updated if behaviour, schema, API or security rules changed

## End-of-task report
What changed | files touched | what was run and the result | open issues | docs to update

