# Tasks: Mac Hardware / macOS Compatibility Reference

**Input**: Design documents from `/specs/001-mac-compat-reference/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project directory structure and initial configuration

- [x] T001 Create directory structure: `data/`, `docs/` at repository root
- [x] T002 [P] Create `data/index.json` with all 11 macOS versions (10.11 El Capitan through 26 Tahoe) per the data-model schema. Include version_name, version_number, release_date, source_url, and data_file for each entry. Sorted by version_number ascending. Reference research.md R0 for source URLs.
- [x] T003 [P] Create `index.html` with basic HTML5 structure: page title "Mac Hardware / macOS Compatibility", a `<select>` element for version selection (empty, populated by JS), a results container `<div>`, and script/style tags linking to `app.js` and `style.css`
- [x] T004 [P] Create `style.css` with minimal, clean styling: responsive table layout, product-line grouping headers, architecture badges (Intel/Apple Silicon), and a download button style
- [x] T005 [P] Create `app.js` as an empty module with placeholder functions: `loadIndex()`, `loadVersion(filename)`, `renderModels(models)`, `downloadJSON(data, filename)`. Wire `loadIndex()` to run on `DOMContentLoaded`.

**Checkpoint**: Directory structure exists, index.json is populated, site shell loads in a browser (empty table).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extract and populate the initial dataset from Apple support pages — this data is required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete because the UI has nothing to display without data.

- [x] T006 Write the LLM extraction prompt template and workflow guide in `docs/extraction-guide.md`. Include: (1) reference prompt for extracting models from an Apple compatibility page, (2) reference prompt for cross-referencing "Identify your Mac" pages to get model identifiers, (3) expected JSON output schema matching data-model.md, (4) step-by-step instructions for a maintainer to add a new macOS version.
- [x] T007 Extract data for macOS 15 Sequoia and save as `data/macos-15-sequoia.json`. Use the Apple compatibility page (https://support.apple.com/en-us/120282) for the model list and the "Identify your Mac" pages (research.md R0) for model identifiers. Follow the per-version file schema from data-model.md. This serves as the reference file for validating all other extractions.
- [x] T008 Extract data for macOS 26 Tahoe and save as `data/macos-26-tahoe.json`. Source: https://support.apple.com/en-us/122867 cross-referenced with "Identify your Mac" pages.
- [x] T009 [P] Extract data for macOS 10.11 El Capitan and save as `data/macos-10.11-el-capitan.json`. Source: https://support.apple.com/en-us/111989
- [x] T010 [P] Extract data for macOS 10.12 Sierra and save as `data/macos-10.12-sierra.json`. Source: https://support.apple.com/en-us/111988
- [x] T011 [P] Extract data for macOS 10.13 High Sierra and save as `data/macos-10.13-high-sierra.json`. Source: https://support.apple.com/en-us/111934
- [x] T012 [P] Extract data for macOS 10.14 Mojave and save as `data/macos-10.14-mojave.json`. Source: https://support.apple.com/en-us/111930
- [x] T013 [P] Extract data for macOS 10.15 Catalina and save as `data/macos-10.15-catalina.json`. Source: https://support.apple.com/en-us/118458
- [x] T014 [P] Extract data for macOS 11 Big Sur and save as `data/macos-11-big-sur.json`. Source: https://support.apple.com/en-us/111980
- [x] T015 [P] Extract data for macOS 12 Monterey and save as `data/macos-12-monterey.json`. Source: https://support.apple.com/en-us/102861 (verify correct URL during extraction)
- [x] T016 [P] Extract data for macOS 13 Ventura and save as `data/macos-13-ventura.json`. Source: https://support.apple.com/en-us/102861 (verify correct URL; Monterey/Ventura may share article ID)
- [x] T017 [P] Extract data for macOS 14 Sonoma and save as `data/macos-14-sonoma.json`. Source: https://support.apple.com/en-us/105113
- [x] T018 Validate all 11 per-version JSON files: (1) each file parses as valid JSON, (2) every model entry has all 5 required fields (model_identifier, short_name, product_line, cpu_architecture, release_date), (3) no duplicate model_identifiers within a file, (4) cpu_architecture is exactly "x86-64" or "arm64", (5) models are sorted by product_line then release_date. Use jq or a simple script.
- [x] T019 Cross-validate data consistency: (1) every data_file referenced in index.json exists in `data/`, (2) version metadata in each per-version file matches the corresponding index.json entry, (3) spot-check 5 random models against their Apple source pages for accuracy.

**Checkpoint**: All 11 per-version JSON files plus index.json are populated, validated, and committed. The dataset is complete and ready for the UI.

---

## Phase 3: User Story 1 — Browse Compatibility by macOS Version (Priority: P1) MVP

**Goal**: A visitor selects a macOS version and sees all compatible Mac models grouped by product line.

**Independent Test**: Open the site, select a macOS version from the dropdown, verify the displayed list matches the corresponding per-version JSON file.

### Implementation for User Story 1

- [x] T020 [US1] Implement `loadIndex()` in `app.js`: fetch `data/index.json`, populate the version `<select>` dropdown with version names sorted oldest-to-newest, select the most recent version by default, and trigger `loadVersion()` for the default selection.
- [x] T021 [US1] Implement `loadVersion(filename)` in `app.js`: fetch the per-version JSON file from `data/{filename}`, store the result, and call `renderModels()` with the models array.
- [x] T022 [US1] Implement `renderModels(models)` in `app.js`: group models by `product_line`, render a table with columns: Short Name, Model Identifier, CPU Architecture, Release Date. Show product-line headers as group separators. Display architecture as a visual badge ("Intel" for x86-64, "Apple Silicon" for arm64).
- [x] T023 [US1] Wire the version `<select>` change event in `app.js`: on selection change, call `loadVersion()` with the selected version's `data_file`.
- [x] T024 [US1] Implement `downloadJSON(data, filename)` in `app.js`: serialize the currently displayed models array as JSON, create a Blob, trigger a browser download with filename `{version_name}-compatible-models.json`.
- [x] T025 [US1] Add a "Download as JSON" button in `index.html` and wire it in `app.js` to call `downloadJSON()` with the current single-version model list.
- [x] T026 [US1] Style the results table and download button in `style.css`: responsive table, alternating row colors, sticky header, product-line group headings, architecture badge colors (blue for Intel, green for Apple Silicon), prominent download button.
- [x] T027 [US1] Handle error states in `app.js`: show a clear message if `index.json` fails to load (network error), or if a per-version file is missing/malformed. Do not show a blank page.

**Checkpoint**: The site loads, the dropdown lists all 11 macOS versions, selecting a version displays the correct model table grouped by product line, and the "Download as JSON" button works. User Story 1 is fully functional.

---

## Phase 4: User Story 2 — Filter by macOS Version Range (Priority: P2)

**Goal**: A visitor selects a min and max macOS version and sees models compatible with all versions in that range.

**Independent Test**: Select a range (e.g., Monterey to Sequoia), verify only models appearing in every per-version file within the range are shown.

### Implementation for User Story 2

- [x] T028 [US2] Add min/max version range selectors to `index.html`: two `<select>` dropdowns ("From" and "To") alongside the existing single-version selector. Add a toggle or tab to switch between single-version and range mode.
- [x] T029 [US2] Implement `loadVersionRange(minFile, maxFile)` in `app.js`: determine all version files between min and max (inclusive) using index.json ordering, fetch all per-version files in the range, compute the intersection of model lists by `model_identifier` (models present in ALL versions), and call `renderModels()` with the intersection result. If any individual file in the range fails to load, display an error identifying the failing version rather than silently omitting it or showing a blank result.
- [x] T030 [US2] Wire the range selector change events in `app.js`: when either min or max changes, call `loadVersionRange()`. Validate that min <= max; if not, swap them or show a warning.
- [x] T031 [US2] Update `downloadJSON()` call in `app.js` for range mode: when in range mode, the download file should be named `{min_version}-to-{max_version}-compatible-models.json` and contain only the intersected model list.
- [x] T032 [US2] Handle the edge case in `app.js` where the version range intersection is empty: display a "No compatible models found across all selected versions" message instead of an empty table.
- [x] T033 [US2] Style the range selectors and mode toggle in `style.css`: align the two dropdowns side by side, add visual indication of which mode is active (single vs. range).

**Checkpoint**: The site supports both single-version and range filtering. Range selection shows only models in the intersection. Download works for both modes. Empty results show a clear message.

---

## Phase 5: User Story 3 — Programmatic JSON Access (Priority: P3)

**Goal**: Developers can fetch per-version JSON files directly via stable URLs with no JavaScript required.

**Independent Test**: Use curl to fetch `data/index.json` and a per-version file, verify valid JSON responses.

### Implementation for User Story 3

- [x] T034 [US3] Configure GitHub Pages deployment from the root of the main branch. Since `index.html`, `app.js`, `style.css`, and `data/` all live at the repo root, no path remapping is needed. Verify that `https://<user>.github.io/mac-hwos-versions/` loads the site and `https://<user>.github.io/mac-hwos-versions/data/index.json` returns valid JSON with correct `Content-Type`.
- [x] T035 [US3] Add CORS verification: after deployment, confirm that `fetch()` from a different origin successfully retrieves JSON files. Document the base URL pattern in the project README.
- [x] T036 [US3] Write a `README.md` at the repository root with: project description, link to the live site, programmatic access documentation (base URL, index endpoint, per-version file URL pattern, curl examples from contracts/static-file-api.md), JSON schema summary, and contribution/maintenance instructions.

