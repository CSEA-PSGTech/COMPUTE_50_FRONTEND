---
name: ui-verify
description: Use after any UI change. Run the app, open it in the browser, inspect the real screen and iterate.
---
# UI verification loop
1. Start the dev server using the command in `AGENTS.md`.
2. Open the page in the browser tool and take a screenshot.
3. Check against `docs/DESIGN_SYSTEM.md`: layout, spacing, colours, fonts, responsive (mobile + desktop), loading/empty/error states, console errors.
4. Fix what is wrong, re-check. Repeat until it matches.
5. Report what you saw, not what the code says. Code does not equal what the user sees.
