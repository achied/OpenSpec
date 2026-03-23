---
name: openspec-investigate
description: Start a new analysis - orchestrates context, discover, and research phases. Use when the user wants to begin investigating a data question or discrepancy.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "2.0"
---

# Investigate

Orchestrator that runs the full investigation flow.

**Artifacts created:** context.md, research.md

**Next step:** `/opsx:analyze`

---

## Flow

```
/opsx:investigate = /opsx:context → /opsx:discover → /opsx:research
```

| Phase | Skill | Output |
|-------|-------|--------|
| 1. Understand | `/opsx:context` | context.md |
| 2. Map | `/opsx:discover` | research.md (Project Map) |
| 3. Analyze | `/opsx:research` | research.md (completed) |

---

## Input

- A data question or discrepancy to investigate
- Resources provided by the user (Slack, Confluence, Looker, tables)
- Or nothing (will ask for clarification)

---

## Steps

### 1. Context phase

Invoke `/opsx:context`:

```
Skill: /opsx:context
```

This will:
- Ask for analysis type and resources
- Create the change
- Generate context.md with question and initial resources

**Wait for completion before proceeding.**

### 2. Discover phase

Invoke `/opsx:discover`:

```
Skill: /opsx:discover
```

This will:
- Locate all resources from context.md
- Validate FQDNs
- Create research.md with Project Map

**Wait for completion before proceeding.**

### 3. Research phase

Invoke `/opsx:research`:

```
Skill: /opsx:research
```

This will:
- Trace lineage for each source
- Review code and document logic
- Complete research.md with findings
- Determine feasibility

---

## Output

```bash
openspec status --change "<name>"
```

Summarize:
- Analysis name and location
- Key findings from context (question, success criteria)
- Key findings from research (feasibility, key sources)

**Always end with:**
> "Investigation complete. Run `/opsx:analyze` when ready to execute."

---

## When to use individual skills

| Scenario | Use |
|----------|-----|
| Start fresh investigation | `/opsx:investigate` (full flow) |
| Already have context, need to map sources | `/opsx:discover` |
| Already mapped, need deep research | `/opsx:research` |
| Just need to understand the question | `/opsx:context` |

---

## Guardrails

- Each phase must complete before starting the next
- If any phase fails or user stops, do not auto-continue
- If feasibility is "Not Feasible", stop and discuss before proceeding
