---
name: openspec-deliver
description: Generate summary and presentation, share with stakeholders. Use when analysis is complete and ready to be shared.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.3"
---

# Deliver

Deliver the analysis - generate summary, presentation, and share with stakeholders.

---

## Input

Optionally specify an analysis name. If omitted, infer from context or prompt for selection.

Always announce: "Using analysis: <name>"

---

## Steps

### 1. Check prerequisites

```bash
openspec status --change "<name>" --json
```

Verify these artifacts are `done`:
- context, research, plan, analysis, validation, audit

**If prerequisites are not met:**
- Display warning listing incomplete artifacts
- Suggest: "Run `/opsx:analyze` first to complete the analysis."
- Stop execution

### 2. Check audit verdict

Read `openspec/changes/<name>/audit.md` and check the Overall Audit Verdict:
- **Blocker count > 0**: Warn user, ask for confirmation to proceed
- **Confidence = Low**: Warn user, suggest addressing refinement paths first
- **Confidence = Medium/High**: Proceed

### 3. Generate summary.md

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

Show progress: "Created summary.md"

**Verify audit integration**: Read the generated summary.md and confirm:
- Audit Confidence is filled in (not blank)
- Bias considerations are listed (or "None identified")
- If audit had Medium/Low confidence, this is explained

### 4. Generate presentation.html (optional)

Ask the user if they want a presentation:

> "Do you want to generate an executive slide deck?"

**If yes:**
```bash
openspec instructions presentation --change "<name>" --json
```

Invoke `frontend-slides` skill. If not available, inform user and continue with summary only.

Show progress: "Created presentation.html"

**If no:** Skip and proceed to delivery channels.

### 5. Ask about delivery channels

Use **AskUserQuestion** with options:

> "How would you like to share the findings?"
> - "Confluence page" - Create/update a Confluence page
> - "Slack message" - Post summary to a channel
> - "Both" - Confluence + Slack notification
> - "Skip sharing" - Keep artifacts locally

### 6. Execute delivery based on user choice

**Confluence:**
- Use `mcp__atlassian__confluence_create_page` or `mcp__atlassian__confluence_update_page`
- Include: bottom line, key findings, recommendations
- Attach presentation.html if it exists
- Link to full analysis artifacts

**Slack:**
- Use `mcp__plugin_slack_slack__slack_send_message`
- Ask user for channel if not obvious
- Format: Bottom line + Confluence link + key findings
- Keep it concise

### 7. Show final status

```bash
openspec status --change "<name>"
```

---

## Output

```
## Delivery Complete

**Analysis:** <name>
**Summary:** openspec/changes/<name>/summary.md
**Presentation:** openspec/changes/<name>/presentation.html (if generated)

### Shared To:
- Confluence: <link>
- Slack: #<channel>

---

Analysis complete and delivered.
```

---

## Guardrails

- Verify audit is complete before generating summary
- Warn user and ask confirmation if audit has blockers or low confidence
- Include audit findings and caveats in summary — do not hide limitations
- Ask user about delivery channels before posting
- Keep Slack messages concise — link to Confluence for details
- Confirm before sending any external messages
