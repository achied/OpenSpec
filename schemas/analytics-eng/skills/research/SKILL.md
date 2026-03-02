---
name: openspec-research
description: Explore and assess data availability for analytics. Systematically inspects DBT models, BigQuery tables, and Looker assets before planning analysis.
license: MIT
compatibility: Requires openspec CLI, analytics-eng schema, and BigQuery/Looker MCP tools.
metadata:
  author: openspec
  version: "1.0"
---

# Data Research for Analytics

Systematically explore available data sources to assess feasibility of an analysis.

## When to Use

Use this skill when:
- Starting the research phase of an analytics-eng analysis
- You need to understand what data is available before planning
- Exploring a new domain or dataset
- Validating whether a question can be answered with available data

## The Research Order

**CRITICAL: Always follow this order to avoid reinventing existing work.**

### Step 1: Inspect Local DBT Project (ALWAYS FIRST)

Before touching BigQuery, understand what the team has already built:

```bash
# Find the DBT project structure
cat dbt_project.yml

# Find relevant models
ls models/**/*.sql

# Read schema documentation
cat models/**/schema.yml
```

**What to look for:**
- Existing models that might answer your question
- Column descriptions and business logic documentation
- Tests that reveal data quality expectations
- `ref()` calls to trace dependencies

### Step 2: Explore BigQuery (Fill Gaps)

Only after understanding DBT, query BigQuery for:
- Raw source tables not yet modeled
- Data freshness validation
- Row counts and date ranges
- Sample data to verify assumptions

**Tools:**
- `mcp__bigquery__list_dataset_ids` - Available datasets
- `mcp__bigquery__list_table_ids` - Tables in a dataset
- `mcp__bigquery__get_table_info` - Schema and metadata
- `mcp__bigquery__execute_sql` - Exploratory queries

### Step 3: Check Existing Analytics

Don't rebuild what exists:

**Tools:**
- `mcp__bigquery__looker_get_explores` - Available Explores
- `mcp__bigquery__looker_get_dashboards` - Existing dashboards
- `mcp__bigquery__looker_get_looks` - Saved Looks

## Research Checklist

Before proceeding to the Plan phase, verify:

- [ ] Identified all relevant DBT models
- [ ] Documented data freshness and date ranges
- [ ] Checked for data quality issues
- [ ] Assessed feasibility (can the question be answered?)
- [ ] Listed gaps (what data is missing?)
- [ ] Found reusable assets (models, Looks, dashboards)

## Output Template

Your research artifact should include:

```markdown
## DBT Models Identified

| Model | Layer | Description | Relevance |
|-------|-------|-------------|-----------|
| ... | staging/intermediate/mart | ... | High/Medium/Low |

## Data Sources Identified

| Source | Type | Date Range | Row Count |
|--------|------|------------|-----------|
| ... | raw/dbt/looker | ... | ... |

## Feasibility

**Verdict**: Feasible / Partially Feasible / Not Feasible

**Available in DBT**: ...

**Gaps**: ...

## Data Quality Issues

- ...

## Reusable Assets

- **DBT Models**: ...
- **Looker Explores**: ...
- **Existing Looks**: ...
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Querying raw tables directly | Check DBT models first |
| Missing existing Looks | Search Looker before creating new |
| Assuming data exists | Verify with count queries |
| Ignoring data quality | Check DBT tests and run validation |
| Not documenting lineage | Trace `ref()` calls in DBT |

## Quality Gate

**Do not proceed to Plan if:**
- Critical data is missing
- Data quality issues are unresolved
- Feasibility is unclear

Instead, document gaps and discuss with stakeholder before continuing.
