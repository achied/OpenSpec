---
name: openspec-discover
description: Locates and validates all resources from context.md using the /locate skill. Creates research.md with a verified Project Map of BQ tables, DBT models, and Looker views. Use after context.md exists and before research.
license: MIT
compatibility: Requires openspec CLI with analytics-eng schema.
metadata:
  author: openspec
  version: "2.0"
---

# Discover

Locate all resources, validate they exist, and create research.md with the Project Map.

**Requires:** context.md
**Creates:** research.md (Project Map only)
**Next:** `/openspec-research`

---

## Tool constraint — MANDATORY

**Use ONLY the `/locate` skill to find resources.**

Do NOT use Grep, Glob, Bash, or any MCP tool to search for models or tables.
Do NOT use `search_catalog`, `get_table_info`, or filesystem searches as alternatives.
ONLY `/locate` provides validated code paths for the Project Map.

If `/locate` is unavailable or fails, ask the user — do NOT fall back to other tools.

---

## Steps

Copy this checklist and track progress:

```
Discover Progress:
- [ ] Step 1: Load context
- [ ] Step 2: Locate each resource with /locate
- [ ] Step 3: Confirm BQ projects
- [ ] Step 4: Validate FQDNs
- [ ] Step 5: Create research.md with Project Map
```

### Step 1: Load context

Read context.md and extract all resources with ⏳ status from Source Registry.

If no change specified: auto-select if only one exists, otherwise ask.

### Step 2: Locate each resource

For EACH resource with ⏳ status, run exactly:

```
Skill: /locate
Input: <resource_name>
```

Process resources ONE AT A TIME. Wait for each `/locate` result before starting the next.

**If not found:** Use AskUserQuestion:
> "For `<resource_name>`, which project contains this model?"

**If multiple matches:** Use AskUserQuestion with the matches as options:
> "I found N matches for `<resource>`. Which one?"

Do NOT select automatically. Wait for user response.

### Step 3: Confirm BQ projects

For each located resource where the BQ project is unclear, use AskUserQuestion:

> "I found `<model>` in `<project>`. Which BQ project does it materialize to?"

Do NOT assume BQ project from dataset name. Wrong project = wrong analysis.

### Step 4: Validate FQDNs

For each resource, verify the table exists using `get_table_info`.

If not found: ask user to clarify. Do NOT proceed with unvalidated FQDNs.

### Step 5: Create research.md with Project Map

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
```

Leave all other sections empty — they belong to `/openspec-research`.

---

## Constraints

- Do NOT write to any section of research.md other than Project Map
- Do NOT modify context.md — it is read-only
- Do NOT trace lineage or read code — that is research
- Do NOT proceed with `?` in any FQDN — resolve all unknowns first

---

## Output

Summarize:
- Resources located: N
- Resources validated: N
- Resources skipped: N (with reasons)

**Always end with:**
> "Discovery complete. Run `/openspec-research` to analyze sources."
