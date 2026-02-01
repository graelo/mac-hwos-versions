# Feature Specification: Mac Hardware / macOS Compatibility Reference

**Feature Branch**: `001-mac-compat-reference`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "A trustworthy, browsable, programmable reference
for which Mac hardware is supported by each macOS version, backed by JSON data
extracted from official Apple support pages, served as a static GitHub Pages
site."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Compatibility by macOS Version (Priority: P1)

A visitor lands on the site and wants to know which Mac models are
supported by a specific macOS version (e.g., macOS Sequoia). They
select or navigate to that macOS version and see a table of all
compatible Mac models, grouped by product line (MacBook Pro, iMac,
Mac mini, etc.), showing each model's short name (e.g., "MacBook Pro
(Late 2013)"), CPU architecture (Intel or Apple Silicon), and release
date.

**Why this priority**: This is the core value proposition — the
primary reason someone visits the site. Without this, the project
delivers nothing.

**Independent Test**: Can be fully tested by opening the site,
selecting a macOS version, and verifying the displayed list matches
the corresponding Apple support page.

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** a visitor selects "macOS
   Sequoia", **Then** they see all compatible Mac models grouped by
   product line, each showing short name, CPU architecture, and
   release date.
2. **Given** the site is loaded, **When** a visitor selects "macOS
   High Sierra", **Then** they see a longer list of compatible models
   including older Intel-only hardware.
3. **Given** a macOS version is selected, **When** the visitor scans
   the list, **Then** each model clearly indicates whether it uses
   Intel (x86-64) or Apple Silicon (arm64).
4. **Given** a macOS version is selected and results are displayed,
   **When** the visitor clicks "Download as JSON", **Then** they
   receive a JSON file containing the displayed compatible models.

---

### User Story 2 - Filter by macOS Version Range (Priority: P2)

A visitor wants to see which Mac models are supported across a range
of macOS versions (e.g., from macOS Catalina to macOS Sequoia). They
select a start version and an end version, and the site shows only
the models that are supported by all versions in that range, or
alternatively highlights which versions each model supports.

**Why this priority**: Version-range filtering adds significant value
for IT administrators and organizations planning hardware lifecycle
decisions, but the site is still useful without it.

**Independent Test**: Can be tested by selecting a version range and
verifying the filtered results against manual cross-referencing of
individual version pages.

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** a visitor selects a range
   from "macOS Monterey" to "macOS Sequoia", **Then** they see the
   models compatible with all versions in that range.
2. **Given** a version range is selected, **When** the range includes
   only recent versions, **Then** only Apple Silicon and recent Intel
   models appear (older models were dropped).
3. **Given** a version range is selected and filtered results are
   displayed, **When** the visitor clicks "Download as JSON",
   **Then** they receive a JSON file containing only the models
   compatible with all versions in the selected range.

---

### User Story 3 - Programmatic JSON Access (Priority: P3)

A developer wants to fetch compatibility data programmatically. They
request the version index file to discover available macOS versions,
then fetch the per-version JSON file(s) for the version(s) they care
about. No browser or JavaScript runtime is required — standard HTTP
tools (curl, wget, fetch) work directly.

**Why this priority**: Programmatic access extends the audience
beyond casual browsers to automation, scripts, and integrations. The
site is still fully valuable for human users without this, but it
fulfills the "programmable" mission goal.

**Independent Test**: Can be tested by fetching the index file and
individual version files with curl and validating the JSON response
structure and content.

**Acceptance Scenarios**:

1. **Given** the data is deployed, **When** a developer fetches
   `/data/index.json`, **Then** they receive a JSON listing of all
   available macOS versions with their file paths.
2. **Given** the data is deployed, **When** a developer fetches
   `/data/macos-15-sequoia.json`, **Then** they receive valid JSON
   containing all models compatible with macOS Sequoia.
3. **Given** the data is deployed, **When** a developer fetches
   multiple per-version files and intersects the model lists
   client-side, **Then** they can determine which models are
   compatible across a version range.

---

### User Story 4 - Maintainer Adds a New macOS Version (Priority: P4)

When Apple releases a new macOS version with a corresponding support
page, a project maintainer extracts the compatibility data from that
page (using an LLM or manually), adds it as JSON following the
established data model, and the site automatically reflects the new
version after the data is committed and deployed.

**Why this priority**: This is an operational workflow, not a
user-facing feature. The site works with the initial dataset; this
story ensures it stays up-to-date over time.

**Independent Test**: Can be tested by adding a new JSON entry for a
hypothetical macOS version and verifying it appears on the deployed
site.

**Acceptance Scenarios**:

1. **Given** Apple publishes a new support page for "macOS 16",
   **When** a maintainer extracts the data and adds it to the JSON
   file(s), **Then** the site displays the new version in the
   version selector and shows its compatible models.
2. **Given** a maintainer uses an LLM to extract data from a new
   Apple support page, **When** they format it according to the data
   model and commit it, **Then** no transformation scripts need to
   run — the site serves the new data directly.

---

### Edge Cases

- What happens when a Mac model appears under different short names
  across macOS version pages? The Apple model identifier (e.g.,
  `MacBookPro17,1`) is the stable key; display short names may
  vary but the identifier ensures consistent cross-version linking.
- What happens when Apple changes the URL or structure of an existing
  support page? The cached JSON data remains valid; only future
  re-extraction would be affected.
- What happens when a visitor selects a version range where no models
  overlap? The UI MUST display a clear "no compatible models found"
  message rather than an empty or broken view.
