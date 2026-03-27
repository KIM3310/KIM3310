# Open-Source Contribution Plan for Doeon Kim (KIM3310)

Prepared: 2026-03-27

This document outlines three concrete, achievable open-source contribution opportunities that directly leverage Doeon's existing project experience. Each contribution is designed to be completable in 1-2 hours.

---

## Contribution 1: vercel/ai (AI SDK)

**What:** Add a community cookbook example demonstrating tool-calling middleware with structured output recovery -- a pattern Doeon built in `stage-pilot`.

**Area:** `examples/` directory or `content/cookbook/` in the AI SDK docs site

**Why it fits Doeon:**
- `stage-pilot` is a tool-calling reliability runtime built on top of the AI SDK
- Doeon has production experience with parser hardening, bounded retry, and structured output validation
- The AI SDK docs currently lack examples showing middleware patterns for tool-call reliability

**Issue/Gap:** The AI SDK has a middleware API (`experimental_wrapMiddleware`) but the examples directory and cookbook have limited coverage of error-recovery middleware for tool calling. Community examples showing real-world middleware patterns are actively welcomed via the `examples/` directory.

**Estimated time:** 1.5 hours

**Detailed plan:** [ai-sdk-contribution.md](./ai-sdk-contribution.md)

---

## Contribution 2: langchain-ai/langgraph (LangGraph)

**What:** Add a how-to documentation example for a governed NL-to-SQL agent using LangGraph's multi-agent patterns with query validation and audit logging.

**Area:** `docs/docs/how-tos/` directory in the LangGraph documentation

**Why it fits Doeon:**
- `Nexus-Hive` is a multi-agent BI copilot with NL-to-SQL, policy checks, and audit trails built with similar patterns
- LangGraph's documentation has a `how-tos` section that accepts community examples
- The docs currently lack examples combining SQL generation with governance/validation steps

**Issue/Gap:** LangGraph has extensive how-to guides for basic patterns but limited coverage of governed agent workflows where intermediate steps require policy validation before proceeding. This is a common enterprise need.

**Estimated time:** 1.5 hours

**Detailed plan:** [langgraph-contribution.md](./langgraph-contribution.md)

---

## Contribution 3: delta-io/delta (Delta Lake)

**What:** Improve the Delta Lake Python documentation by adding a practical merge/upsert example with SCD Type 2 patterns and quality gate validation -- patterns used in `lakehouse-contract-lab`.

**Area:** `python/` documentation or `examples/python/` directory

**Why it fits Doeon:**
- `lakehouse-contract-lab` implements Spark + Delta Lake medallion pipelines with contract-first quality gates
- Doeon holds Databricks Platform Architect certifications (both AWS and GCP)
- Delta Lake's Python examples are sparser than the Scala examples, and merge patterns with quality validation are underrepresented

**Issue/Gap:** Delta Lake's `delta-rs` (Python-native Delta Lake) has grown rapidly, but the examples and documentation for advanced merge patterns (especially SCD Type 2 with validation) lag behind the Scala/Spark API. The `examples/python/` directory accepts community contributions.

**Estimated time:** 1 hour

**Detailed plan:** [delta-lake-contribution.md](./delta-lake-contribution.md)

---

## General Fork-Branch-PR Workflow

All three contributions follow the same process:

### Step 1: Fork the repository
```bash
# Example for vercel/ai
gh repo fork vercel/ai --clone
cd ai
```

### Step 2: Create a feature branch
```bash
git checkout -b docs/tool-calling-middleware-example
```

### Step 3: Implement the contribution
Follow the specific instructions in each contribution file.

### Step 4: Commit with a clear message
```bash
git add .
git commit -m "docs: add tool-calling middleware cookbook example

Demonstrates error-recovery middleware pattern for structured tool
output with bounded retry and fallback parsing."
```

### Step 5: Push and create a PR
```bash
git push origin docs/tool-calling-middleware-example
gh pr create --title "docs: add tool-calling middleware cookbook example" \
  --body "$(cat pr-description.md)"
```

### Step 6: Follow up
- Respond to review comments within 24 hours
- Be willing to adjust scope based on maintainer feedback
- Reference your own project as context but do not self-promote

---

## Pre-Submission Checklist

Before submitting any PR:

- [ ] Read the repository's CONTRIBUTING.md thoroughly
- [ ] Run any existing tests/linters locally
- [ ] Verify the contribution builds/renders correctly
- [ ] Keep the PR small and focused on one thing
- [ ] Write a clear PR description explaining the "why"
- [ ] Be respectful of maintainer time -- small, well-tested PRs merge faster
