---
name: openspec-analyze
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts. Use when context and research are complete and the user is ready to execute.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.6"
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

### 3. Create artifact tasks (use TaskCreate)

**Create a Task for each artifact to track progress:**

```
TaskCreate: subject: "Generate plan.md", activeForm: "Creating plan"
TaskCreate: subject: "Generate analysis.md", activeForm: "Executing analysis"
TaskCreate: subject: "Generate validation.md", activeForm: "Validating findings"
TaskCreate: subject: "Generate audit.md", activeForm: "Auditing analysis"
```

User sees progress:
```
[ ] Generate plan.md
[ ] Generate analysis.md
[ ] Generate validation.md
[ ] Generate audit.md
```

### 4. Generate artifacts

**For each task, update status as you work:**

#### a. plan.md (TaskUpdate → in_progress, then → completed)
```bash
openspec instructions plan --change "<name>" --json
```
Define objectives, methodology, metrics. **Quality Gate**: Pause if complex.

#### b. analysis.md
```bash
openspec instructions analysis --change "<name>" --json
```
Execute queries, document findings with confidence levels.

**Every number, table, or metric MUST have its SQL inline** — if you can't show the query, don't show the number.

**Avoid bias**: Don't generalize from samples. Verify patterns across full population. Seek counter-evidence.

#### c. validation.md (ALIGNMENT — critical stance)
```bash
openspec instructions validation --change "<name>" --json
```

**Adopt a devil's advocate stance.** Assume the analysis has gaps until proven otherwise.

For each success criterion:
- **Don't just check if addressed** — check HOW WELL it's addressed
- Require explicit evidence linking finding → criterion
- If evidence is weak or indirect, mark as "Partially addressed" not "Addressed"
- Document what would make it fully addressed

**Be skeptical:**
- Question whether findings actually answer the question or just describe related data
- Look for criteria that were subtly redefined to fit the findings
- Flag if the analysis answered an easier question than what was asked

**SQL Coverage check:**
- For each number/table in analysis.md, verify there is a corresponding SQL query
- Flag any data point without SQL as "Unverifiable"

**Quality Gate**: Pause if ANY criteria is less than fully addressed or if SQL coverage is incomplete.

#### d. audit.md (CORRECTNESS — adversarial stance)

```bash
openspec instructions audit --change "<name>" --json
```

**Switch to adversarial reviewer stance.** Your job is to FIND PROBLEMS, not confirm the analysis is correct.

**Phase 1 — SQL Forensics:**
- **Coverage check**: Identify any number, table, or metric without a corresponding SQL query — mark as Blocker
- Read analysis.md queries ONLY (not findings yet)
- Re-run each query independently
- Compare YOUR results to their stated results
- Flag ANY discrepancy, even rounding differences

**Phase 2 — Narrative Critique:**
- NOW read the findings
- Actively look for: causality claims without causal evidence, selective emphasis, magnitude framing issues, bias
- Assume there IS bias until you can't find any

**Phase 3 — Severity Assessment:**
- Assign severity to each issue: Blocker / Major / Minor
- Be strict: if it could mislead a stakeholder, it's at least Major

**Document** Overall Verdict: Confidence level + Blocker count

### 5. Audit Review Gate

Check Overall Audit Verdict:
- **Blocker count > 0**: STOP, present options
- **Confidence = Low**: STOP, present options

Options: Refine, Proceed with caveats, Restart from plan.

### 6. Refinement Loop (if "Refine")

| Blocker Source | Target |
|----------------|--------|
| SQL issues | analysis.md |
| Narrative/Bias | analysis.md |
| Missing data | research.md |
| Wrong methodology | plan.md |

Fix → Re-verify → Update audit.md → Loop until resolved.

### 7. Show status

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

## Principles

- **Track with Tasks**: Create a Task for each artifact — update status as you progress
- **Validation is not a rubber stamp**: Assume gaps exist. Require evidence for each criterion.
- **Audit is adversarial**: Your job is to find problems, not confirm correctness.
- **Weak passes are failures**: "Partially addressed" or "Medium confidence" should trigger action, not acceptance.
- **Reproducibility**: Every query saved, every result verifiable.

---

## Guardrails

- Verify prerequisites (context, research) are complete before starting
- Confirm with user before proceeding if feasibility is "Not Feasible"
- Use devil's advocate stance for validation — be skeptical
- Switch to adversarial stance for audit — actively look for problems
- Review Audit verdict and address blockers before delivery
- Iterate on blockers until resolved or user accepts caveats
