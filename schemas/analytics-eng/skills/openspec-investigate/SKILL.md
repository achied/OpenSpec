---
name: openspec-investigate
description: Start a new analysis - create it and generate context + research artifacts. Use when the user wants to begin investigating a data question or discrepancy.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.6"
---

# Investigate

Start a new analysis - create the change and generate initial artifacts (context + research).

**Artifacts created:** context.md, research.md

When ready to execute, run `/opsx:analyze`

---

## Input

- A data question or discrepancy to investigate
- Resources provided by the user (Slack, Confluence, Looker, tables)
- Or nothing (will ask for clarification)

---

## Steps

### 1. Clarify the analysis (REQUIRED)

**STOP and ask** using AskUserQuestion:

> "What analysis do you want to work on?"
> Options: Data discrepancy, Metric investigation, Source validation, New analysis, Custom.

**Wait for user response.** Do not proceed until answered.

Derive a kebab-case name from their response.

### 2. Ask for resources (REQUIRED)

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

**Purpose: Understand THE QUESTION and identify resources for research.**

- Extract the question, who asked, why it matters, success criteria
- **Identify ALL resources mentioned** — be thorough:
  - Explicit table/model names
  - Indirect references ("the X table", "X data") → infer or ask
  - Partial names → register with note to clarify
- Register them in Source Registry:
  - Resources you read: ✅ with key contribution
  - Resources mentioned but not yet read: ⏳ pending for research

Don't analyze data logic yet — that's for research.

**Show progress:** "Created context.md. Now starting research phase."

### 5. Locate and map resources (REQUIRED before research)

**For each table/model identified in context.md, invoke `/locate` first.**

If `/locate` can't find the table, **ask** using AskUserQuestion:

> "For `<resource_name>`, which project contains this model?
> - DBT project name/path
> - Looker project name/path
> - Skip (no local code available)"

**Wait for user response.** Do not proceed until answered for each resource.

**If BQ project is not clear** (DBT and Looker can materialize to different BQ projects):

> "I found `<model>` in `<DBT|Looker>` project `<path>`. Which BQ project does it materialize to? (project.dataset)"

**Do not assume BQ project.** Wrong project = wrong lineage = wrong analysis.

**Before proceeding to step 6, verify ALL FQDNs are complete.**
If any FQDN has `?` or is missing the BQ project, STOP and ask:
> "I couldn't determine the BQ project for `<table>`. Which project does it materialize to?"

Do NOT proceed with incomplete FQDNs — lineage will fail.

Fill **Table → Project Mapping** in research.md:

```
| Table Name | BQ FQDN | Source Type | Code Project | Code Path |
|------------|---------|-------------|--------------|-----------|
| dim_customer | bq-prod.core.dim_customer | DBT | ~/src/dbt-core | models/core/dim_customer.sql |
```

### 6. Generate research.md

```bash
openspec instructions research --change "<name>" --json
```

**Show progress:** "Created research.md. Now tracing data lineage."

### 7. Research sources (with task tracking)

**Execute tasks SEQUENTIALLY — one at a time.**
Do NOT start a new task until the current one is completed.
Do NOT read/query resources assigned to other tasks.

**For each source in Project Map:**

#### 7a. Create Task

```
TaskCreate:
  subject: "Research: <source_name>"
  description: "Trace lineage and analyze code"
  activeForm: "Researching <source_name>"
```

TaskUpdate: status → `in_progress`

#### 7b. Trace lineage (REQUIRED - use /bigquery-lineage)

**Use the Skill tool to invoke `/bigquery-lineage`** with the FQDN:

```
Skill: /bigquery-lineage
Input: <FQDN from Project Map>
```

Do NOT extract lineage from code. Do NOT skip this step.

Purpose:
- **Verify**: Confirm lineage identified from DBT code matches actual BigQuery state
- **Enrich**: Discover dependencies not visible in code (sources, external tables, cross-project refs)

**Depth is required for ALL analysis types.** Go 3-4 levels deep minimum.

| Analysis type | Depth goal | Stop when |
|---------------|------------|-----------|
| Data discrepancy | Find where sources meet or split | Convergence/divergence point found |
| Metric investigation | Trace full calculation path | Every component understood |
| Source validation | Trace to raw source | Origin system identified |
| New analysis | Map the data model | Relationships documented |

**For discrepancies — trace to TRUE convergence or divergence:**
- Trace EACH source's lineage independently
- If sources have different immediate upstreams → **keep tracing those upstreams**
- Stop ONLY when you find:
  - **Convergence**: A shared ancestor (even if 4-5 levels up)
  - **Divergence**: Completely separate origin systems (no shared ancestor exists)
- Document the full path from each source to the convergence/divergence point
- This is the ROOT CAUSE of the discrepancy — don't skip it

#### 7c. Analyze code

**Read the code fully** — don't skim:
- Extract ALL field definitions relevant to the analysis
- Document filters, WHERE clauses, JOIN conditions
- Identify business logic encoded in SQL

**Don't stop at first impressions:**
- If something seems off, explore alternative interpretations
- Open multiple analysis paths if logic is ambiguous
- Document uncertainties for the analysis phase

#### 7d. Document and complete

- **Document findings** in research.md BEFORE moving to next source
- **Keep sources clearly separated** to avoid mixing findings
- **Verify task is fully complete** (lineage traced, code analyzed, findings documented)
- TaskUpdate: status → `completed`
- Do NOT start next task until this one shows `completed`

**For NEW dependencies found:**
- Repeat step 5 (locate + confirm FQDN)
- Then repeat from 7b for the new dependency

### 8. Show status and next step

```bash
openspec status --change "<name>"
```

**Always end with:**
> "Investigation complete. Run `/opsx:analyze` when ready to execute the analysis."

---

## Principles

- **Locate → Lineage → Code**: First find source (`/locate`), then dependencies (`/bigquery-lineage`), then read code
- **Recursive exploration**: For each dependency found, repeat the cycle (locate → lineage → code)
- **Track with Tasks**: Create a Task for each source — update status as you progress
- **Depth over speed**: Go 3-4 levels deep. Don't stop at first impressions. Applies to ALL analysis types.
- **One source at a time**: Complete and document each source before starting the next
- **Type-specific goals**: Each analysis type has a depth goal — trace until that goal is met
- **Ask, don't guess**: If table/FQDN is unclear, ask the user
- **Tool priority**: Skills first (`/locate`, `/bigquery-lineage`), then project files (yml, lkml), then BigQuery MCP (`search_catalog`, `execute_sql`, `get_table_info`) only for gaps
- **Resource inspection**: When you encounter a link or resource reference, identify its type and use the appropriate tool to inspect it — don't just note it, read it
- **Fill as you go**: Update Project Map and Source Registry as you discover resources

---

## Output

Summarize:
- Analysis name and location
- Key findings from context (question, success criteria)
- Key findings from research (feasibility, key sources)
- Prompt: "Run `/opsx:analyze` to execute."

---

## Guardrails

- Base every claim on content you've actually read
- Ask about DBT/Looker projects before starting research
- Search only within user-provided scope — ask for more if needed
- Use FQDN (`project.dataset.table`) for all BigQuery references
- **Never leave `?` in FQDN** — always ask to resolve before continuing
- Update Project Map and Source Registry as you discover resources
- Stop and discuss with user if feasibility is "Not Feasible"
