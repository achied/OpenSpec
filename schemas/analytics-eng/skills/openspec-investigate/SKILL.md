---
name: openspec-investigate
description: Orchestrates a full analytics investigation by running context, discover, and research phases sequentially. Creates context.md and research.md. Use when the user wants to start a new data investigation or discrepancy analysis.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "3.0"
---

# Investigate

Orchestrator that runs the full investigation flow.

**Creates:** context.md, research.md
**Next:** `/openspec-analyze`

---

## Flow — STRICT SEQUENCE

```
/openspec-investigate = /openspec-context → /openspec-discover → /openspec-research
```

| Phase | Skill | Creates | Gate |
|-------|-------|---------|------|
| 1. Understand | `/openspec-context` | context.md | User confirms question |
| 2. Map | `/openspec-discover` | research.md (Project Map) | All FQDNs validated |
| 3. Analyze | `/openspec-research` | research.md (completed) | Feasibility verdict |

**Each phase MUST complete before the next begins.**

Do NOT skip phases.
Do NOT run phases in parallel.
Do NOT combine phases into a single step.

---

## Execution

### Phase 1: Context

Invoke the skill and wait for it to complete:

```
Skill: /openspec-context
```

**Gate:** context.md exists with question and Source Registry. Do NOT proceed without it.

### Phase 2: Discover

Invoke the skill and wait for it to complete:

```
Skill: /openspec-discover
```

**Gate:** research.md exists with validated Project Map. Do NOT proceed if any FQDN has `?`.

### Phase 3: Research

Invoke the skill and wait for it to complete:

```
Skill: /openspec-research
```

**Gate:** research.md has Feasibility Verdict. If "Not Feasible", STOP.

---

## Output

Summarize:
- Analysis name and location
- Key findings from context (question, success criteria)
- Key findings from research (feasibility, key sources)

**Always end with:**
> "Investigation complete. Run `/openspec-analyze` when ready to execute."

---

## When to use individual skills

| Scenario | Command |
|----------|---------|
| Start fresh investigation | `/openspec-investigate` (full flow) |
| Already have context.md | `/openspec-discover` |
| Already have Project Map | `/openspec-research` |
| Just understand the question | `/openspec-context` |
