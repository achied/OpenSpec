---
name: "OPSA: Analyze"
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts
category: Analytics
tags: [analytics, workflow, openspec]
---

Execute the analysis by generating plan -> analysis -> validation -> audit artifacts.

**Input**: Optionally specify an analysis name (e.g., `/opsx:analyze <name>`). If omitted, auto-select or prompt.

---

Invoke the `openspec-analyze` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Prerequisite checks (context + research must be done)
- Feasibility verification from research.md
- Sequential artifact generation with quality gates
- **Audit Review Gate** - blockers must be addressed or explicitly accepted
- **Refinement Loop** - detailed guidance for fixing SQL issues, narrative problems, and bias exposures
- Traces blockers back to research, plan, or analysis as needed
