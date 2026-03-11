---
name: openspec-analyze
description: Reference guide for the analytics-eng workflow phases. Use openspec-bootstrap FIRST to initialize and create the analysis. Use this skill when OpenSpec is already initialized and you need guidance on a specific artifact phase.
license: MIT
compatibility: Requires openspec CLI and analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

# Analytics Analysis Workflow — Phase Reference

Start a new data analysis following the analytics-eng schema workflow.

## When to Use

**If you have not yet initialized OpenSpec or created an analysis, use `openspec-bootstrap` first.**

Use this skill when:
- A stakeholder asks a data question that needs investigation
- You need to validate a hypothesis with data
- You're asked to analyze trends, patterns, or metrics
- You need to create a reproducible analysis with audit trail

## Workflow Overview

```
context -> research -> plan -> analysis -> validation -> audit -> summary
```

Each phase builds on the previous:

| Phase | Purpose | Output |
|-------|---------|--------|
| **Context** | Understand WHY and WHAT | Stakeholder request, success criteria |
| **Research** | Assess data availability | DBT models, BigQuery tables, feasibility |
| **Plan** | Design methodology | Metrics, segmentation, approach |
| **Analysis** | Execute and document | Findings with SQL queries, visualizations |
| **Validation** | Verify against request | Success criteria checklist |
| **Audit** | Check for biases/errors | Methodology review, spot checks |
| **Summary** | Executive deliverable | Bottom line, recommendations |

## Getting Started

### 1. Create a new analysis

```bash
openspec new change <analysis-name> --schema analytics-eng
```

Example:
```bash
openspec new change customer-churn-q1-2024 --schema analytics-eng
```

### 2. Work through each artifact

For each phase, get the instructions:
```bash
openspec instructions <artifact> --change <analysis-name>
```

The instructions will guide you on:
- What to investigate
- Which tools to use (Slack, Confluence, BigQuery, Looker, DBT)
- What sections to document
- Quality gates before proceeding

### 3. Follow the dependency order

You cannot skip phases. Each artifact requires its dependencies:

- `context` - No dependencies, start here
- `research` - Requires context
- `plan` - Requires context + research
- `analysis` - Requires plan
- `validation` - Requires context + analysis
- `audit` - Requires analysis + validation
- `summary` - Requires analysis + validation + audit

## Key Principles

### Always Check DBT First

Before querying BigQuery directly, inspect the DBT project:
- Read existing models (`models/**/*.sql`)
- Check schema documentation (`models/**/*.yml`)
- Review tests for data quality expectations
- Trace dependencies via `ref()` calls

### Document Everything

- Save ALL SQL queries in the analysis for reproducibility
- Link to created Looks and dashboards
- Note data quality issues encountered
- Be explicit about what the data does NOT show

### Quality Gates

Pause and verify at key points:
- **Post-Research**: Confirm data availability before planning
- **Post-Plan**: Review methodology with stakeholder before executing
- **Post-Validation**: Confirm original question is answered
- **Post-Audit**: Verify confidence in conclusions

## Available Tools

| Tool | Purpose |
|------|---------|
| `mcp__plugin_slack_slack__slack_search_public` | Find related Slack discussions |
| `mcp__atlassian__confluence_search` | Search documentation |
| `mcp__bigquery__execute_sql` | Run analytical queries |
| `mcp__bigquery__looker_query` | Query Looker Explores |
| `mcp__bigquery__looker_make_look` | Create saved visualizations |

## Example Session

```
User: Can you analyze why customer retention dropped in Q1?
Assistant: I will start a new analysis for customer retention.

1. First, let me create the analysis:
   openspec new change customer-retention-q1 --schema analytics-eng

2. Now I will work through the context phase to understand the question...
```

## Guardrails

- **Do not skip phases** - Each phase has a purpose; skipping leads to incomplete analysis
- **Do not query before research** - Check DBT models first to avoid reinventing
- **Do not present findings without validation** - Verify against original question
- **Do not skip audit** - Bias and error checking is essential
- **Always cite data sources** - Every finding needs supporting evidence
