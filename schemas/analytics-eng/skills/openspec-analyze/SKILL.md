---
name: openspec-analyze
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts. Use when context and research are complete and the user is ready to execute.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.1"
---

# Analyze

Execute the analysis - generate the execution artifacts (plan -> analysis -> validation -> audit).

---

## Input

Optionally specify an analysis name. If omitted:
- Infer from conversation context if the user mentioned an analysis
- Auto-select if only one active analysis exists
- If ambiguous, run `openspec list --json` and use **AskUserQuestion** to let user select

Always announce: "Using analysis: <name>"

---

## Steps

### 1. Check prerequisites

```bash
openspec status --change "<name>" --json
```

Parse the JSON to verify:
- `context` artifact is `done`
- `research` artifact is `done`

**If prerequisites are not met:**
- Display warning listing incomplete artifacts
- Suggest: "Run `/opsx:investigate` first to complete context and research."
- Stop execution

### 2. Check feasibility from research.md

Read `openspec/changes/<name>/research.md` and check the Feasibility Verdict:
- If **Feasible**: Proceed
- If **Partially Feasible**: Warn user about gaps, ask for confirmation
- If **Not Feasible**: Stop and ask user how to proceed

### 3. Generate artifacts in sequence

#### a. Generate plan.md

```bash
openspec instructions plan --change "<name>" --json
```

- Define objectives, methodology, metrics
- Document assumptions and edge cases
- Define validation approach

Show progress: "Created plan.md"

**Quality Gate**: If methodology is complex, pause and review with user.

#### b. Generate analysis.md

```bash
openspec instructions analysis --change "<name>" --json
```

- Execute queries using `mcp__bigquery__execute_sql`
- Create Looks using `mcp__bigquery__looker_make_look` if needed
- Document ALL SQL queries for reproducibility
- Record findings with confidence levels

Show progress: "Created analysis.md"

#### c. Generate validation.md (ALIGNMENT check)

**Purpose**: Did we answer the RIGHT QUESTION?

```bash
openspec instructions validation --change "<name>" --json
```

- Map each success criterion from context.md to findings
- Check answer completeness — does the bottom line answer what was asked?
- Identify missing angles — what aspects of the question are NOT covered?

Show progress: "Created validation.md"

**Quality Gate**: If success criteria are not addressed, pause and discuss.

#### d. Generate audit.md (CORRECTNESS check)

**Purpose**: Is the ANSWER CORRECT?

```bash
openspec instructions audit --change "<name>" --json
```

- Phase 1: SQL Forensics (re-run ALL queries independently — verify numbers)
- Phase 2: Narrative Critique (check for bias, unsupported causality claims)
- Phase 3: Refinement Paths (suggest specific improvements)

Show progress: "Created audit.md"

### 4. Audit Review Gate (CRITICAL)

After generating audit.md, check the Overall Audit Verdict:

- **Blocker count > 0**: STOP and present refinement options
- **Confidence = Low**: STOP and present refinement options
- **Confidence = Medium with Major issues**: Ask user if they want to refine or proceed with caveats

If blockers exist, use **AskUserQuestion** with options:

> "The audit found issues that should be addressed before delivery:"
> [list blockers and major issues]
>
> - "Refine" - Go back and address the issues
> - "Proceed with caveats" - Continue but document limitations clearly
> - "Restart from plan" - Redesign the methodology

---

### 5. Refinement Loop (if user chooses "Refine")

#### 5.1 Identify which artifact to refine

Read the blocker details from audit.md and determine the target:

| Blocker Type | Likely Target | Examples |
|--------------|---------------|----------|
| **Phase 1: SQL issue** | analysis.md | Wrong JOIN type, missing filter, aggregation grain error, query doesn't reproduce |
| **Phase 2: Narrative issue** | analysis.md | Causality claim without evidence, selective emphasis, magnitude framing |
| **Phase 2: Bias exposure** | analysis.md or research.md | Survivorship bias (need different population), selection bias (need different data) |
| **Phase 3: Missing data** | research.md | Refinement path says "need X table" or "need to check Y source" |
| **Phase 3: Wrong methodology** | plan.md | Refinement path suggests different analytical approach |
| **Phase 3: Additional queries** | analysis.md | Refinement path suggests specific queries to run |

#### 5.2 Refine research.md (if data gap)

If the blocker points to missing data or unexplored sources:

1. **Re-read the refinement path** that triggered this
2. **Ask user for additional sources** if needed:
   > "The audit suggests we need [X]. Do you have a source for this, or should I search?"
3. **Explore the new source** following the research instruction:
   - If DBT model: read SQL, schema.yml, tests
   - If BigQuery table: get schema, sample data
   - If LookML: read view/explore definitions
