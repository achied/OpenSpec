---
name: openspec-investigate
description: Start a new analysis - create it and generate context + research artifacts. Use when the user wants to begin investigating a data question or discrepancy.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

Start a new analysis - create the change and generate initial artifacts (context + research).

I'll create an analysis with artifacts:
- context.md (stakeholder request, business context, sources)
- research.md (data sources, DBT models, Looker assets, feasibility)

When ready to execute, run /opsx:analyze

---

**Input**: The user's request should include an analysis name (kebab-case) OR a description of what they want to analyze.

**Steps**

1. **If no clear input provided, ask what they want to analyze**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What analysis do you want to work on? Describe the question or problem you're investigating."

   From their description, derive a kebab-case name.

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to analyze.

2. **Ask for specific resources BEFORE creating the change**

   Use the **AskUserQuestion tool** (open-ended) to ask:
   > "Do you have specific resources for this analysis?
   > - Slack thread link or channel + date range
   > - Confluence page
   > - Looker dashboard or Look
   >
   > Or should I search broadly?"

   **Wait for the user's response.** This determines how context gathering will proceed.

3. **Create the change directory**
   ```bash
   openspec new change "<name>" --schema analytics-eng
   ```

4. **Generate context.md**

   Get instructions:
   ```bash
   openspec instructions context --change "<name>" --json
   ```

   Follow the instruction to:
   - Consume every resource the user provided via MCP tools
   - Search Slack/Confluence/Looker for additional context
   - Fill in the Source Registry with every resource read
   - Document stakeholder request, business context, success criteria

   Show progress: "Created context.md"

5. **Generate research.md**

   Get instructions:
   ```bash
   openspec instructions research --change "<name>" --json
   ```

   Follow the instruction to:
   - **Ask about DBT projects first** (this is a BLOCKER - wait for response)
   - Inspect DBT models if provided
   - Explore BigQuery tables
   - Get upstream lineage for key tables (`/bigquery-lineage <table> --depth 3`)
   - Read Looker Explores, dashboards, Looks
   - Assess feasibility
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
- **NEVER** skip the DBT project question - it's a BLOCKER
- **ALWAYS** wait for user responses to blocking questions
- **ALWAYS** register every source consumed in the Source Registry
- If the user provides a Slack link, read the full thread (not just the first message)
- If feasibility is "Not Feasible", stop and discuss with user before proceeding
