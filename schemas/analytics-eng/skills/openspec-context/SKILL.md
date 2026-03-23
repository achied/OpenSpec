---
name: openspec-context
description: Understand the question and create context.md. Clarifies analysis type, gathers resources, and documents the stakeholder request.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

# Context

Understand THE QUESTION and create context.md with stakeholder request and resources.

**Artifact created:** context.md

**Next step:** `/opsx:discover`

---

## Input

- A data question or discrepancy to investigate
- Resources provided by the user (Slack, Confluence, Looker, tables)
- Or nothing (will ask for clarification)

---

## Steps

### 1. Clarify the analysis

**STOP and ask** using AskUserQuestion:

> "What analysis do you want to work on?"
> Options: Data discrepancy, Metric investigation, Source validation, New analysis, Custom.

**Wait for user response.** Do not proceed until answered.

Derive a kebab-case name from their response.

### 2. Ask for resources

**STOP and ask** using AskUserQuestion:

> "What resources should I use? (Slack link, Confluence page, Looker dashboard, DBT project, BigQuery tables)"

**Wait for user response.** Do not proceed until answered. Scope is defined by what they provide.

### 3. Create change

```bash
openspec new change "<name>" --schema analytics-eng
```

### 4. Generate context.md

```bash
openspec instructions context --change "<name>" --json
```

#### 4a. Extract from resources

- The question (exact phrasing if possible)
- Who asked and why it matters
- Success criteria

#### 4b. Identify resources mentioned

- Explicit table/model names → register in Source Registry
- Unclear references ("the X table", "X data") → **ask user to clarify**
- Partial names → **ask user to clarify**

Do NOT infer. Always ask when unclear.

#### 4c. Register in Source Registry

- Resources you read: ✅ with key contribution
- Resources mentioned but not read: ⏳ pending for discovery

---

## Output

Summarize:
- Analysis name and location
- Question being investigated
- Resources identified (count of ✅ and ⏳)

**Always end with:**
> "Context created. Run `/opsx:discover` to locate and validate sources."

---

## Guardrails

- Base every claim on content you've actually read
- Don't analyze data logic — only understand the question
- Never infer — ask when something is unclear
- Register ALL mentioned resources, even if unclear (mark ⏳)
