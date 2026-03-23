---
name: "OPSX: Context"
description: Understand the question and create context.md with stakeholder request and resources
category: Analytics
tags: [analytics, workflow, openspec]
---

Create the context document that captures WHY this analysis is needed and WHAT question we're answering.

**Input**: Resources to analyze (Slack links, Confluence pages, Looker dashboards, table names).

---

Invoke the `openspec-context` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Clarify analysis type with user
- Ask for resources
- Create the change
- Generate context.md with Source Registry
