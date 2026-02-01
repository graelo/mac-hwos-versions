<!--
Sync Impact Report
===================
Version change: 1.0.0 → 1.1.0 (MINOR — new Mission section added)
Modified principles: none
Added sections:
  - Mission (new top-level section before Core Principles)
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed
  - .specify/templates/spec-template.md ✅ no changes needed
  - .specify/templates/tasks-template.md ✅ no changes needed
  - .specify/templates/checklist-template.md ✅ no changes needed
  - .claude/commands/*.md ✅ no changes needed
Follow-up TODOs: none
-->

# mac-hwos-versions Constitution

## Mission

This project is the reference page for which Mac hardware is
supported by each macOS version. Every decision MUST serve these
five goals:

1. **Trustworthy** — Data MUST be accurate, sourced from Apple's
   official lists, and verifiable. Users MUST be able to trust this
   as a definitive reference.
2. **Browsable** — A human visitor MUST be able to look up
   compatibility quickly, without tooling or technical knowledge.
3. **Understandable** — The underlying data structure MUST be
   transparent. Anyone inspecting the JSON files MUST be able to
   understand what they contain without external documentation.
4. **Programmable** — Developers MUST be able to fetch and consume
   the data programmatically (curl, fetch, jq, any HTTP client)
   with no authentication or special setup.
5. **Maintainable** — Updating the data when Apple releases a new
   macOS version or hardware model MUST be a straightforward,
   low-effort operation.

## Core Principles

### I. Data Simplicity

All persistent data MUST be stored as plain JSON files. No databases,
no binary formats, no custom serialization. JSON files serve as both
the storage layer and the interchange format.

- One or more `.json` files at the repository root or in a `data/`
  directory.
- Schemas MUST remain flat and human-readable; avoid deep nesting
  beyond two levels unless the upstream data mandates it.
- Every JSON file MUST be valid, parseable by any standard JSON
  library, and diffable in version control.

**Rationale**: JSON is universally supported, trivially inspectable,
and requires no runtime infrastructure. This keeps the project
dependency-free on the storage side.

### II. Minimal Transformation

Data processing MUST consist of simple, deterministic transformation
jobs that convert upstream data into the project's JSON format.
Transformations MUST be small, single-purpose scripts or functions.

- Each transformation MUST do one thing: fetch, parse, merge, or
  reshape data.
- No orchestration frameworks, workflow engines, or job schedulers.
- Transformations MUST be runnable locally with a single command.
- Intermediate state, if any, MUST also be JSON.

**Rationale**: Simple transformation jobs are easy to debug, test,
and replace. Complex pipelines introduce failure modes that outweigh
the value they provide for this project's scope.

### III. Upstream Fidelity

The project MUST preserve the ability to download and refresh
hardware and OS version lists from Apple's official sources. The
upstream fetch step MUST be clearly separated from any local
transformation or enrichment step.

- Fetching from Apple's hardware lists MUST be a distinct,
  independently runnable operation.
- Raw upstream data SHOULD be cached locally (as JSON) so that
  transformations can be re-run without re-fetching.
- Changes to upstream URLs or formats MUST be handled by updating
  the fetch step only, without cascading changes through the rest
  of the codebase.

**Rationale**: Apple periodically updates its hardware lists. Keeping
the fetch layer isolated ensures the project can adapt to upstream
changes with minimal effort.

### IV. Browse & Download

Users MUST be able to browse the data and download it. The project
MUST expose data in a way that requires no server infrastructure to
consume.

- Data MUST be accessible as static JSON files (servable via GitHub
  Pages, raw GitHub URLs, or a simple static file server).
- No authentication, API keys, or runtime services required to
  access the data.
- If a browsing interface is provided, it MUST be a static site
  (HTML/JS) that reads the JSON files directly.

**Rationale**: The simplest distribution model is static files.
Users can curl, fetch, or open the data in a browser without
standing up any backend.

## Technology Constraints

- **Storage**: JSON files only. No databases.
- **Language**: Determined at plan time per feature; MUST remain
  minimal (prefer scripting languages or Rust for CLI tools).
- **Dependencies**: Minimize external dependencies. Every dependency
  MUST justify its inclusion.
- **Infrastructure**: Zero runtime infrastructure required. The
  project MUST work as a collection of static files plus local
  scripts.
- **Distribution**: Static files (GitHub Pages, raw URLs, or
  equivalent). No hosted APIs.

## Development Workflow

- Features MUST start with a specification before implementation.
- All code changes MUST be reviewed against the mission goals and
  core principles above before merging.
- If a proposed change introduces a database, a server process, or
  a complex pipeline, it MUST be rejected unless the constitution
  is amended first.
- Testing MUST verify that transformation outputs are valid JSON and
  that upstream fetch operations are isolated and mockable.

## Governance

This constitution supersedes all other design documents when
conflicts arise. Amendments require:

1. A documented rationale explaining why the current principles are
   insufficient.
2. An updated constitution with a version bump following semantic
   versioning (MAJOR for principle removals/redefinitions, MINOR for
   additions, PATCH for clarifications).
3. All dependent artifacts (specs, plans, tasks) MUST be reviewed
   for consistency after any amendment.

All pull requests and code reviews MUST verify compliance with the
mission and core principles. Complexity MUST be justified in the
plan's Complexity Tracking table.

**Version**: 1.1.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01
