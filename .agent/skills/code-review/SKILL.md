---
name: code-review
description: Use after finishing a task or before opening a PR to review the diff like a senior engineer.
---
# Code review
Review the current diff against `/docs`. Check: wrong requirements, architecture violations, duplicated logic, security (auth, validation, secrets, injection), DB/API inconsistencies, missing loading/empty/error states, missing tests, regressions, unneeded dependencies, unrelated file changes.
Output: findings with severity (high/medium/low), recommended fix for each, and docs that need updating. Do not modify code until asked.
