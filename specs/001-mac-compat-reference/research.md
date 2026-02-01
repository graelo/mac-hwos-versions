# Research: Mac Hardware / macOS Compatibility Reference

**Branch**: `001-mac-compat-reference` | **Date**: 2026-02-01

## R0: Complete Apple Source URL Inventory

### macOS Compatibility Pages (one per OS version)

| macOS Version | Version # | URL |
|---------------|-----------|-----|
| OS X El Capitan | 10.11 | https://support.apple.com/en-us/111989 |
| macOS Sierra | 10.12 | https://support.apple.com/en-us/111988 |
| macOS High Sierra | 10.13 | https://support.apple.com/en-us/111934 |
| macOS Mojave | 10.14 | https://support.apple.com/en-us/111930 |
| macOS Catalina | 10.15 | https://support.apple.com/en-us/118458 |
| macOS Big Sur | 11 | https://support.apple.com/en-us/111980 |
| macOS Monterey | 12 | https://support.apple.com/en-us/102861 |
| macOS Ventura | 13 | https://support.apple.com/en-us/102861 |
| macOS Sonoma | 14 | https://support.apple.com/en-us/105113 |
| macOS Sequoia | 15 | https://support.apple.com/en-us/120282 |
| macOS Tahoe | 26 | https://support.apple.com/en-us/122867 |

Note: Monterey and Ventura share the same article ID (102861) on
Apple's site — this may be a locale/redirect issue; the actual pages
are distinct. The correct Monterey URL may need verification during
data extraction.

### "Identify Your Mac" Pages (one per product line)

| Product Line | URL |
|-------------|-----|
| MacBook Pro | https://support.apple.com/en-us/108052 |
| MacBook Air | https://support.apple.com/en-us/102869 |
| MacBook | https://support.apple.com/en-us/103257 |
| iMac | https://support.apple.com/en-us/108054 |
| Mac mini | https://support.apple.com/en-us/102852 |
| Mac Pro | https://support.apple.com/en-us/102887 |
| Mac Studio | https://support.apple.com/en-us/102231 |

These pages provide model identifiers (e.g., `MacBookPro17,1`),
part numbers, newest compatible OS, and colors for each model.

## R1: Apple Data Sources

### Decision
Two types of Apple support pages serve as data sources:

1. **Compatibility pages** (one per macOS version): list compatible
   models by product line using short names only.
   - Example: https://support.apple.com/en-us/120282 (macOS Sequoia)
   - Format: `"MacBook Pro (13-inch, M1, 2020)"`
   - No model identifiers, no part numbers, no release dates.

2. **"Identify your Mac" pages** (one per product line): map short
   names to model identifiers, part numbers, colors, and newest
   compatible OS.
   - Example: https://support.apple.com/en-us/108052 (MacBook Pro)
   - Fields per model: short name, model identifier (e.g.,
     `MacBookPro17,1`), part numbers, newest compatible OS, colors.

### Rationale
Combining both page types gives us all fields required by the spec:
short name + model identifier + compatible OS versions + product
line. Release dates are not on either page type — they must be
sourced separately (see R3).

### Alternatives Considered
- **Only compatibility pages**: insufficient — no model identifiers.
- **Only "Identify your Mac" pages**: insufficient — they list the
  newest compatible OS, not all compatible versions.
- **Programmatic Apple API**: none exists publicly.

## R2: Model Identifier Mapping

### Decision
Model identifiers (e.g., `MacBookPro17,1`, `Mac15,6`) are obtained
from the "Identify your Mac" pages. One user-facing model name can
map to multiple identifiers (e.g., "MacBook Pro (14-inch, Nov 2023)"
→ `Mac15,6`, `Mac15,8`, `Mac15,10`).

Per the spec clarification, each JSON entry represents one model
identifier. The short name is a display label that groups related
identifiers in the UI.

### Rationale
Model identifiers are the only stable, unique, machine-friendly keys
Apple provides. Short names can vary slightly across pages.

### Alternatives Considered
- Using normalized short name strings as keys: fragile, not
  guaranteed unique across configurations.

## R3: Release Dates

### Decision
Apple support pages do not include hardware release dates. Release
dates must be sourced during data extraction (from the LLM's
training data, Wikipedia, or EveryMac-style references) and recorded
in the JSON data. Exact day is not critical — month and year
suffice (e.g., `"2020-11"`).

### Rationale
The spec requires release dates for each model. Since Apple's
support pages omit them, this is part of the LLM extraction prompt
or a manual enrichment step.

### Alternatives Considered
- Omitting release dates: rejected — spec requires them.
- Scraping third-party sites: adds a fragile dependency.

## R4: Static Site Technology

### Decision
Use a single-page static site built with plain HTML, CSS, and
vanilla JavaScript. No framework (React, Vue, etc.). The site loads
`data/index.json` on startup, then fetches individual per-version
JSON files as needed.

### Rationale
- Constitution requires zero runtime infrastructure and minimal
  dependencies.
- The UI is a single view with a version selector, a table, and a
  download button — no routing, no state management, no build step.
- Vanilla JS keeps the project dependency-free and deployable as-is
  to GitHub Pages.
- The dataset is small (~16 versions × ~50 models each) — no
  performance concerns loading JSON client-side.

### Alternatives Considered
- **React/Vue SPA**: rejected — unnecessary complexity for a single
  table view, adds build step and dependency chain.
- **Static site generator (Hugo, Jekyll)**: rejected — the data is
  JSON, not markdown; a generator adds no value here.
- **Server-side rendering**: rejected — violates constitution.

## R5: GitHub Pages Deployment

### Decision
Deploy the `site/` directory (or repo root) to GitHub Pages. JSON
data files live under `data/` and are served as static files. The
site is a single `index.html` file plus CSS/JS.

### Rationale
GitHub Pages serves static files directly with CORS headers that
allow programmatic `fetch()` from other origins. No build step
needed — just push and it's live.

### Alternatives Considered
- **GitHub Actions build step**: unnecessary unless we add a
  framework later.
- **Netlify/Vercel**: viable but adds a dependency on a third-party
  service for no benefit.

## R6: Data Extraction Workflow

### Decision
Maintainers extract data by pointing an LLM at an Apple support page
and providing a prompt that specifies the JSON schema. The LLM
outputs structured JSON that the maintainer validates and commits.

For model identifiers, the maintainer cross-references the "Identify
your Mac" pages for the relevant product lines.

A reference prompt and expected output format will be documented in
the repository.

### Rationale
- Constitution's Principle II (Minimal Transformation) favors
  avoiding complex scraping infrastructure.
- LLM extraction is accurate for structured tables and can be
  verified by the maintainer.
- The low update frequency (1-2 times/year) makes this sustainable.

### Alternatives Considered
- **Web scraper**: fragile, breaks when Apple changes page structure.
- **Fully manual data entry**: error-prone for large model lists.
- **Apple API**: does not exist publicly.
