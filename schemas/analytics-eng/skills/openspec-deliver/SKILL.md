---
name: openspec-deliver
description: Generate summary and presentation, share with stakeholders. Use when analysis is complete and ready to be shared.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

Deliver the analysis - generate summary, presentation, and share with stakeholders.

---

**Steps**

1. **Select the analysis**

   If a name is provided, use it. Otherwise infer or prompt.

2. **Check prerequisites**

   ```bash
   openspec status --change "<name>" --json
   ```

   Verify: context, research, plan, analysis, validation, audit are `done`.

3. **Check audit verdict**

   - **Blockers > 0**: Warn user, ask for confirmation
   - **Confidence = Low**: Suggest addressing refinement paths first
   - **Confidence = Medium/High**: Proceed

4. **Generate summary.md**

   ```bash
   openspec instructions summary --change "<name>" --json
   ```

   - Executive summary (one page max)
   - Bottom line answer
   - 3-5 key findings
   - Recommendations and caveats

5. **Generate presentation.html (optional)**

   Ask user if they want a presentation. If yes, invoke the `openspec-present` skill
   which handles all presentation logic (frontend-slides check, artifact mapping, etc.).

6. **Ask about delivery channels**

   Use **AskUserQuestion**:
   - "Confluence page"
   - "Slack message"
   - "Both"
   - "Skip sharing"

7. **Execute delivery**

   **Confluence:** `mcp__atlassian__confluence_create_page`
   **Slack:** `mcp__plugin_slack_slack__slack_send_message`

8. **Show final status**

**Output**

```
## Delivery Complete

**Analysis:** <name>
**Summary:** openspec/changes/<name>/summary.md

### Shared To:
- Confluence: <link>
- Slack: #<channel>

---

Run `/opsx:archive` when ready to archive.
```

**Guardrails**
- **NEVER** share if audit has blockers without confirmation
- **ALWAYS** ask about delivery channels
- Delegate presentation to `openspec-present` skill
- Keep Slack messages concise
