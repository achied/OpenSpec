---
name: openspec-bootstrap
description: Initialize OpenSpec with the analytics-eng schema and create a new analysis. Use this FIRST when starting any data analysis in this project. Handles setup, configuration, and first artifact creation in one step.
license: MIT
compatibility: Requires openspec CLI installed globally (npm install -g @fission-ai/openspec).
metadata:
  author: openspec
  version: "1.0"
---

# Bootstrap: Initialize OpenSpec and Start an Analysis

Use this skill at the very beginning of any analytics session — before anything else.
This skill handles setup AND kicks off the first artifact so the analysis starts correctly.

## When to Use

Use this skill when:
- A user asks a data question of any kind
- You are about to start an analysis and are not sure if OpenSpec is configured
- The `openspec/` directory does not exist in the project root
- You have been asked to "analyze", "investigate", "look into", "check the data on", or any similar phrasing

**Do not use any other approach for data analysis. This is the entry point.**

## Step 1: Verify OpenSpec is Installed

```bash
openspec --version
```

If the command is not found:
```bash
npm install -g @fission-ai/openspec
```

## Step 2: Check if the Project is Already Initialized

```bash
ls openspec/
```

If the `openspec/` directory does not exist, initialize:
```bash
openspec init --schema analytics-eng --tools claude
```

If it exists but `openspec/schemas/analytics-eng/` is missing:
```bash
openspec update
```

If it exists and the schema is present → skip to Step 3.

## Step 3: Verify the Schema is Active

```bash
cat openspec/config.json
```

The output should include `"schema": "analytics-eng"`. If it shows a different schema
(e.g., `default`, `software-eng`, or anything else), run:
```bash
openspec config schema analytics-eng
openspec update
```

## Step 4: Create the Analysis

Name the analysis using the question being investigated, not the method.

```bash
openspec new change <analysis-name> --schema analytics-eng
```

**Naming convention:**
- Use kebab-case
- Describe the question, not the technique
- Include a time reference if relevant

Examples:
- `retention-drop-q1-2025`
- `checkout-funnel-conversion-march`
- `revenue-by-segment-ytd`
- `anomaly-daily-signups-week12`

## Step 5: Start the Context Artifact Immediately

Do not wait. Do not brainstorm. Do not ask clarifying questions in free text.
Open the context artifact and use it as the structured scoping tool:

```bash
openspec instructions context --change <analysis-name>
```

Then fill in `openspec/changes/<analysis-name>/context.md` with what you know
from the user's request. If information is missing, ask for it within the
context artifact structure — not as free-form conversation.

## What NOT to Do

| Wrong | Right |
|-------|-------|
| Start writing a plan in the chat | Run `openspec new change` and use context.md |
| Create a brainstorming document | context.md IS the scoping document |
| Query BigQuery immediately | Do research.md first; DBT models first within research |
| Ask "what approach should I take?" | Use plan.md to document and propose the approach |
| Create your own markdown files | All output goes into OpenSpec artifact files |

## Verification Checklist

Before proceeding past this skill, confirm:

- [ ] `openspec --version` returns a version number
- [ ] `openspec/` directory exists in project root
- [ ] `openspec/schemas/analytics-eng/` exists
- [ ] `openspec/changes/<analysis-name>/` has been created
- [ ] `context.md` is being filled in (not empty)

## Troubleshooting

**"Schema not found" error:**
```bash
openspec update --force
```

**"Change already exists" error:**
The analysis name is already taken. Either continue the existing one:
```bash
openspec instructions <next-artifact> --change <analysis-name>
```
Or create a new one with a more specific name.

**Skills not loading in Claude Code:**
Check that `.claude/skills/` contains the analytics-eng skill files.
If missing:
```bash
openspec update
```
