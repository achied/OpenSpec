---
name: openspec-analyze
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts. Use when context and research are complete and the user is ready to execute.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.3"
---

# Analyze

Execute the analysis - generate plan → analysis → validation → audit.

---

## Input

If no analysis name provided:
- Infer from conversation context
- Auto-select if only one exists
- If ambiguous: `openspec list --json` and ask user

Announce: "Using analysis: <name>"

---

## Steps

### 1. Check prerequisites

```bash
openspec status --change "<name>" --json
```

Verify context and research are `done`. If not → suggest `/opsx:investigate`.

### 2. Check feasibility

Read `research.md` Feasibility Verdict:
- **Feasible**: Proceed
- **Partially Feasible**: Warn about gaps, ask for confirmation
- **Not Feasible**: Stop, discuss with user

### 3. Generate artifacts

#### a. plan.md
```bash
openspec instructions plan --change "<name>" --json
```
Define objectives, methodology, metrics. **Quality Gate**: Pause if complex.

#### b. analysis.md
```bash
openspec instructions analysis --change "<name>" --json
```
Execute queries, document findings with confidence levels.

**Avoid bias**: Don't generalize from samples. Verify patterns across full population. Seek counter-evidence.

#### c. validation.md (ALIGNMENT)
```bash
openspec instructions validation --change "<name>" --json
```
Map each success criterion → findings. Did we answer the RIGHT question?

**Quality Gate**: Pause if criteria unaddressed.

#### d. audit.md (CORRECTNESS)
```bash
openspec instructions audit --change "<name>" --json
```

**Phase 1 — SQL Forensics**: Re-run queries independently, compare results. Don't read findings first.

**Phase 2 — Narrative Critique**: Check for causality claims without evidence, selective emphasis, bias.

**Phase 3 — Refinement Paths**: Concrete improvements mapped to artifacts.

### 4. Audit Review Gate

Check Overall Audit Verdict:
- **Blocker count > 0**: STOP, present options
- **Confidence = Low**: STOP, present options

Options: Refine, Proceed with caveats, Restart from plan.

### 5. Refinement Loop (if "Refine")

| Blocker Source | Target |
|----------------|--------|
| SQL issues | analysis.md |
| Narrative/Bias | analysis.md |
| Missing data | research.md |
| Wrong methodology | plan.md |

Fix → Re-verify → Update audit.md → Loop until resolved.

### 6. Show status

```bash
openspec status --change "<name>"
```

---

## Output

Summarize:
- Analysis name
- Executive finding
- Audit verdict (confidence, blocker count)
- Prompt: "Run `/opsx:deliver` to share with stakeholders."

---

## Guardrails

- **NEVER** skip prerequisites
- **NEVER** proceed if "Not Feasible" without confirmation
- **NEVER** skip Audit Review Gate
- **ALWAYS** save ALL SQL queries for reproducibility
- **ALWAYS** run audit SQL independently
- **ALWAYS** iterate if blockers found
