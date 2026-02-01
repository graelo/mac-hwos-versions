# Implementation Plan: Mac Hardware / macOS Compatibility Reference

**Branch**: `001-mac-compat-reference` | **Date**: 2026-02-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mac-compat-reference/spec.md`

## Summary

Build a static reference website showing which Mac hardware is
compatible with each macOS version (10.11 El Capitan through 26
Tahoe). Data is stored as per-version JSON files served via GitHub
Pages. The site provides a browsable UI with version selection,
range filtering, and JSON download, plus direct JSON file URLs for
programmatic access. Data is extracted from Apple support pages using
an LLM-assisted workflow.

## Technical Context

**Language/Version**: HTML/CSS/JavaScript (vanilla, no framework)
**Primary Dependencies**: None (zero external dependencies)
**Storage**: Static JSON files in `data/` directory
**Testing**: Manual validation + JSON schema checks via jq/scripts
**Target Platform**: Web (any modern browser) + static file serving
**Project Type**: Single static site
**Performance Goals**: Full page load <2s; all data <500 KB total
**Constraints**: Zero server-side processing; GitHub Pages hosting
**Scale/Scope**: ~16 macOS versions, ~150–250 unique model
identifiers, <500 KB total JSON data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1
design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Data Simplicity | PASS | All data stored as plain JSON files in `data/`. Flat schemas, max 2 levels of nesting. |
| II. Minimal Transformation | PASS | No transformation pipeline. Data is extracted by LLM + maintainer, saved directly as JSON. |
| III. Upstream Fidelity | PASS | Each per-version file records the source Apple URL. Extraction is a distinct manual step. |
| IV. Browse & Download | PASS | Static HTML/JS site on GitHub Pages. JSON files accessible via direct URLs. No auth required. |
| Mission: Trustworthy | PASS | Data sourced from official Apple pages. Source URLs recorded per entry. |
| Mission: Browsable | PASS | UI allows version selection and range filtering. |
| Mission: Understandable | PASS | JSON schema is flat and self-explanatory. |
| Mission: Programmable | PASS | Direct JSON file URLs, no JS needed. |
| Mission: Maintainable | PASS | Adding a version = adding one JSON file + one index entry. |

**Gate result**: ALL PASS. No violations. Complexity Tracking table
not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-mac-compat-reference/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0: data source research
├── data-model.md        # Phase 1: JSON schema definitions
├── quickstart.md        # Phase 1: integration test scenarios
├── contracts/
│   └── static-file-api.md  # Phase 1: static file URL contract
└── tasks.md             # Phase 2: task breakdown (via /speckit.tasks)
```

### Source Code (repository root)

```text
data/
├── index.json                  # Version index (entry point)
├── macos-10.11-el-capitan.json # Per-version compatibility data
├── macos-10.12-sierra.json
├── macos-10.13-high-sierra.json
├── macos-10.14-mojave.json
├── macos-10.15-catalina.json
├── macos-11-big-sur.json
├── macos-12-monterey.json
├── macos-13-ventura.json
├── macos-14-sonoma.json
├── macos-15-sequoia.json
└── macos-26-tahoe.json

site/
├── index.html                  # Single-page static site
├── style.css                   # Styling
└── app.js                      # Client-side logic (vanilla JS)

docs/
└── extraction-guide.md         # LLM prompt + workflow for data updates
```

**Structure Decision**: Single static site. No build step. The
`data/` directory contains the authoritative JSON files. The `site/`
directory contains the HTML/CSS/JS for the browsing UI. Both are
served directly by GitHub Pages from the repository root.

## Key Design Decisions

### Data File Naming Convention

Per-version files use the pattern:
`macos-{version_number}-{lowercase-name}.json`

Examples:
- `macos-10.11-el-capitan.json`
- `macos-15-sequoia.json`
- `macos-26-tahoe.json`

### Cross-Version Model Linking

Model identifier (e.g., `MacBookPro17,1`) is the join key across
files. The UI loads multiple per-version files and intersects by
`model_identifier` to compute range compatibility.

### No Build Step

The site is pure HTML/CSS/JS. GitHub Pages serves the files as-is.
No static site generator, no bundler, no package.json.

### Data Extraction Workflow

1. Maintainer identifies new Apple support page URL.
2. Maintainer uses documented LLM prompt to extract structured data.
3. Maintainer cross-references "Identify your Mac" pages for model
   identifiers.
4. Maintainer saves JSON file, updates index.json, commits and
   pushes.

### Apple Source Pages

Two types of Apple pages are used (see research.md for full URL
inventory):

- **Compatibility pages**: one per macOS version, list compatible
  models by product line using short names.
- **"Identify your Mac" pages**: one per product line, provide model
  identifiers, part numbers, and newest compatible OS.

## Complexity Tracking

> No violations — table not needed.
