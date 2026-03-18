# Audit

> **Purpose**: Is the ANSWER CORRECT?
>
> Audit checks CORRECTNESS and rigor. Validation already confirmed we're answering the right question.
> Now we verify the technical foundations: SQL accuracy, narrative integrity, and bias exposure.

---

## Phase 1: SQL Forensics

<!-- Re-execute every query from analysis.md independently and verify results -->

### Query Verification Log

| Query | Expected Result | Actual Result | Verdict | Notes |
|-------|----------------|---------------|---------|-------|
| | | | Verified / Verified with caveats / Failed | |

### SQL Logic Issues Found

<!-- For each query, document logic concerns found during review -->

#### Query: <!-- description -->

**Issues:**
- [ ] JOIN type correct? (INNER vs LEFT — silent null drops?)
- [ ] Date filters consistent with other queries?
- [ ] WHERE clauses excluding records they shouldn't?
- [ ] Aggregation at correct grain? (fanout risk on 1:N joins?)
- [ ] NULLs handled explicitly?
- [ ] Time zone consistent?

**Notes:**

---

#### Query: <!-- description -->

**Issues:**
- [ ] JOIN type correct?
- [ ] Date filters consistent?
- [ ] WHERE clauses appropriate?
- [ ] Aggregation grain correct?
- [ ] NULLs handled?
- [ ] Time zone consistent?

**Notes:**

### Phase 1 Verdict

**SQL Integrity**: <!-- All verified / Issues found -->

**Blockers from Phase 1:**
1.
2.

---

## Phase 2: Narrative Critique

<!-- Read the analysis as a story and identify where the narrative and data diverge -->

### Issues Found

<!-- Use format: Issue | Evidence | Severity | Suggested Fix -->

#### Issue 1: <!-- title -->

**Evidence**: <!-- Cite the specific finding or query in analysis.md -->

**Severity**: <!-- Blocking / Major / Minor -->

**Suggested Fix**:

---

#### Issue 2: <!-- title -->

**Evidence**:

**Severity**: <!-- Blocking / Major / Minor -->

**Suggested Fix**:

---

### Bias Exposure

| Bias Type | Checked? | Finding |
|-----------|----------|---------|
| **Survivorship bias** — churned/failed/deleted records included where relevant? | | |
| **Selection bias** — analyzed population matches population conclusions apply to? | | |
| **Period bias** — time window seasonal or anomalous? | | |
| **Confirmation bias** — contradicting data points surfaced? | | |
| **Simpson's Paradox** — aggregate trend holds when segmented? | | |
| **Magnitude framing** — percentages vs absolutes used appropriately? | | |
| **Causality claims** — causal claims backed by causal methodology? | | |

**Bias issues found:**

### Phase 2 Verdict

**Narrative Integrity**: <!-- Sound / Issues found -->

**Blockers from Phase 2:**
1.
2.

---

## Phase 3: Refinement Paths

<!-- Concrete, actionable paths to sharpen this analysis, each tied to a specific finding -->

### Path 1: <!-- Short descriptive title -->

**Trigger**: <!-- What finding or issue prompted this? Cite it. -->

**Action**: <!-- What specifically should be done? -->

**Affected artifact**: <!-- Research / Plan / Analysis -->

**Expected Impact**: <!-- What would change in the conclusions if addressed? -->

**Priority**: <!-- High / Medium / Low -->

---

### Path 2: <!-- Short descriptive title -->

**Trigger**:

**Action**:

**Affected artifact**: <!-- Research / Plan / Analysis -->

**Expected Impact**:

**Priority**: <!-- High / Medium / Low -->

---

### Path 3: <!-- Short descriptive title -->

**Trigger**:

**Action**:

**Affected artifact**: <!-- Research / Plan / Analysis -->

**Expected Impact**:

**Priority**: <!-- High / Medium / Low -->

---

## Overall Audit Verdict

**SQL Integrity**: <!-- All verified / Issues found: [list] -->

**Narrative Integrity**: <!-- Sound / Issues found: [list] -->

**Confidence in Conclusions**: <!-- High / Medium / Low -->

*Justification*:

**Blocker count**: <!-- How many issues must be resolved before sharing with stakeholders? -->

**Recommended next step**: <!-- Ship as-is / Refine [artifact] / Restart from Plan -->
