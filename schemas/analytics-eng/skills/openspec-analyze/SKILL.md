---
name: openspec-analyze
description: Execute the analysis - generate plan, analysis, validation, and audit artifacts. Use when context and research are complete and the user is ready to execute.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

Execute the analysis - generate the execution artifacts (plan -> analysis -> validation -> audit).

---

**Steps**

1. **Select the analysis**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context
   - Auto-select if only one active analysis exists
   - If ambiguous, run `openspec list --json` and prompt

   Always announce: "Using analysis: <name>"

2. **Check prerequisites**

   ```bash
   openspec status --change "<name>" --json
   ```

   Verify `context` and `research` artifacts are `done`.

   **If not met:** Suggest running `/opsx:investigate` first.

3. **Check feasibility from research.md**

   - **Feasible**: Proceed
   - **Partially Feasible**: Warn user, ask for confirmation
   - **Not Feasible**: Stop and ask user how to proceed

4. **Generate artifacts in sequence**

   **a. Generate plan.md**
   ```bash
   openspec instructions plan --change "<name>" --json
   ```
   - Define objectives, methodology, metrics
   - Document assumptions and edge cases

   **b. Generate analysis.md**
   ```bash
   openspec instructions analysis --change "<name>" --json
   ```
   - Execute queries using `mcp__bigquery__execute_sql`
   - Document all SQL queries for reproducibility
   - Record findings with confidence levels

   **c. Generate validation.md**
   ```bash
   openspec instructions validation --change "<name>" --json
   ```
   - Map success criteria to findings
   - Identify missing angles

   **d. Generate audit.md**
   ```bash
   openspec instructions audit --change "<name>" --json
   ```
   - Phase 1: SQL Forensics (re-run queries independently)
   - Phase 2: Narrative Critique
   - Phase 3: Refinement Paths

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

Summarize:
- Executive finding
- Audit verdict (confidence, blockers)
- Prompt: "Run `/opsx:deliver` to generate summary and share."

**Guardrails**
- **NEVER** skip prerequisites
- **NEVER** proceed if "Not Feasible" without confirmation
- **ALWAYS** save SQL queries for reproducibility
- **ALWAYS** run audit SQL independently
- Pause at quality gates if issues found
