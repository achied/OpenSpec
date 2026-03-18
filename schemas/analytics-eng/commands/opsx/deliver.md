---
name: "OPSA: Deliver"
description: Generate summary and presentation, share with stakeholders
category: Analytics
tags: [analytics, workflow, delivery, openspec]
---

Deliver the analysis - generate summary, optional presentation, and share with stakeholders.

**Input**: Optionally specify an analysis name (e.g., `/opsx:deliver <name>`). If omitted, infer or prompt.

---

Invoke the `openspec-deliver` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Prerequisite checks (all execution artifacts must be done)
- Audit verdict verification before sharing
- Summary generation with mandatory audit integration
- Optional presentation via `openspec-present` skill
- Delivery channel selection (Confluence, Slack, both, skip)
