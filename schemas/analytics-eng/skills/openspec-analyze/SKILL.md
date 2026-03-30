---
name: openspec-analyze
description: Executes the full analysis cycle — generates plan, analysis, validation, and audit artifacts sequentially. Applies devil's advocate stance for validation and adversarial stance for audit. Use when context and research are complete.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "2.0"
---

# Analyze

Execute the analysis — generate plan → analysis → validation → audit.

**Requires:** context.md (done), research.md (done)
**Creates:** plan.md, analysis.md, validation.md, audit.md
**Next:** `/openspec-deliver`

---

## Read-only artifacts

**Do NOT modify context.md or research.md.** They are inputs to this phase, not outputs.

If Source Registry has ⏳ entries not resolved in research.md, return to `/openspec-investigate` — do NOT update context.md here.

---

## Steps

Copy this checklist and track progress:

```
Analyze Progress:
- [ ] Step 1: Check prerequisites
- [ ] Step 2: Check feasibility
- [ ] Step 3: Generate plan.md
- [ ] Step 4: Generate analysis.md
- [ ] Step 5: Generate validation.md
- [ ] Step 6: Generate audit.md
- [ ] Step 7: Audit Review Gate
```

### Step 1: Check prerequisites

```bash
openspec status --change "<name>" --json
```

Verify context and research are `done`. If not → suggest `/openspec-investigate`.

If no analysis name provided: auto-select if only one exists, otherwise ask.

Announce: "Using analysis: <name>"

### Step 2: Check feasibility

Read research.md Feasibility Verdict:
- **Feasible**: Proceed
- **Partially Feasible**: Warn about gaps, ask for confirmation
- **Not Feasible**: STOP, discuss with user

### Step 3: Generate plan.md

```bash
openspec instructions plan --change "<name>" --json
```

Define objectives, methodology, metrics.

**Quality Gate**: Pause and ask user if methodology is complex or non-obvious.

### Step 4: Generate analysis.md

```bash
openspec instructions analysis --change "<name>" --json
```

**For each query or analysis unit, create a Task dynamically:**

```
TaskCreate:
  subject: "Query: <short description of what this query answers>"
  activeForm: "Running query: <short description>"
```

Mark each Task as completed after documenting the finding. This gives visibility into analysis progress.

**Every number, table, or metric MUST have its SQL inline.** If you cannot show the query, do NOT show the number.

**Avoid bias**: Do NOT generalize from samples. Verify patterns across full population. Seek counter-evidence.

### Step 5: Generate validation.md (ALIGNMENT — devil's advocate)

```bash
openspec instructions validation --change "<name>" --json
```

**Adopt a devil's advocate stance.** Assume the analysis has gaps until proven otherwise.

For each success criterion:
- Do NOT just check if addressed — check HOW WELL
- Require explicit evidence linking finding → criterion
- If evidence is weak or indirect, mark as "Partially addressed" not "Addressed"

**SQL Coverage check:**
- For each number/table in analysis.md, verify there is a corresponding SQL query
- Flag any data point without SQL as "Unverifiable"

**Quality Gate**: Pause if ANY criterion is less than fully addressed or if SQL coverage is incomplete.

### Step 6: Generate audit.md (CORRECTNESS — adversarial)

```bash
openspec instructions audit --change "<name>" --json
```

**Switch to adversarial reviewer stance.** Your job is to FIND PROBLEMS, not confirm correctness.

**Phase 1 — SQL Forensics:**
- Coverage check: identify any number without a SQL query — mark as Blocker
- Re-run each query independently
- Compare YOUR results to stated results
- Flag ANY discrepancy, even rounding differences

**Phase 2 — Narrative Critique:**
- Read the findings AFTER verifying SQL
- Look for: causality without causal evidence, selective emphasis, magnitude framing, bias
- Assume there IS bias until you cannot find any

**Phase 3 — Severity Assessment:**
- Assign severity: Blocker / Major / Minor
- If it could mislead a stakeholder, it is at least Major

**Document** Overall Verdict: Confidence level + Blocker count

### Step 7: Audit Review Gate

Check Overall Audit Verdict:
- **Blocker count > 0**: STOP, present options
- **Confidence = Low**: STOP, present options

Options: Refine | Proceed with caveats | Restart from plan

**If "Refine":**

| Blocker Source | Fix Target |
|----------------|-----------|
| SQL issues | analysis.md |
| Narrative/Bias | analysis.md |
| Missing data | research.md (return to `/openspec-research`) |
| Wrong methodology | plan.md |

Fix → Re-verify → Update audit.md → Loop until resolved.

---

## Constraints

- Do NOT modify context.md or research.md — they are read-only inputs
- Do NOT skip validation or audit — they are mandatory, not optional
- Do NOT present numbers without inline SQL
- Do NOT soften audit findings — be honest about problems

---

## Output

Summarize:
- Analysis name
- Executive finding
- Audit verdict (confidence, blocker count)

**Always end with:**
> "Analysis complete. Run `/openspec-deliver` to share with stakeholders."
