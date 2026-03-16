---
name: "OPSA: Archive"
description: Archive a completed analysis
category: Analytics
tags: [analytics, workflow, archive, openspec]
---

Archive a completed analysis.

**Input**: Optionally specify an analysis name (e.g., `/opsx:archive <name>`). If omitted, infer from context or prompt for selection.

**Steps**

1. **Select the analysis**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context
   - Auto-select if only one active analysis exists
   - If ambiguous, run `openspec list --json` and prompt

   Show only active analyses (not already archived).

2. **Check artifact completion status**

   ```bash
   openspec status --change "<name>" --json
   ```

   Check all artifacts:
   - context, research, plan, analysis, validation, audit, summary: required
   - presentation: optional

   **If required artifacts are not `done`:**
   - Display warning listing incomplete artifacts
   - Ask: "Archive anyway? (Some artifacts are incomplete)"
   - Proceed only if user confirms

3. **Check if findings were shared**

   If no evidence of sharing in summary.md:
   - Ask: "Findings weren't shared with stakeholders. Archive anyway, or run `/opsx:deliver` first?"

4. **Perform the archive**

   Create archive directory if it doesn't exist:
   ```bash
   mkdir -p openspec/changes/archive
   ```

   Generate target name: `YYYY-MM-DD-<analysis-name>`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming
   - If no: Move the change directory

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

5. **Display summary**

   Show archive completion:
   - Analysis name
   - Original question (from context.md)
   - Bottom line answer (from summary.md)
   - Archive location
   - Delivery status (if shared)

**Output On Success**

```
## Archive Complete

**Analysis:** <name>
**Question:** <original stakeholder question>
**Answer:** <bottom line from summary>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/

### Artifacts Preserved
- context.md, research.md, plan.md, analysis.md
- validation.md, audit.md, summary.md
- presentation.html (if generated)

---

Start a new analysis with `/opsx:investigate`.
```

**Output With Warnings**

```
## Archive Complete (with warnings)

**Analysis:** <name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/

**Warnings:**
- Archived with incomplete artifacts
- Findings were not shared with stakeholders

Review the archive if this was not intentional.
```

**Output On Error**

```
## Archive Failed

**Target:** openspec/changes/archive/YYYY-MM-DD-<name>/

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
```

**Guardrails**
- Always prompt for analysis selection if not provided
- Don't block archive on warnings - just inform and confirm
- Preserve .openspec.yaml when moving to archive
- Show clear summary including question and answer
- Remind user about `/opsx:investigate` for new analyses
