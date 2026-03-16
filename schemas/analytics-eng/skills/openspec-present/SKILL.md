---
name: openspec-present
description: Generate an executive HTML slide presentation from a completed analytics-eng analysis. Use this ONLY after summary.md is final and audit.md has zero unresolved blockers. Requires the frontend-slides skill to be installed. Do not invoke mid-analysis.
license: MIT
compatibility: Requires openspec CLI, analytics-eng schema, and frontend-slides skill.
metadata:
  author: openspec
  version: "1.0"
---

# Executive Presentation

Generate an executive-quality HTML slide deck from a completed analytics-eng analysis.

## When to Use

Use this skill when:
- The full analysis cycle is complete: context → research → plan → analysis → validation → audit → summary
- `audit.md` has zero unresolved blockers
- `summary.md` is final and ready for stakeholder consumption
- The user wants a shareable presentation beyond the Confluence/Slack deliverables

## Prerequisite: frontend-slides skill

This skill requires `frontend-slides` to be installed in `.claude/skills/`.

Check availability:
```bash
ls .claude/skills/ | grep slides
```

If not installed, inform the user and stop:

> "The `frontend-slides` skill is not installed. Install it by placing its `SKILL.md`
> in `.claude/skills/frontend-slides/` and running `openspec update`. The analysis is
> already complete and shareable via summary.md, Confluence, and Slack without it."

## Workflow

### 1. Verify readiness

Check that `audit.md` has no unresolved blockers before generating slides.
If blockers exist, stop and ask the user to resolve them first.

### 2. Extract content from completed artifacts

Read the following artifacts and map their content to slides:

| Slide | Source |
|-------|--------|
| Title + bottom line | `context.md` (question), `summary.md` (bottom line) |
| The question & why it matters | `context.md` (stakeholder request, business context, success criteria) |
| Key findings (1 slide per finding, max 4) | `analysis.md` (detailed findings) + `summary.md` (key findings) |
| Recommendations | `summary.md` (recommendations table) |
| Caveats & next steps | `audit.md` (Phase 3 high-priority paths) + `summary.md` (caveats, next steps) |
| Sources appendix | Source Registry from `context.md` + `research.md` |

### 3. Invoke frontend-slides with this brief

Pass the following to the `frontend-slides` skill:

- **Audience**: executives and business stakeholders, not data engineers
- **Format**: self-contained HTML, no external dependencies
- **Tone**: conclusion-first — never lead with methodology
- **Slides**: one idea per slide, max 4 bullets, no full paragraphs
- **Data**: numbers and callouts preferred over complex charts
- **Output**: save as `openspec/changes/<analysis-name>/presentation.html`

### 4. Save and verify

Confirm `presentation.html` opens correctly before notifying stakeholders.
The apply phase will attach it to the Confluence page and Slack notification.

## Key Principles

### Conclusions before methodology

Every slide leads with the finding or recommendation, not the analytical approach.
Executives read the first line of each slide — make it the answer, not the question.

### Verified numbers only

Use only numbers from queries verified in `audit.md` Phase 1.
Never present findings that have unresolved Blocking audit issues.

### Caveats are a feature

Include critical limitations from the audit. Stakeholders need to know what the
data cannot tell them. Present caveats clearly, not defensively — they demonstrate
analytical rigor, not weakness.

## Guardrails

- **Do not invoke mid-analysis** — presentation is the final artifact, after all iterations
- **Do not bypass frontend-slides** — improvised slides without the skill produce generic output
- **Do not include SQL in slides** — link to `analysis.md` or Confluence for technical detail
- **Do not soften audit findings** — if the audit found issues, the presentation must reflect them
- **Do not generate if blockers exist** — resolve audit blockers before presenting to stakeholders
