---
name: "OPSA: Investigate"
description: Start a new analysis - create it and generate context + research artifacts
category: Analytics
tags: [analytics, workflow, openspec]
---

Start a new analysis - create the change and generate initial artifacts (context + research).

I'll create an analysis with artifacts:
- context.md (stakeholder request, business context, sources)
- research.md (data sources, DBT models, Looker assets, feasibility)

When ready to execute, run /opsx:analyze

---

**Input**: The argument after `/opsx:investigate` is the analysis name (kebab-case), OR a description of what the user wants to analyze.

---

**Search Discipline** (prevents context explosion)

The scope is defined by what the user provides. Do NOT search beyond it.

| Source | User provides | Action |
|--------|---------------|--------|
| **Slack** | Link to message | Read message + full thread if exists |
| **Slack** | Link + time range | Read messages in range + their threads |
| **Confluence** | Link to page | Read page + linked pages (1 level) |
| **Looker** | Link to dashboard/Look | Read resource + underlying Explore |

**If context is insufficient** → ask user for more links, do not search.

---

**Steps**

1. **If no input provided, ask what they want to analyze**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What analysis do you want to work on? Describe the question or problem you're investigating."

   From their description, derive a kebab-case name (e.g., "why do these two reports show different numbers" -> `report-discrepancy-mar-2026`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to analyze.

2. **Ask for specific resources BEFORE creating the change**

   Use the **AskUserQuestion tool** (open-ended) to ask:
   > "What resources should I use for context?
   > - Slack link (I'll read the thread if it has one)
   > - Slack link + time range (I'll read subsequent messages too)
   > - Confluence page or Looker dashboard"

   **Wait for the user's response.** The scope of context gathering is defined by what they provide.

3. **Create the change directory**
   ```bash
   openspec new change "<name>" --schema analytics-eng
   ```
   This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

4. **Generate context.md**

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

5. **Generate research.md**

   Get instructions:
   ```bash
   openspec instructions research --change "<name>" --json
   ```

   Follow the instruction to:
   - **Ask about DBT and Looker projects** (BLOCKER - wait for response):
     > "Do you have a DBT project I should inspect? Path to `dbt_project.yml`?
     > Do you have a Looker project? Name or connection?"
   - **Inspect DBT models** if provided:
     - Read model SQL and document key business logic (filters, calculations, joins)
     - Identify hardcoded values, business rules encoded in WHERE clauses
   - **Trace lineage** for key tables (`/bigquery-lineage <table> --depth 3`):
     - Document the full dependency chain from source to mart
     - Identify where transformations happen that could affect the analysis
   - **Inspect Looker assets** if project provided:
     - Read Explore definitions, document measure/dimension logic
     - Check for filters, derived tables, or calculations that affect results
   - Assess feasibility with understanding of the data transformations
   - Continue the Source Registry from context.md

   Show progress: "Created research.md"

6. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing artifacts, summarize:
- Analysis name and location
- Key findings from context (stakeholder question, success criteria)
- Key findings from research (feasibility verdict, key data sources)
- Prompt: "Run `/opsx:analyze` to design and execute the analysis."

**Guardrails**
- **NEVER** fabricate context - use MCP tools to read every source
- **NEVER** skip asking for resources - specific links save time
- **NEVER** skip the DBT/Looker project question - it's a BLOCKER
- **ALWAYS** wait for user responses to blocking questions
- **ALWAYS** register every source consumed in the Source Registry
- If the user provides a Slack link, read the full thread (not just the first message)
- If feasibility is "Not Feasible", stop and discuss with user before proceeding
