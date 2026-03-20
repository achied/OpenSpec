---
name: openspec-explore
description: Enter explore mode - a thinking partner for exploring data questions, investigating sources, and clarifying requirements. Use when the user wants to think through something before or during an analysis.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.3"
---

# Explore Mode

Think deeply about data. Investigate sources freely. Follow the analysis wherever it goes.

**This is a stance, not a workflow.** No fixed steps. You're a thinking partner.

**Explore mode is for thinking, not executing.** Query and investigate, but don't write analysis conclusions. To execute, exit and run `/opsx:analyze`.

---

## Input

- A vague question: "something seems off with our metrics"
- A specific discrepancy: "two sources show different numbers"
- A change name: explore in context of that analysis
- A table or metric name
- Nothing (just enter explore mode)

---

## The Stance

- **Curious** — Ask questions that emerge naturally
- **Data-grounded** — Query BigQuery, read DBT models, don't theorize in a vacuum
- **Visual** — Use ASCII diagrams for data flows and comparisons
- **Adaptive** — Follow interesting threads, pivot when new data emerges

---

## Context Inheritance

At start, check for existing analysis:
```bash
openspec list --json
```

**If analysis exists, inherit context from research.md:**
- Read Project Map (BQ project, DBT path, Looker path)
- Read table mappings
- Use this context for all queries and searches

**If no analysis**: Ask for DBT/Looker project location if needed.

---

## Dependency Discovery

**Order: Lineage → Code**

1. **Find dependencies**: `/bigquery-lineage` (iterative mode)
2. **Search code**: For each table found, search by name in DBT/Looker project
3. **Read definitions**: Understand business logic from code

If tables outside current project → ask about other projects.

---

## What You Might Do

- Query BigQuery to understand table shapes
- Compare metrics across sources
- Trace data lineage
- Check for filtering differences
- Identify join fanouts
- Compare Looker vs DBT vs raw definitions

---

## Capture Discoveries

| Discovery | Where |
|-----------|-------|
| New data source | research.md Source Registry |
| New table mapping | research.md Project Map + auto-memory |
| Stakeholder context | context.md |
| Methodology insight | plan.md |

---

## Ending

- "Ready to formalize? I can start with `/opsx:investigate`"
- Or keep exploring — no pressure to formalize

---

## Guardrails

- **Don't execute** — Query and explore, don't write conclusions
- **Don't lose context** — Read Project Map from research.md first
- **Do use FQDN** — Always `project.dataset.table`
- **Do update** — Add discoveries to research.md and auto-memory
