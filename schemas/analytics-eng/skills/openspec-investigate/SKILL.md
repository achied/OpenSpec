---
name: openspec-investigate
description: Start a new analysis - create it and generate context + research artifacts. Use when the user wants to begin investigating a data question or discrepancy.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.3"
---

# Investigate

Start a new analysis - create the change and generate initial artifacts (context + research).

**Artifacts created:** context.md, research.md

When ready to execute, run `/opsx:analyze`

---

## Steps

### 1. Clarify the analysis

If no clear input, use **AskUserQuestion**:

> "What analysis do you want to work on?"

**Options**: Data discrepancy, Metric investigation, Source validation, New analysis, Custom.

Derive a kebab-case name from their response.

### 2. Ask for resources

Use **AskUserQuestion**:

> "What resources should I use? (Slack link, Confluence page, Looker dashboard, DBT project, BigQuery tables)"

**Wait for response.** Scope is defined by what they provide.

### 3. Create change

```bash
openspec new change "<name>" --schema analytics-eng
```

### 4. Generate context.md

```bash
openspec instructions context --change "<name>" --json
```

For each resource provided:
- **Slack**: Read full thread, extract question and decisions
- **Confluence**: Read page, extract definitions and business logic
- **Looker**: Read dashboard/Look, extract metrics and filters

Register every resource in Source Registry.

### 5. Generate research.md (BLOCKER first)

```bash
openspec instructions research --change "<name>" --json
```

**HARD BLOCKER — ask BEFORE any MCP call:**

> "Where are your DBT/Looker projects? (Local path, GitHub org, or skip)"

If provided: save to auto-memory, fill Project Map in research.md.

If GitHub org: use `gh search code "filename:dbt_project.yml" --owner=<org>`

### 6. Research workflow

**Order: Lineage → Code → MCP (only for gaps)**

1. **Find dependencies**: Invoke `/bigquery-lineage` (iterative mode for complex graphs)
2. **Search code**: For each table found, search in DBT/Looker project by name
3. **MCP fallback**: Only for tables not in any project

**Cross-project**: If lineage shows external tables, ask about other projects.

**Fill as you go:**
- Project Map (projects and table mappings)
- Source Registry (every asset read, FQDN for BQ tables)

### 7. Show status

```bash
openspec status --change "<name>"
```

---

## Principles

- **Static first**: Project files before MCP queries
- **Lineage → Code**: Find dependencies, then read their definitions
- **FQDN always**: `project.dataset.table` for all BQ references
- **Scope discipline**: Only search what user provided, ask for more if needed

---

## Output

Summarize:
- Analysis name and location
- Key findings from context (question, success criteria)
- Key findings from research (feasibility, key sources)
- Prompt: "Run `/opsx:analyze` to execute."

---

## Guardrails

- **NEVER** fabricate context — read every source via MCP
- **NEVER** skip the DBT/Looker question — it's a BLOCKER
- **NEVER** search broadly — scope is user-defined
- **ALWAYS** use FQDN for BigQuery tables
- **ALWAYS** fill Project Map and Source Registry
- If feasibility is "Not Feasible", stop and discuss
