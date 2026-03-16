---
name: "OPSA: Explore"
description: "Enter explore mode - think through data questions, investigate sources, clarify requirements"
category: Analytics
tags: [analytics, explore, thinking]
---

Enter explore mode. Think deeply about data. Investigate sources freely. Follow the analysis wherever it goes.

**IMPORTANT: Explore mode is for thinking, not executing.** You may query BigQuery, read DBT models, explore Looker assets, and investigate data sources, but you must NOT write analysis artifacts or generate conclusions. If the user asks you to execute the analysis, remind them to exit explore mode first and run `/opsx:analyze`.

**This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user understand their data.

**Input**: The argument after `/opsx:explore` is whatever the user wants to think about. Could be:
- A vague question: "something seems off with our metrics"
- A specific discrepancy: "two sources show different numbers"
- A change name: to explore in context of that analysis
- A table or metric name
- Nothing (just enter explore mode)

---

## The Stance

- **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
- **Data-grounded** - Query BigQuery, read DBT models, explore Looker - don't theorize in a vacuum
- **Visual** - Use ASCII diagrams for data flows, lineage, and comparisons
- **Adaptive** - Follow interesting threads, pivot when new data emerges
- **Patient** - Don't rush to conclusions, let the shape of the problem emerge

---

## What You Might Do

Depending on what the user brings, you might:

**Explore the data landscape**
- Query BigQuery to understand table shapes and relationships
- Read DBT models to understand business logic
- Compare metrics across sources
- Trace data lineage

**Investigate discrepancies**
- Run the same query against different sources
- Check for filtering differences
- Identify join fanouts or missing records
- Surface timing/refresh issues

**Compare definitions**
- How does Looker define this metric vs DBT vs the raw table?
- What filters are implicit in each source?
- Where do eligibility criteria differ?

**Visualize**
```
    Source A                    Source B
    ════════════════           ════════════════

    table_a                    table_b
        │                          │
        ▼                          ▼
    filter_x = TRUE            filter_y = TRUE
        │                          │
        ▼                          ▼
    Result: X                  Result: Y

    Gap: X - Y — WHERE does it come from?
```

**Surface unknowns**
- What assumptions are we making?
- What data is missing?
- What would we need to prove/disprove the hypothesis?

---

## OpenSpec Awareness

You have full context of the OpenSpec system. Use it naturally.

### Check for context

At the start, quickly check what exists:
```bash
openspec list --json
```

If the user mentioned a specific analysis name, read its artifacts for context.

### When no analysis exists

Think freely. When insights crystallize, you might offer:

- "This feels solid enough to start an analysis. Want me to create one with `/opsx:investigate`?"
- Or keep exploring - no pressure to formalize

### When an analysis exists

If the user mentions an analysis or you detect one is relevant:

1. **Read existing artifacts for context**
   - `openspec/changes/<name>/context.md`
   - `openspec/changes/<name>/research.md`
   - etc.

2. **Reference them naturally in conversation**

3. **Offer to capture when discoveries are made**

   | Discovery Type | Where to Capture |
   |----------------|------------------|
   | New data source found | research.md Source Registry |
   | Stakeholder context clarified | context.md |
   | Methodology insight | plan.md (when it exists) |
   | New question surfaced | context.md Success Criteria |

---

## MCP Tools for Exploration

| Need | Tool |
|------|------|
| Query BigQuery | `mcp__bigquery__execute_sql` |
| Table schema | `mcp__bigquery__get_table_info` |
| List datasets | `mcp__bigquery__list_dataset_ids` |
| List tables | `mcp__bigquery__list_table_ids` |
| Table lineage | `/bigquery-lineage <table> --depth 3` |
| Looker explores | `mcp__bigquery__looker_get_explores` |
| Looker dashboards | `mcp__bigquery__looker_get_dashboards` |
| Run Looker query | `mcp__bigquery__looker_query` |
| Search Slack | `mcp__plugin_slack_slack__slack_search_public` |
| Search Confluence | `mcp__atlassian__confluence_search` |

---

## Ending Exploration

There's no required ending. Exploration might:

- **Flow into an analysis**: "Ready to formalize? I can start with `/opsx:investigate`."
- **Result in artifact updates**: "Updated research.md with these new sources"
- **Just provide clarity**: User has what they need, moves on
- **Continue later**: "We can pick this up anytime"

---

## Guardrails

- **Don't execute** - Query and explore, but don't write analysis conclusions
- **Don't fake understanding** - If something is unclear, query it
- **Don't rush** - Exploration is thinking time, not task time
- **Don't force structure** - Let patterns emerge naturally
- **Do visualize** - A good diagram is worth many queries
- **Do query the data** - Ground discussions in actual numbers
- **Do trace lineage** - Understanding data flow often explains discrepancies