**Checkpoint**: JSON files are accessible at stable GitHub Pages URLs. curl returns valid JSON. README documents the programmatic API.

---

## Phase 6: User Story 4 — Maintainer Adds a New macOS Version (Priority: P4)

**Goal**: A maintainer can add a new macOS version by adding a JSON file and updating the index, with no code changes required.

**Independent Test**: Add a hypothetical `data/macos-27-test.json` and index entry, reload the site, verify the new version appears.

### Implementation for User Story 4

- [x] T037 [US4] Finalize `docs/extraction-guide.md` (started in T006): add a complete worked example showing the end-to-end workflow of adding a new macOS version, from identifying the Apple support page URL through committing the final JSON file. Include before/after snippets of `index.json`.
- [x] T038 [US4] Create a JSON validation script at `scripts/validate-data.sh` that checks all files in `data/`: (1) every file referenced in index.json exists, (2) every JSON file is valid, (3) required fields are present in every model entry, (4) no duplicate model_identifiers per file, (5) cpu_architecture values are valid. This script is intended for maintainers to run before committing new data.
- [x] T039 [US4] Verify the full maintenance workflow end-to-end: temporarily add a mock `data/macos-99-test.json` file and index entry, reload the site, confirm the new version appears in the dropdown and displays correctly, then remove the test data.

