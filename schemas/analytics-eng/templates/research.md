## Source Registry (continued from context.md)

<!-- Add entries here for every asset read during research.
     Start numbering from where context.md left off.
     Do NOT re-list sources from context.md — only new ones found here. -->

| # | Type | Resource | URL / Path | Read? | Key Contribution |
|---|------|----------|------------|-------|------------------|
| | DBT model | | `models/...` | ✅ / ❌ | |
| | BigQuery table | | `project.dataset.table` | ✅ / ❌ | |
| | LookML view | | `views/...` | ✅ / ❌ | |
| | LookML explore | | `models/...` | ✅ / ❌ | |
| | Looker dashboard | | | ✅ / ❌ | |
| | Looker Look | | | ✅ / ❌ | |

---

## DBT Models Identified

| Model | Layer | Path | Relevance | Reusable? |
|-------|-------|------|-----------|-----------|
| | staging / intermediate / mart | `models/...` | High / Medium / Low | Yes / No |

### Model Detail: `<!-- model_name -->`

- **Path**: `models/...`
- **Description**:
- **Key Business Logic** (filters, hardcoded values, rules encoded in SQL):
- **Upstream Dependencies** (`ref()` calls):
- **Tests Defined** (and what they tell us about data contracts):
- **Gaps or Limitations**:

---

## LookML Project (if inspected)

<!-- Only fill if a Looker project was provided and inspected -->

### Project Overview

- **Project path**:
- **Connection(s)**:
- **Key models/explores**:

### View Detail: `<!-- view_name -->`

- **Path**: `views/...`
- **Base table** (`sql_table_name`):
- **Key Dimensions**:
  - `dimension_name`: type, sql definition, business logic encoded
- **Key Measures**:
  - `measure_name`: type, sql definition, filters applied
- **Derived Tables** (if any):
  - Materialization strategy (persisted / triggered / ephemeral)
  - SQL or explore_source definition summary
- **Business Logic Encoded**:

### Explore Detail: `<!-- explore_name -->`

- **Path**: `models/...` or `explores/...`
- **Base view** (`from:`):
- **Joins**:
  | Joined View | Relationship | Join Type | sql_on |
  |-------------|--------------|-----------|--------|
  | | one_to_many / many_to_one / etc. | left_outer / inner | |
- **Hidden Filters**:
  - `sql_always_where`:
  - `always_filter`:
  - `access_filter`:
- **Fanout Risk**: Yes / No — explain if yes

### LookML Patterns Found

<!-- Patterns that could explain discrepancies or affect analysis -->

- [ ] `sql_always_where` in explores (hidden filters)
- [ ] Inner joins that exclude records
- [ ] Derived tables with hardcoded date filters
- [ ] Measures with embedded filters
- [ ] Fanout joins (1:N) affecting counts
- [ ] `cancel_grouping_fields` usage

**Notes**:

---

## Reusable Looker Assets (via API)

<!-- Existing assets that could answer or partially answer the question.
     For each one: what question does it answer? what metrics does it use?
     Could it be run as-is, adapted, or only used as reference? -->

### Dashboard / Look: `<!-- name -->`

- **URL**:
- **Explores used**:
- **Metrics / measures defined**:
- **Filters / time window applied**:
- **Answers this question**: Yes (fully) / Partially / No
- **How to use**: Run as-is / Adapt with different filters / Reference only

---

## Data Sources Identified (raw / unmodeled)

<!-- Only tables NOT already covered by DBT models above -->

| Source | Path | Date Range | Row Count | Gap it fills |
|--------|------|------------|-----------|--------------|
| | `project.dataset.table` | | | |

---

## Data Quality Assessment

### Source: `<!-- name (cite Source Registry #) -->`

- **Date Range**:
- **Completeness** (nulls, missing periods):
- **Freshness** (last updated):
- **Known Issues**:
- **DBT Tests** (what guarantees exist?):

---

## Feasibility Verdict

**Status**: <!-- Feasible / Partially Feasible / Not Feasible -->

**Available now** (can be answered with existing assets):

**Gaps** (missing data or models required):

**Blocker for stakeholder?** <!-- Yes / No — if Yes, stop here -->

---

## Data Lineage

```
Source System → Raw Tables → DBT Staging → DBT Intermediate → DBT Marts → Looker
```

### Key dependency chain for this analysis:

```
<!-- e.g.:
mart_retention
├── int_user_activity
│   └── stg_events (→ raw.events)
└── stg_users (→ raw.users)
-->
```
