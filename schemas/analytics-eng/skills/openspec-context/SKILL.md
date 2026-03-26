---
name: openspec-context
description: Creates context.md for a new analytics investigation. Clarifies analysis type with the user, gathers resource links, and documents the stakeholder request with a Source Registry. Use when starting a new data analysis or investigation.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "2.0"
---

# Context

Understand THE QUESTION and create context.md.

**Creates:** context.md
**Next:** `/openspec-discover`

---

## Steps

Copy this checklist and track progress:

```
Context Progress:
- [ ] Step 1: Clarify analysis type
- [ ] Step 2: Gather resources
- [ ] Step 3: Create change
- [ ] Step 4: Generate context.md
```

### Step 1: Clarify analysis type

**STOP.** Use AskUserQuestion to ask:

> "What analysis do you want to work on?"
> Options: Data discrepancy | Metric investigation | Source validation | New analysis | Custom

Do NOT continue until the user responds. Derive a kebab-case name from their answer.

### Step 2: Gather resources

**STOP.** Use AskUserQuestion to ask:

> "What resources should I use? (Slack link, Confluence page, Looker dashboard, DBT project, BigQuery tables)"

Do NOT continue until the user responds. Scope is defined by what they provide — nothing more.

### Step 3: Create change

```bash
openspec new change "<name>" --schema analytics-eng
```

### Step 4: Generate context.md

```bash
openspec instructions context --change "<name>" --json
```

Extract from resources:
- The question (exact phrasing if possible)
- Who asked and why it matters
- Success criteria

**Resource handling:**
- Explicit table/model names → register in Source Registry as ✅
- Resources mentioned but not read → register as ⏳ pending
- Unclear references ("the X table") → **STOP and ask user to clarify**

Do NOT infer resource names. Always ask when unclear.

---

## Constraints

- Do NOT analyze data logic — only understand the question
- Do NOT explore tables, schemas, or code — that is discover/research
- Do NOT modify context.md after this phase — it is a snapshot
- Base every claim on content actually read

---

## Output

Summarize:
- Analysis name and location
- Question being investigated
- Resources identified (count of ✅ and ⏳)

**Always end with:**
> "Context created. Run `/openspec-discover` to locate and validate sources."
