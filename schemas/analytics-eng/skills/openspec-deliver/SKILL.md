---
name: openspec-deliver
description: Generates summary.md and optional presentation.html, then shares findings via Confluence and/or Slack. Verifies audit verdict before delivery. Use when the analysis is complete and ready to share with stakeholders.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "2.0"
---

# Deliver

Generate summary, optional presentation, and share with stakeholders.

**Requires:** All analysis artifacts (context through audit) complete
**Creates:** summary.md, presentation.html (optional)
**Next:** `/openspec-archive`

---

## Steps

Copy this checklist and track progress:

```
Deliver Progress:
- [ ] Step 1: Check prerequisites
- [ ] Step 2: Check audit verdict
- [ ] Step 3: Generate summary.md
- [ ] Step 4: Generate presentation (optional)
- [ ] Step 5: Share with stakeholders
```

### Step 1: Check prerequisites

```bash
openspec status --change "<name>" --json
```

Verify these artifacts are `done`: context, research, plan, analysis, validation, audit.

If not met: suggest "Run `/openspec-analyze` first" and STOP.

If no analysis name provided: auto-select if only one exists, otherwise ask.

### Step 2: Check audit verdict

Read audit.md Overall Audit Verdict:
- **Blocker count > 0**: Warn user, ask for confirmation to proceed
- **Confidence = Low**: Warn user, suggest addressing refinement paths first
- **Confidence = Medium/High**: Proceed

### Step 3: Generate summary.md

```bash
openspec instructions summary --change "<name>" --json
```

- Write executive summary (one page max)
- Lead with bottom line answer
- Include 3-5 key findings
- Add recommendations and next steps

**MUST include audit findings in Caveats section:**
- Copy Audit Confidence level from audit.md
- List any bias exposures from Phase 2
- Document limitations that affect interpretation
- Do NOT soften or hide audit findings

**Verify after writing**: Read summary.md and confirm Audit Confidence is filled in, not blank.

### Step 4: Generate presentation (optional)

Use AskUserQuestion:
> "Do you want to generate an executive slide deck?"
> Options: Yes | No

**If yes:** Invoke `/openspec-present`. If `frontend-slides` is not available, inform user and continue.

**If no:** Skip.

### Step 5: Share with stakeholders

Use AskUserQuestion:
> "How would you like to share the findings?"
> Options: Confluence page | Slack message | Both | Skip sharing

**Confluence:**
- Use `mcp__atlassian__confluence_create_page` or `mcp__atlassian__confluence_update_page`
- Include: bottom line, key findings, recommendations
- Attach presentation.html if it exists

**Slack:**
- Use `mcp__plugin_slack_slack__slack_send_message`
- Ask user for channel if not obvious
- Format: Bottom line + Confluence link + key findings
- Keep it concise

**Do NOT send any message without user confirmation.**

---

## Constraints

- Do NOT deliver if audit has unresolved blockers without user approval
- Do NOT hide audit limitations in summary
- Do NOT send external messages without asking user first
- Do NOT modify any prior artifacts (context, research, analysis, audit)

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

Analysis complete and delivered. Run `/openspec-archive` when ready.
```
