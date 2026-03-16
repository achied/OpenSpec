---
name: "OPSA: Deliver"
description: Generate summary and presentation, share with stakeholders
category: Analytics
tags: [analytics, workflow, delivery, openspec]
---

Deliver the analysis - generate summary, presentation, and share with stakeholders.

**Input**: Optionally specify an analysis name (e.g., `/opsx:deliver <name>`). If omitted, infer from context or prompt for selection.

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

   Verify these artifacts are `done`:
   - context, research, plan, analysis, validation, audit

   **If prerequisites are not met:**
   - Display warning listing incomplete artifacts
   - Suggest: "Run `/opsx:analyze` first to complete the analysis."
   - Stop execution

3. **Check audit verdict**

   Read `openspec/changes/<name>/audit.md` and check the Overall Audit Verdict:
   - **Blocker count > 0**: Warn user, ask for confirmation to proceed
   - **Confidence = Low**: Warn user, suggest addressing refinement paths first
   - **Confidence = Medium/High**: Proceed

4. **Generate summary.md**

   ```bash
   openspec instructions summary --change "<name>" --json
   ```

   - Write executive summary (one page max)
   - Lead with bottom line answer
   - Include 3-5 key findings
   - Add recommendations and next steps
   - **MUST include audit findings in Caveats section:**
     - Copy Audit Confidence level from audit.md
     - List any bias exposures identified in Phase 2
     - Document limitations that affect interpretation
   - Show progress: "Created summary.md"

   **Verify audit integration**: Read the generated summary.md and confirm:
   - Audit Confidence is filled in (not blank)
   - Bias considerations are listed (or "None identified")
   - If audit had Medium/Low confidence, this is explained

5. **Generate presentation.html (optional)**

   Ask the user if they want a presentation:
   > "Do you want to generate an executive slide deck?"

   **If yes:** Invoke the `openspec-present` skill, which handles:
   - Checking `frontend-slides` availability
   - Mapping artifacts to slides
   - Generating self-contained HTML
   - Show progress: "Created presentation.html"

   **If no:** Skip and proceed to delivery channels.

6. **Ask about delivery channels**

   Use **AskUserQuestion** with options:
   > "How would you like to share the findings?"
   > - "Confluence page" - Create/update a Confluence page
   > - "Slack message" - Post summary to a channel
   > - "Both" - Confluence + Slack notification
   > - "Skip sharing" - Keep artifacts locally

7. **Execute delivery based on user choice**

   **Confluence:**
   - Use `mcp__atlassian__confluence_create_page` or `confluence_update_page`
   - Include: bottom line, key findings, recommendations
   - Attach presentation.html if it exists
   - Link to full analysis artifacts

   **Slack:**
   - Use `mcp__plugin_slack_slack__slack_send_message`
   - Ask user for channel if not obvious
   - Format: Bottom line + Confluence link + key findings
   - Keep it concise

8. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

```
## Delivery Complete

**Analysis:** <name>
**Summary:** openspec/changes/<name>/summary.md
**Presentation:** openspec/changes/<name>/presentation.html (if generated)

### Shared To:
- Confluence: <link>
- Slack: #<channel>

---

Analysis complete! Run `/opsx:archive` when ready to archive.
```

**Guardrails**
- **NEVER** share findings if audit has blockers without user confirmation
- **NEVER** generate summary without audit findings in Caveats section
- **ALWAYS** include Audit Confidence level in summary
- **ALWAYS** ask user about delivery channels - don't auto-post
- **ALWAYS** keep Slack messages concise - link to Confluence for details
- Delegate presentation generation to `openspec-present` skill
- If Confluence/Slack MCP tools fail, save artifacts locally and inform user