- What happens when the JSON data file is malformed or missing? The
  UI MUST show a clear error state rather than a blank page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display, for each macOS version, the
  complete list of compatible Mac models as published on the
  corresponding Apple support page.
- **FR-002**: Each Mac model entry MUST include: Apple model
  identifier (e.g., `MacBookPro17,1`) as primary key, short name
  (e.g., "MacBook Pro (Mid 2012)") as display label, CPU
  architecture (x86-64 or arm64), product line (e.g., MacBook Pro,
  iMac, Mac mini), and release date.
- **FR-003**: Each macOS version entry MUST include: version name
  (e.g., "macOS Sequoia"), version number (e.g., "15"), release
  date, and the source Apple support page URL.
- **FR-004**: The site MUST allow users to select a single macOS
  version and view all compatible models.
- **FR-005**: The site MUST allow users to select a range of macOS
  versions (min and max) and view models compatible with all
  versions in that range.
- **FR-006**: The site MUST serve each per-version JSON file and the
  version index file at stable, documented URLs (e.g.,
  `/data/index.json`, `/data/macos-15-sequoia.json`).
- **FR-007**: The browsing UI MAY support URL query parameters for
  filtering convenience, but the primary programmatic interface
  MUST be the direct JSON file URLs which require no JavaScript.
- **FR-008**: All data MUST be stored as static JSON files in the
  repository, organized as one file per macOS version (e.g.,
  `macos-15-sequoia.json`) plus an index file that lists all
  available versions. No server-side processing required.
- **FR-009**: The site MUST be deployable as a static GitHub Pages
  site with no build step beyond what GitHub Pages provides
  natively (or a simple static site generator).
- **FR-010**: Adding a new macOS version MUST require only adding or
  updating JSON data files and committing to the repository.
- **FR-011**: The data extraction process from Apple support pages
  MUST be documented, including a reference LLM prompt and the
  expected JSON output format.
- **FR-012**: The UI MUST provide a "Download as JSON" action that
  exports the currently displayed result (whether a single macOS
  version view or a filtered version range) as a downloadable JSON
  file.

### Key Entities

- **MacModel**: Represents a specific Mac hardware configuration at
  the model-identifier level (e.g., `MacBookPro17,1`). Attributes:
  model identifier (primary key), short name (display label —
  multiple identifiers may share the same short name), product
  line, CPU architecture (x86-64 or arm64), release date. The UI
  groups entries by short name for display. The model identifier
  enables cross-version linking.
- **MacOSVersion**: Represents a macOS release. Attributes: version
  name, major version number, release date, source Apple support
  page URL. A MacOSVersion has a list of compatible MacModels.
- **CompatibilityEntry**: The association between a MacModel and a
  MacOSVersion, indicating that the model is officially supported
  by that macOS release. Stored within each per-version JSON file
  as the list of compatible models for that version.
- **VersionIndex**: An index file listing all available macOS
  versions with their file paths, version numbers, and names.
  Acts as the entry point for both the UI and programmatic access.

## Clarifications

### Session 2026-02-01

- Q: How should JSON files be organized on disk? → A: One JSON file per macOS version (e.g., `macos-15-sequoia.json`), plus an index file listing all versions.
- Q: How should programmatic access work on a static site? → A: Primary API is direct JSON file URLs (e.g., `/data/macos-15-sequoia.json`). The UI uses client-side JS for filtering; query-parameter URLs are a UI convenience only, not the programmatic contract.
- Q: Should each macOS version include its release date? → A: Yes. Each macOS version entry includes its release date.
- Q: How to identify a model across macOS version files? → A: Use Apple model identifier (e.g., `MacBookPro17,1`) as primary key; short name is a display label.
- Q: Granularity — one entry per model identifier or per user-facing name? → A: One entry per model identifier. UI groups by short name for display.
- Q: What does "download as JSON" export? → A: The currently displayed result (single version or filtered range), not the full dataset.

## Assumptions

- Apple support pages are the single source of truth for hardware
  compatibility data. The project does not independently verify
  hardware compatibility.
- Model short names follow Apple's published naming convention
  (e.g., "MacBook Pro (13-inch, 2020, Two Thunderbolt 3 ports)").
  If Apple uses slightly different names across pages, a canonical
  name is chosen and documented.
- CPU architecture is determined by the model's processor: all Apple
  Silicon Macs are arm64, all Intel Macs are x86-64. No models
  support both architectures.
- The initial dataset covers macOS 10.11 (El Capitan) through
  macOS 26 (Tahoe), and all Mac models released in the
  corresponding ~16 year span.
- Release dates for models refer to the original hardware release
  date, not the date a macOS version was released.
- The maintenance cadence (1-2 new macOS versions per year, a few
  new hardware models per year) makes manual data entry viable
  without automation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can look up compatible hardware for any
  covered macOS version within 10 seconds of landing on the site.
- **SC-002**: 100% of compatibility entries match the corresponding
  official Apple support page at time of data entry.
- **SC-003**: A developer can fetch per-version JSON data via a
  direct HTTP GET to a stable file URL (no query parameters or JS
  required), receiving a valid JSON response.
- **SC-004**: Adding a new macOS version to the dataset requires
  editing only JSON data files — no code changes.
- **SC-005**: The site loads and renders fully from static files
  with no server-side processing.
- **SC-006**: The full dataset is available as a single downloadable
  JSON file at a stable, documented URL.
