# Implementation Plan: Model Age Column

**Branch**: `003-model-age` | **Date**: 2026-02-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-model-age/spec.md`

## Summary

Add an "Age" column to the model table in all views (single-version,
version-range, dropped-models). The column shows the number of complete
years elapsed since each model's release date, formatted as "{N} yr".
This is a display-only computation — no data files are modified and
the JSON download output is unchanged.

## Technical Context

**Language/Version**: HTML/CSS/JavaScript (vanilla, no framework)
**Primary Dependencies**: None (zero external dependencies)
**Storage**: Existing static JSON files in `data/` (unchanged)
**Testing**: Manual validation
**Target Platform**: Web (any modern browser) + static file serving
**Project Type**: Single static site (extends existing site)
**Performance Goals**: No impact (trivial per-row computation)
**Constraints**: Zero server-side processing; GitHub Pages hosting
**Scale/Scope**: Changes to 1 file: `app.js`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1
design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Data Simplicity | PASS | No data file changes. Age is computed at render time. |
| II. Minimal Transformation | PASS | Single helper function, no scripts. |
| III. Upstream Fidelity | PASS | No changes to data or fetch layer. |
| IV. Browse & Download | PASS | Column enhances browsing. Download unchanged (FR-004). |
| Mission: Trustworthy | PASS | Age derived from existing verified release dates. |
| Mission: Browsable | PASS | Age column improves at-a-glance browsing. |
| Mission: Understandable | PASS | "{N} yr" format is self-explanatory. |
| Mission: Programmable | PASS | JSON data files unchanged. |
| Mission: Maintainable | PASS | No new maintenance burden. |

**Gate result**: ALL PASS. No violations. Complexity Tracking table
not needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-model-age/
├── spec.md
├── plan.md              # This file
├── quickstart.md        # Test scenarios
└── tasks.md             # Task breakdown (via /speckit.tasks)
```

### Source Code Changes (repository root)

```text
app.js                   # Add modelAge() helper + Age column in renderModels()
```

**Structure Decision**: No new files. This feature modifies 1 existing
file at the repository root. No research.md, data-model.md, or
contracts/ needed since no new data, dependencies, or APIs are involved.

## Key Design Decisions

### Age = Floor of Complete Years

Compute the difference between the current date and the release date
(parsed as YYYY-MM → 1st of that month). Use floor to get complete
years. A model released in 2025-09 viewed on 2026-02-01 shows "0 yr".

### Display Format: "{N} yr"

Compact, unambiguous. Avoids pluralization complexity ("year" vs
"years") while remaining readable.

### Render-Time Computation

Age is computed in the `renderModels()` function each time the table
is built. No caching needed — the computation is trivial (a few
date operations per row).

### No Impact on JSON Download

Per FR-004, the age is display-only. The download continues to export
the original data fields without an age property.

## Complexity Tracking

> No violations — table not needed.
