---
name: "OPSA: Analyze"
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts
category: Analytics
tags: [analytics, workflow, openspec]
---

Execute the analysis - generate the execution artifacts (plan -> analysis -> validation -> audit).

**Input**: Optionally specify an analysis name (e.g., `/opsx:analyze <name>`). If omitted, check if it can be inferred from conversation context. If ambiguous, prompt for available analyses.

**Steps**

1. **Select the analysis**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned an analysis
   - Auto-select if only one active analysis exists
   - If ambiguous, run `openspec list --json` and use **AskUserQuestion** to let user select

   Always announce: "Using analysis: <name>" and how to override.

2. **Check prerequisites**

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

3. **Check feasibility from research.md**

   Read `openspec/changes/<name>/research.md` and check the Feasibility Verdict:
   - If **Feasible**: Proceed
   - If **Partially Feasible**: Warn user about gaps, ask for confirmation
   - If **Not Feasible**: Stop and ask user how to proceed

4. **Generate artifacts in sequence**

   Use **TodoWrite** to track progress through the artifacts.

   **a. Generate plan.md**
   ```bash
   openspec instructions plan --change "<name>" --json
   ```
   - Define objectives, methodology, metrics
   - Document assumptions and edge cases
   - Define validation approach
   - Show progress: "Created plan.md"

   **Quality Gate**: If methodology is complex, pause and review with user.

   **b. Generate analysis.md**
   ```bash
   openspec instructions analysis --change "<name>" --json
   ```
   - Execute queries using `mcp__bigquery__execute_sql`
   - Create Looks using `mcp__bigquery__looker_make_look` if needed
   - Document all SQL queries for reproducibility
   - Record findings with confidence levels
   - Show progress: "Created analysis.md"

   **c. Generate validation.md**
   ```bash
   openspec instructions validation --change "<name>" --json
   ```
   - Map each success criterion from context.md to findings
   - Check answer completeness
   - Identify missing angles
   - Show progress: "Created validation.md"

   **Quality Gate**: If success criteria are not addressed, pause and discuss.

   **d. Generate audit.md**
   ```bash
   openspec instructions audit --change "<name>" --json
   ```
   - Phase 1: SQL Forensics (re-run all queries independently)
   - Phase 2: Narrative Critique (check for bias, causality claims)
   - Phase 3: Refinement Paths (suggest improvements)
   - Show progress: "Created audit.md"

   **e. Audit Review Gate** (CRITICAL - do not skip)

   After generating audit.md, check the Overall Audit Verdict:
   - **Blocker count > 0**: STOP and present refinement options (see Output On Pause)
   - **Confidence = Low**: STOP and present refinement options
   - **Confidence = Medium with Major issues**: Ask user if they want to refine or proceed with caveats

   If blockers exist, use **AskUserQuestion** with options:
   > "The audit found issues that should be addressed before delivery:"
   > [list blockers and major issues]
   >
   > - "Refine analysis" - Go back and address the issues
   > - "Proceed with caveats" - Continue but document limitations clearly
   > - "Restart from plan" - Redesign the methodology

   **If user chooses "Refine analysis":**
   - Re-run the affected artifact (analysis.md or plan.md)
   - Re-run audit.md after changes
   - Repeat until blockers are resolved or user chooses to proceed

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing all artifacts, summarize:
- Analysis name and location
- Executive finding (from analysis.md)
- Audit verdict (confidence level, blocker count)
- Prompt: "Run `/opsx:deliver` to generate summary and share with stakeholders."

**Output On Pause (Quality Gate)**

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

**Guardrails**
- **NEVER** skip prerequisites (context, research must be done)
- **NEVER** proceed if feasibility is "Not Feasible" without user confirmation
- **NEVER** skip the Audit Review Gate - blockers must be addressed or explicitly accepted
- **ALWAYS** save all SQL queries in analysis.md for reproducibility
- **ALWAYS** run audit SQL independently (don't just copy numbers)
- **ALWAYS** iterate if audit finds blockers - don't just warn and continue
- If validation shows missing success criteria, pause and discuss
- Keep the user informed of progress through each artifact
