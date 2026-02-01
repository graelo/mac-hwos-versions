# Implementation Plan: Dropped Models View & Product-Line Summary

**Branch**: `002-dropped-models` | **Date**: 2026-02-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-dropped-models/spec.md`

## Summary

Add a "Dropped Models" mode to the existing static site and a
product-line summary bar to all views. The dropped-models mode lets a
visitor pick two macOS versions ("old minimum" and "new minimum") and
see which Mac models are lost — the set difference of the two
per-version JSON files. The product-line summary shows model counts
per product line (e.g., "16 MacBook Pro, 8 MacBook Air, ...") above
the table in every mode. No new data files, no build step, no new
dependencies.

## Technical Context

**Language/Version**: HTML/CSS/JavaScript (vanilla, no framework)
**Primary Dependencies**: None (zero external dependencies)
**Storage**: Existing static JSON files in `data/` (unchanged)
**Testing**: Manual validation
**Target Platform**: Web (any modern browser) + static file serving
**Project Type**: Single static site (extends existing site)
**Performance Goals**: Results render <1s after selection
**Constraints**: Zero server-side processing; GitHub Pages hosting
**Scale/Scope**: Changes to 3 files: `index.html`, `app.js`,
`style.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1
design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Data Simplicity | PASS | No new data files. Reads existing JSON. |
| II. Minimal Transformation | PASS | Set difference computed client-side in a few lines. No scripts. |
| III. Upstream Fidelity | PASS | No changes to data or fetch layer. |
| IV. Browse & Download | PASS | New view is browsable; download works for dropped models. |
| Mission: Trustworthy | PASS | Same data, different view. |
| Mission: Browsable | PASS | New mode adds browsing capability. |
| Mission: Understandable | PASS | No new data format to understand. |
| Mission: Programmable | PASS | JSON download available; underlying files unchanged. |
| Mission: Maintainable | PASS | No new maintenance burden. |

**Gate result**: ALL PASS. No violations. Complexity Tracking table
not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-dropped-models/
├── spec.md
├── plan.md              # This file
├── quickstart.md        # Test scenarios
└── tasks.md             # Task breakdown (via /speckit.tasks)
```

### Source Code Changes (repository root)

```text
index.html               # Add "Dropped Models" mode button + controls
app.js                   # Add dropped-models logic + summary rendering
style.css                # Add summary bar styling
```

**Structure Decision**: No new files. This feature modifies 3 existing
files at the repository root. No research.md or data-model.md needed
since no new data or external dependencies are involved.

## Key Design Decisions

### Dropped Models = Set Difference

Load two per-version JSON files (old and new minimum), compute
`old.models - new.models` by `model_identifier`, display the result.
This reuses the existing `loadVersion` fetch logic.

### Constrained "New Minimum" Selector

When the visitor picks the "old minimum" version, the "new minimum"
dropdown is repopulated to show only versions newer than the selected
old minimum. This enforces ascending order without needing validation
messages for reversed selections.

### Product-Line Summary in renderModels

A `renderSummary(models)` function is called before the table
rendering. It counts models per `product_line`, omits zero-count
lines, and outputs a compact line like "16 MacBook Pro, 8 MacBook
Air, 5 iMac — 52 models total".

### Third Mode Button

The mode toggle expands from 2 buttons (Single Version, Version Range)
to 3 (Single Version, Version Range, Dropped Models). The dropped-
models controls reuse the range-pair layout but with labels "Old
Minimum" and "New Minimum".

### Empty State Messages

Each mode gets a contextual empty-state message:
- Single/Range: "No compatible models found."
- Dropped Models: "No models dropped."

## Complexity Tracking

> No violations — table not needed.
