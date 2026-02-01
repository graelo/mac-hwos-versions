# Tasks: Dropped Models View & Product-Line Summary

**Input**: Design documents from `/specs/002-dropped-models/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Tests**: Not explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: User Story 2 — Product-Line Summary Counts (Priority: P2)

**Goal**: Add a product-line summary bar above the model table in ALL views (single-version, version-range, and the upcoming dropped-models view). The summary shows the count of models per product line and a total count.

**Rationale for phase ordering**: Although P2 priority, the summary bar applies to all views site-wide (FR-004). Implementing it first means the dropped-models mode (Phase 2) automatically inherits it without backfilling.

**Independent Test**: Open the site in single-version mode, select "macOS Sequoia". Verify a summary bar appears above the table (e.g., "16 MacBook Pro, 8 MacBook Air, 8 iMac, 1 iMac Pro, 4 Mac mini, 2 Mac Pro, 3 Mac Studio — 63 models total"). Verify counts match the number of rows in each product-line group. Switch to version-range mode and verify the summary updates. Select an empty range and verify no summary appears.

### Implementation for User Story 2

- [x] T001 [US2] Implement `renderSummary(models)` function in `app.js`: count models per `product_line`, omit product lines with zero models (FR-005), and return a DOM element with a compact summary line like "16 MacBook Pro, 8 MacBook Air, 5 iMac — 52 models total" (FR-004). When the models array is empty, return `null` (no summary for empty results).
- [x] T002 [US2] Call `renderSummary(models)` from within `renderModels(models)` in `app.js`: insert the summary bar element before the first product-line group. If `renderSummary()` returns `null`, skip insertion.
- [x] T003 [P] [US2] Add CSS styling for the summary bar in `style.css`: create `.summary-bar` class with appropriate spacing, font size, color, and a subtle bottom border to visually separate it from the table groups below. Ensure it renders cleanly at both desktop and mobile (375px) viewports.

**Checkpoint**: Summary bar appears above the table in single-version and version-range modes. Counts match table rows. Zero-count product lines are omitted. No summary shown for empty results. (Validates quickstart.md Scenario 4.)

---

## Phase 2: User Story 1 — View Dropped Models Between Two macOS Versions (Priority: P1)

**Goal**: Add a "Dropped Models" mode where a visitor selects an "old minimum" and a "new minimum" macOS version and sees which Mac models are dropped — the set of models compatible with the old minimum but NOT compatible with the new minimum (FR-001, FR-002).

**Independent Test**: Open the site, click "Dropped Models", select "Old Minimum: macOS Big Sur", select "New Minimum: macOS Monterey". Verify the displayed models match the set difference of `data/macos-11-big-sur.json` minus `data/macos-12-monterey.json` by `model_identifier`. Verify table format matches existing views (FR-003). Verify summary bar shows correct counts. Click "Download as JSON" and verify the file contains only dropped models.

### Implementation for User Story 1

- [x] T004 [US1] Add a third mode button "Dropped Models" to the `.mode-toggle` div in `index.html`: insert `<button id="mode-dropped" class="mode-btn">Dropped Models</button>` after the existing "Version Range" button.
- [x] T005 [US1] Add dropped-models controls in `index.html`: create a new `<div id="dropped-controls" class="selector-group hidden">` containing a `.range-pair` layout with two selects — `<select id="dropped-old">` labeled "Old Minimum" and `<select id="dropped-new">` labeled "New Minimum". Place it after the existing `#range-controls` div.
- [x] T006 [US1] Add DOM references in `app.js` for the new elements: `modeDroppedBtn` (`#mode-dropped`), `droppedControls` (`#dropped-controls`), `droppedOld` (`#dropped-old`), `droppedNew` (`#dropped-new`).
- [x] T007 [US1] Wire event listeners in `app.js`: add click listener on `modeDroppedBtn` to call `setMode("dropped")`, add change listeners on `droppedOld` (to repopulate `droppedNew` and trigger load) and `droppedNew` (to trigger load).
- [x] T008 [US1] Update `setMode(mode)` in `app.js` to support the `"dropped"` mode: toggle visibility of `#dropped-controls` alongside `#single-controls` and `#range-controls`, update `.active` class on all three mode buttons, and trigger the appropriate load function when entering dropped mode.
- [x] T009 [US1] Update `populateSelectors()` in `app.js` to also populate the `droppedOld` select with all versions. After populating, trigger the constrained repopulation of `droppedNew`.
- [x] T010 [US1] Implement constrained "New Minimum" selector logic in `app.js` (FR-008): create a function `populateDroppedNew(oldIdx)` that clears and repopulates `#dropped-new` with only versions whose index in `versionIndex` is strictly greater than `oldIdx`. If the previous `droppedNew` selection is still valid (index > oldIdx), preserve it; otherwise default to the first available option. Call this function whenever `droppedOld` changes.
- [x] T011 [US1] Implement `loadDroppedModels(oldIdx, newIdx)` in `app.js` (FR-002): fetch both per-version JSON files (`versionIndex[oldIdx].data_file` and `versionIndex[newIdx].data_file`), compute the set difference — models whose `model_identifier` is present in the old version but absent from the new version — sort the result by `product_line` then `release_date`, store in `currentModels`, and call `renderModels()`. Handle fetch errors with `showError()`.
- [x] T012 [US1] Update the empty-state message in `renderModels()` in `app.js`: when `currentMode === "dropped"` and no models are found, display "No models dropped." instead of the default "No compatible models found." (per spec acceptance scenario 3).
- [x] T013 [US1] Update `onDownload()` in `app.js` (FR-006): add a `"dropped"` branch that generates filename as `{old_version_name}-to-{new_version_name}-dropped-models.json` (lowercased, spaces replaced with dashes) and downloads `currentModels`.

