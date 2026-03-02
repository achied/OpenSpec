## DBT Models Identified

<!-- Relevant models from the local DBT project -->

| Model | Layer | Description | Key Columns | Relevance |
|-------|-------|-------------|-------------|-----------|
| | staging/intermediate/mart | | | |

### Model Details

#### <!-- model_name -->
- **Path**: `models/...`
- **Description**:
- **Key Transformations**:
- **Upstream Dependencies**:
- **Tests Defined**:

## Reusable Assets

<!-- Existing models, CTEs, Looks, or dashboards that can be leveraged -->

- **DBT Models**:
- **Looker Explores**:
- **Existing Looks/Dashboards**:

## Data Sources Identified

<!-- Raw tables or datasets NOT already modeled in DBT -->

| Source | Type | Description | Relevance |
|--------|------|-------------|-----------|
| | raw/external | | |

## Data Quality Assessment

<!-- Completeness, freshness, known issues for each source -->

### Source: <!-- name -->
- **Date Range**:
- **Completeness**:
- **Freshness**:
- **Known Issues**:
- **DBT Tests**: <!-- what tests exist? what do they tell us? -->

## Feasibility

<!-- Can the question be answered with available data? -->

**Verdict**: <!-- Feasible / Partially Feasible / Not Feasible -->

**Available in DBT**:
<!-- What can be answered with existing models? -->

**Gaps**:
<!-- What data is missing or needs new modeling? -->

## Data Lineage

<!-- Where does the data come from? Include DBT model dependencies -->

```
Source System → Raw Tables → DBT Staging → DBT Intermediate → DBT Marts → Looker
```

### Key DBT Dependencies
```
model_a
├── stg_source_x
└── stg_source_y
    └── raw_table_z
```

## Sample Data

<!-- Representative samples showing data structure and content -->

### Model/Table: <!-- name -->
```sql
-- Query used
```

| Column | Value |
|--------|-------|
| | |
