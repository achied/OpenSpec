---
name: openspec-discover
description: Locate and validate all resources identified in context.md. Creates research.md with the Project Map.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "1.0"
---

# Discover

Locate all resources, validate they exist, and create research.md with the Project Map.

**Prerequisite:** context.md must exist

**Output:** research.md (with Project Map section)

**Next step:** `/opsx:research`

---

## Input

- A change name with context.md created
- Or infer from conversation / auto-select if only one exists

---

## Steps

### 1. Load context

Read context.md and extract all resources with ⏳ status from Source Registry.

If no change specified:
- Auto-select if only one exists
- Otherwise ask user which change to use

### 2. Locate each resource

For each resource with ⏳ status:

#### 2a. Invoke /locate

```
Skill: /locate
Input: <resource_name>
```

#### 2b. Handle not found

Ask user:
> "For `<resource_name>`, which project contains this model?"
> Options: DBT project path, Looker project path, Skip

#### 2c. Handle multiple matches

Ask user:
> "I found N matches for `<resource>`. Which should I include?"
> - Option 1: `<project>` → `<dataset.table>`
> - Option 2: `<project>` → `<dataset.table>`

**Wait for user response.** Only add selected resources.

### 3. Confirm BQ projects

For each located resource where BQ project is unclear:

Ask user:
> "I found `<model>` in `<DBT|Looker>` project `<path>`. Which BQ project does it materialize to?"

**Do not assume BQ project.** Wrong project = wrong analysis.

### 4. Validate FQDNs

For each resource, use `get_table_info` to verify table exists.

If not found: Ask user to clarify. Do NOT proceed with unvalidated FQDNs.

### 5. Create research.md with Project Map

```bash
openspec instructions research --change "<name>" --json
```

Fill ONLY the Project Map section:

```markdown
## Project Map

| Type | Name | Location | Notes |
|------|------|----------|-------|
| **BQ Project** | project-name | `project-id` | Primary project |
| **DBT Project** | dbt-project | `~/src/path` | Description |
| **Looker Project** | looker-project | `~/src/path` | Description |

**Table -> Project Mapping:**

| Table Name | BQ FQDN | Source Type | Code Project | Code Path |
|------------|---------|-------------|--------------|-----------|
| table_name | project.dataset.table | DBT / Looker / Raw | project-name | path/to/file |
```

Leave other sections empty — they will be filled by `/opsx:research`.

---

## Output

Summarize:
- Resources located: N
- Resources validated: N
- Resources skipped: N (with reasons)

**Always end with:**
> "Discovery complete. Run `/opsx:research` to analyze sources."

---

## Principles

- **Ask, don't guess**: If unclear, ask the user
- **Validate before proceeding**: Every FQDN must be verified
- **No `?` in FQDNs**: Resolve all unknowns before finishing

---

## Guardrails

- Never assume BQ project from dataset name
- Never proceed with unvalidated FQDNs
- If `/locate` fails and user skips, document reason in Project Map
