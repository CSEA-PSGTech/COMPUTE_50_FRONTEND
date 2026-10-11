# Parallel agents (only when tasks are independent)
Split work so agents do not touch the same files:
- Agent 1 (Frontend): UI components/pages only. Follows DESIGN_SYSTEM.md.
- Agent 2 (Backend): routes, services, DB only. Follows API.md and DATABASE.md.
- Agent 3 (Tests): writes/updates tests from the acceptance criteria in PRD.md.
- Agent 4 (Docs): keeps docs in sync with merged changes.
Agree the API contract in docs/API.md BEFORE starting Frontend and Backend in parallel.
