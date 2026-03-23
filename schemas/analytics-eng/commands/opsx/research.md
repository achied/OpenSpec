---
name: "OPSX: Research"
description: Deep research on sources - trace lineage, review code, complete research.md with feasibility verdict
category: Analytics
tags: [analytics, workflow, openspec]
---

Trace lineage, review code, and complete research.md with all findings.

**Input**: A change name with research.md containing Project Map (from `/opsx:discover`).

---

Invoke the `openspec-research` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Load Project Map from research.md
- Trace lineage for each source (with linked dataset detection)
- Code review for each source
- Complete Source Registry, Data Lineage, and Feasibility Verdict