**Checkpoint**: "Dropped Models" button works, both selectors appear, "New Minimum" is constrained to versions after "Old Minimum". Big Sur → Monterey shows dropped models with correct summary. "No models dropped." appears for Sequoia → Tahoe. Download produces correct JSON. (Validates quickstart.md Scenarios 1, 2, 3, 5.)

---

## Phase 3: Polish & Validation

**Purpose**: End-to-end validation across all modes

- [x] T014 Verify the summary bar displays correctly in dropped-models mode: select Big Sur → Monterey and confirm the summary bar reflects dropped model counts (e.g., "3 MacBook Pro, 2 iMac — 5 models total"). Also verify El Capitan → Tahoe produces a large summary.
- [x] T015 Run quickstart.md scenarios 1–5 as a final validation pass: (1) Big Sur → Monterey dropped models with correct summary, (2) Sequoia → Tahoe shows "No models dropped.", (3) El Capitan → Tahoe shows large list, (4) single-version summary counts match table, (5) constrained new-minimum selector. Document any discrepancies and fix them.

**Checkpoint**: All 5 quickstart scenarios pass. Summary bar works in all 3 modes. Download works in all modes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US2 — Summary)**: No dependencies on other phases — extends existing `renderModels()` in `app.js` and adds styles in `style.css`
- **Phase 2 (US1 — Dropped Models)**: Depends on Phase 1 completion (summary bar should exist so the dropped-models view inherits it). Modifies `index.html` and `app.js`
- **Phase 3 (Polish)**: Depends on Phase 1 and Phase 2

### Within Phase Execution

**Phase 1**: T001 → T002 (sequential, same function in `app.js`). T003 is parallel with T001 (different file).

**Phase 2**: T004, T005 (sequential, both `index.html`) → T006, T007 (sequential, `app.js` DOM refs then listeners) → T008, T009 (sequential, `app.js` mode logic) → T010 (constrained selector) → T011 (load logic) → T012, T013 (parallel, different functions in `app.js`).

**Phase 3**: T014 → T015 (sequential validation).

### Parallel Opportunities

- T001 and T003 can run in parallel (app.js vs style.css)
- T012 and T013 can run in parallel (different functions, no overlap)

---

## Implementation Strategy

### MVP First (Phase 1 + Phase 2)

1. Complete Phase 1: Summary bar in all existing views
2. Complete Phase 2: Dropped Models mode
3. **STOP and VALIDATE**: Run quickstart scenarios 1–5
4. Deploy to GitHub Pages

### Incremental Delivery

1. Add US2 (summary bar) → Verify in single/range modes → Commit
2. Add US1 (dropped models) → Verify all modes → Commit
3. Polish → Final validation → Deploy
