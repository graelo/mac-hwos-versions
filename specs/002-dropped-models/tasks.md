# Tasks: Dropped Models View & Product-Line Summary

**Input**: Design documents from `/specs/002-dropped-models/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md
**Tests**: Not explicitly requested. Manual validation via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: User Story 2 — Product-Line Summary (Priority: P2, but prerequisite for US1 display)

**Goal**: Add a product-line summary bar above the model table in ALL views (single-version, version-range, and dropped-models).

**Rationale for ordering**: The summary bar applies to all views including the new dropped-models view. Implementing it first means the dropped-models mode gets the summary automatically.

**Independent Test**: Load the site in single-version mode, verify a summary line (e.g., "16 MacBook Pro, 8 MacBook Air, ...") appears above the table and counts match table rows.

### Implementation for User Story 2

- [ ] T001 [US2] Implement `renderSummary(models)` function in `app.js`: count models per `product_line`, omit zero-count lines, output a compact line like "16 MacBook Pro, 8 MacBook Air, 5 iMac — 52 models total". Return an HTML string or DOM element.
- [ ] T002 [US2] Call `renderSummary(models)` from within `renderModels(models)` in `app.js`: insert the summary bar before the product-line groups. When models array is empty, do not render a summary bar.
- [ ] T003 [US2] Add CSS styling for the summary bar in `style.css`: `.summary-bar` with appropriate spacing, font size, color, and a subtle background or border to visually separate it from the table below. Ensure it looks clean on both desktop and mobile viewports.

**Checkpoint**: The summary bar appears above the table in single-version and version-range modes. Counts match table rows. No summary shown for empty results.

---

## Phase 2: User Story 1 — Dropped Models View (Priority: P1)

**Goal**: Add a "Dropped Models" mode where a visitor selects an old and new minimum macOS version and sees which models are dropped (set difference: old minus new).

**Independent Test**: Select "Dropped Models" mode, pick macOS Big Sur as old minimum and macOS Monterey as new minimum, verify displayed models match the set difference of the two per-version JSON files.

### Implementation for User Story 1

- [ ] T004 [US1] Add a third mode button "Dropped Models" to the mode toggle in `index.html`: extend the `.mode-toggle` div to include `<button id="mode-dropped" class="mode-btn">Dropped Models</button>`.
- [ ] T005 [US1] Add dropped-models controls in `index.html`: a new `<div id="dropped-controls" class="selector-group hidden">` with a `.range-pair` layout containing two selects — `<select id="dropped-old">` labeled "Old Minimum" and `<select id="dropped-new">` labeled "New Minimum".
- [ ] T006 [US1] Update `setMode(mode)` in `app.js` to support a third mode `"dropped"`: toggle visibility of `#dropped-controls` alongside existing single/range controls, update active state on all three mode buttons, and trigger the dropped-models load when entering dropped mode.
- [ ] T007 [US1] Wire DOM references and event listeners in `app.js` for the new elements: `modeDroppedBtn`, `droppedControls`, `droppedOld`, `droppedNew`. Add click listener on `modeDroppedBtn` to call `setMode("dropped")`. Add change listeners on both selects.
- [ ] T008 [US1] Implement constrained "New Minimum" selector in `app.js`: when the `#dropped-old` select changes, repopulate `#dropped-new` with only versions whose index is strictly greater than the selected old minimum index. Preserve selection if still valid, otherwise default to the first available option.
- [ ] T009 [US1] Implement `loadDroppedModels(oldIdx, newIdx)` in `app.js`: fetch both per-version JSON files, compute the set difference (models in old but not in new) by `model_identifier`, sort the result by `product_line` then `release_date`, store in `currentModels`, and call `renderModels()`.
- [ ] T010 [US1] Update the empty-state message in `renderModels()` in `app.js`: when in dropped mode and no models are found, show "No models dropped." instead of "No compatible models found."
- [ ] T011 [US1] Update `onDownload()` in `app.js` for dropped mode: generate filename as `{old_version}-to-{new_version}-dropped-models.json` and download only the dropped models.

**Checkpoint**: The "Dropped Models" button works, both selectors appear, new minimum is constrained to versions after old minimum. Selecting Big Sur → Monterey shows dropped models. "No models dropped." appears when appropriate. Download works.

---

## Phase 3: Polish & Validation

**Purpose**: Final styling and end-to-end validation across all modes.

- [ ] T012 Verify the summary bar displays correctly in dropped-models mode in addition to single-version and range modes. The summary should reflect the dropped models count (e.g., "3 MacBook Pro, 2 iMac — 5 models total").
- [ ] T013 Run quickstart.md scenarios 1–5 as a final validation pass: (1) Big Sur → Monterey dropped models, (2) Sequoia → Tahoe no models dropped, (3) El Capitan → Tahoe large jump, (4) single-version summary counts, (5) constrained new-minimum selector.

**Checkpoint**: All 5 quickstart scenarios pass. Summary bar works in all 3 modes. Download works in all modes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US2 — Summary)**: No dependencies on other phases — modifies `app.js` and `style.css` only
- **Phase 2 (US1 — Dropped Models)**: Depends on Phase 1 completion (summary bar should exist so dropped-models mode inherits it). Modifies `index.html`, `app.js`
- **Phase 3 (Polish)**: Depends on Phase 1 and Phase 2

### Parallel Opportunities

- T001 and T003 can run in parallel (different files: app.js vs style.css)
- Within Phase 2, T004 and T005 can run in parallel (both in index.html but different sections — though sequential is safer for a single file)
- T012 and T013 are sequential (validate then run scenarios)

### Execution Order

1. T001, T003 (parallel) → T002 → **Phase 1 checkpoint**
2. T004, T005 → T006, T007 → T008 → T009 → T010, T011 → **Phase 2 checkpoint**
3. T012 → T013 → **Phase 3 checkpoint**