4. **Update research.md**:
   - Add new entries to Source Registry
   - Update Feasibility Verdict if it changes
   - Document what the new source contributes
5. **Proceed to refine analysis.md** with the new data

#### 5.3 Refine plan.md (if methodology issue)

If the blocker points to wrong analytical approach:

1. **Re-read the refinement path** that triggered this
2. **Discuss with user** what methodology change is needed:
   > "The audit suggests [issue]. Options: [A] or [B]. Which approach?"
3. **Update plan.md**:
   - Revise Methodology section
   - Update Metrics Definition if needed
   - Document why the change was made
4. **Re-generate analysis.md** with new methodology

#### 5.4 Refine analysis.md (most common)

For SQL issues (Phase 1 blockers):

1. **Locate the failing query** in analysis.md
2. **Understand the issue** from audit.md:
   - JOIN type wrong? → Change INNER to LEFT or vice versa
   - Filter missing? → Add WHERE clause
   - Aggregation grain wrong? → Fix GROUP BY or add DISTINCT
   - Date filter inconsistent? → Align with other queries
   - NULLs not handled? → Add COALESCE or explicit NULL handling
3. **Fix the SQL** in analysis.md
4. **Re-execute the query** using `mcp__bigquery__execute_sql`
5. **Compare results** with original:
   - If different: update the finding with new numbers
   - If same: the issue may be elsewhere, investigate
6. **Update the finding** narrative to match new data

For narrative issues (Phase 2 blockers):

1. **Locate the problematic finding** in analysis.md
2. **Apply the fix**:
   - Causality claim → Rewrite as correlation: "X is associated with Y" not "X caused Y"
   - Selective emphasis → Add the contradicting data points
   - Magnitude framing → Include both percentage AND absolute numbers
   - Confidence too high → Downgrade and explain why
3. **Do not change the numbers** — only the interpretation

For bias issues:

1. **Survivorship bias** → May need to re-query with different population (include churned/deleted)
2. **Selection bias** → May need different data source (go back to research)
3. **Period bias** → Run query with different time window, compare results
4. **Simpson's Paradox** → Add segmented analysis alongside aggregate

#### 5.5 Re-audit the changes

After refining, **do not re-run the full audit**. Instead:

1. **For SQL fixes**: Re-execute only the affected queries
   - Verify they now reproduce correctly
   - Update audit.md Phase 1 verdict for those queries
2. **For narrative fixes**: Re-read the affected findings
   - Verify the issue is addressed
   - Update audit.md Phase 2 with new assessment
3. **Update the Overall Audit Verdict**:
   - Decrement blocker count
   - Re-assess confidence level
   - Update recommended next step

#### 5.6 Loop until resolved

Repeat steps 5.1-5.5 until:
- **Blocker count = 0**, OR
- **User chooses "Proceed with caveats"**

If user chooses to proceed with caveats, ensure the caveats are documented in:
- audit.md (in the Overall Audit Verdict)
- summary.md (in the Caveats section, when generated)

---

### 6. Show final status

```bash
openspec status --change "<name>"
```

---

## Output

After completing all artifacts, summarize:
- Analysis name and location
- Executive finding (from analysis.md)
- Audit verdict (confidence level, blocker count)
- Prompt: "Run `/opsx:deliver` to generate summary and share with stakeholders."

---

## Output On Pause (Quality Gate)

```
## Analysis Paused

**Analysis:** <name>
**Progress:** <current artifact>

### Issue
<description of what needs attention>

**Options:**
1. Continue with caveats documented
2. Refine the analysis to address gaps
3. Go back to research to find more data

What would you like to do?
```

---

## Guardrails

- **NEVER** skip prerequisites (context, research must be done)
- **NEVER** proceed if feasibility is "Not Feasible" without user confirmation
- **NEVER** skip the Audit Review Gate - blockers must be addressed or explicitly accepted
- **ALWAYS** save ALL SQL queries in analysis.md for reproducibility
- **ALWAYS** run audit SQL independently (don't just copy numbers from analysis.md)
- **ALWAYS** iterate if audit finds blockers - don't just warn and continue
- If validation shows missing success criteria, pause and discuss
- Keep the user informed of progress through each artifact

**Refinement-specific guardrails:**
- **NEVER** re-run full audit after small fixes - only re-verify affected items
- **NEVER** change numbers to match narrative - change narrative to match verified numbers
- **ALWAYS** trace refinement back to the specific audit blocker that triggered it
- **ALWAYS** update audit.md verdict after successful refinement
- If refinement requires new data, go back to research.md first, then re-analyze
