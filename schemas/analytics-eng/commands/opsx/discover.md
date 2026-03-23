---
name: "OPSX: Discover"
description: Locate and validate all resources from context.md, create research.md with Project Map
category: Analytics
tags: [analytics, workflow, openspec]
---

Locate and validate all resources identified in context.md.

**Input**: A change name with context.md already created (from `/opsx:context`).

---

Invoke the `openspec-discover` skill using the Skill tool, then follow its instructions completely.

The skill contains the full workflow including:
- Load context.md and extract resources
- Locate each resource using `/locate`
- Build the Project Map
- Create research.md scaffold