**Checkpoint**: The extraction guide is complete with worked examples. A validation script catches common data errors. The maintenance workflow is verified end-to-end.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T040 [P] Add a site header/footer in `index.html` with: project title, link to GitHub repository, "Data sourced from Apple Support" attribution with links to source pages, and last-updated date.
- [x] T041 [P] Add a favicon and meta tags in `index.html`: `<meta>` description, Open Graph tags for social sharing, and a simple favicon.
- [x] T042 Verify responsive layout in `style.css`: test the site on mobile viewport widths (375px, 768px), ensure the table scrolls horizontally or stacks gracefully, and the version selectors remain usable.
- [x] T043 Run quickstart.md scenarios 1–5 as a final validation pass. Document any discrepancies and fix them.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001 (directory structure) and T002 (index.json). T006 (extraction guide) must come before T007–T017 (data extraction). T007 (Sequoia reference file) should be done first to establish the extraction pattern, then T008–T017 can run in parallel. T018–T019 (validation) depend on all extraction tasks.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (needs data to display)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (extends the existing UI)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (needs data deployed). Can run in parallel with Phase 3/4.
- **User Story 4 (Phase 6)**: Depends on Phase 2 (T006 extraction guide) and Phase 3 (site must be functional to test)
- **Polish (Phase 7)**: Depends on all user stories being complete

### Parallel Opportunities

- All Setup tasks marked [P] (T002–T005) can run in parallel after T001
- All data extraction tasks T009–T017 can run in parallel after T006+T007
- US3 (Phase 5) can proceed in parallel with US1 (Phase 3) once data exists
- All Polish tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Data extraction (all 11 versions)
3. Complete Phase 3: User Story 1 — single version browsing + download
4. **STOP and VALIDATE**: Open the site, select each macOS version, verify correctness
5. Deploy to GitHub Pages

### Incremental Delivery

1. Setup + Data Extraction → Foundation ready
2. Add US1 → Browse single version + download → Deploy (MVP!)
3. Add US2 → Range filtering → Deploy
4. Add US3 → Programmatic access documented + verified → Deploy
5. Add US4 → Maintenance workflow documented → Deploy
6. Polish → Final touches → Deploy
