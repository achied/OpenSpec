---
name: openspec-archive
description: Archive a completed analysis. Use when the analysis is finished and ready to be stored for reference.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

Archive a completed analysis.

---

**Steps**

1. **Select the analysis**

   If a name is provided, use it. Otherwise infer or prompt.
   Show only active analyses (not already archived).

2. **Check artifact completion**

   ```bash
   openspec status --change "<name>" --json
   ```

   Required: context, research, plan, analysis, validation, audit, summary
   Optional: presentation

   **If incomplete:** Warn and ask for confirmation.

3. **Check if findings were shared**

   If not shared, ask: "Archive anyway, or run `/opsx:deliver` first?"

4. **Perform the archive**

   ```bash
   mkdir -p openspec/changes/archive
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

5. **Display summary**

**Output On Success**

```
## Archive Complete

**Analysis:** <name>
**Question:** <from context.md>
**Answer:** <from summary.md>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/

---

Start a new analysis with `/opsx:investigate`.
```

**Guardrails**
- Always prompt for selection if not provided
- Don't block on warnings - just inform and confirm
- Preserve .openspec.yaml when moving
