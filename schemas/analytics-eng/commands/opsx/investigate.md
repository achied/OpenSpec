---
name: "OPSA: Investigate"
description: Start a new analysis - create it and generate context + research artifacts
category: Analytics
tags: [analytics, workflow, openspec]
---

Start a new analysis by creating the change and generating initial artifacts.

**Input**: The argument after `/opsx:investigate` is the analysis name (kebab-case) or a description of what to analyze.

---

Invoke the `openspec-investigate` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Search discipline (scope defined by user-provided resources)
- Steps to create change and generate context.md + research.md
- Blocker questions for DBT and Looker projects
- Guardrails to prevent fabricated context
