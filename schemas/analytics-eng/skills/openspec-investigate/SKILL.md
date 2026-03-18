---
name: openspec-investigate
description: Start a new analysis - create it and generate context + research artifacts. Use when the user wants to begin investigating a data question or discrepancy.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.1"
---

# Investigate

Start a new analysis - create the change and generate initial artifacts (context + research).

**Artifacts created:**
- context.md (stakeholder request, business context, sources)
- research.md (data sources, DBT models, Looker assets, feasibility)

When ready to execute, run `/opsx:analyze`

---

## Search Discipline

The scope is defined by what the user provides. Do NOT search beyond it.

| Source | User provides | Action |
|--------|---------------|--------|
| **Slack** | Link to message | Read message + full thread if exists |
| **Slack** | Link + time range | Read messages in range + their threads |
| **Confluence** | Link to page | Read page + linked pages (1 level) |
| **Looker** | Link to dashboard/Look | Read resource + underlying Explore |

**If context is insufficient** -> ask user for more links, do not search broadly.

---

## Input

The input should be an analysis name (kebab-case) OR a description of what the user wants to analyze.

Example: "why do these two reports show different numbers" -> `report-discrepancy-mar-2026`

---

## Steps

### 1. Clarify the analysis (if needed)

If no clear input provided, use **AskUserQuestion** (open-ended) to ask:

> "What analysis do you want to work on? Describe the question or problem you're investigating."

From their description, derive a kebab-case name.

**IMPORTANT**: Do NOT proceed without understanding what the user wants to analyze.

### 2. Ask for specific resources BEFORE creating the change

Use **AskUserQuestion** (open-ended) to ask:

> "What resources should I use for context?
> - Slack link (I'll read the thread if it has one)
> - Slack link + time range (I'll read subsequent messages too)
> - Confluence page or Looker dashboard"

**Wait for the user's response.** The scope of context gathering is defined by what they provide.

### 3. Create the change directory

```bash
openspec new change "<name>" --schema analytics-eng
```

This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

### 4. Generate context.md

Get instructions:
```bash
openspec instructions context --change "<name>" --json
```

Follow the instruction to:
- Consume every resource the user provided via MCP tools
- Follow links/references found IN those resources (max 1 level deep)
- Fill in the Source Registry with every resource read
- Document stakeholder request, business context, success criteria

Show progress: "Created context.md"

### 5. Generate research.md

Get instructions:
```bash
openspec instructions research --change "<name>" --json
```

**First, ask about DBT and Looker projects** (BLOCKER - wait for response):

> "Do you have a DBT project I should inspect? Path to `dbt_project.yml`?
> Do you have a Looker project I should inspect? Path to the project folder?"

Then follow the instruction to:
- **Inspect DBT models** if provided:
  - Read model SQL and document key business logic (filters, calculations, joins)
  - Identify hardcoded values, business rules encoded in WHERE clauses
  - Read schema.yml for tests and documentation
- **Trace lineage** for key tables (`/bigquery-lineage <table> --depth 3`):
  - Document the full dependency chain from source to mart
  - Identify where transformations happen that could affect the analysis
- **Inspect LookML files** if Looker project provided:
  - Read `.view.lkml` files: dimensions, measures, derived tables
  - Read `.model.lkml` files: explores, joins, hidden filters
  - Document `sql_table_name` to understand which BigQuery tables back each view
  - Look for `sql_always_where`, inner joins, measure filters that affect results
  - Check derived tables for business logic and materialization strategy
- Assess feasibility with understanding of the data transformations
- Continue the Source Registry from context.md

Show progress: "Created research.md"

### 6. Show final status

```bash
openspec status --change "<name>"
```

---

## Output

After completing artifacts, summarize:
- Analysis name and location
- Key findings from context (stakeholder question, success criteria)
- Key findings from research (feasibility verdict, key data sources)
- Prompt: "Run `/opsx:analyze` to design and execute the analysis."

---

## Guardrails

- **NEVER** fabricate context - use MCP tools to read every source
- **NEVER** skip asking for resources - specific links save time
- **NEVER** skip the DBT/Looker project question - it's a BLOCKER
- **NEVER** search broadly - scope is defined by user-provided resources
- **ALWAYS** wait for user responses to blocking questions
- **ALWAYS** register every source consumed in the Source Registry
- If the user provides a Slack link, read the full thread (not just the first message)
- If feasibility is "Not Feasible", stop and discuss with user before proceeding
