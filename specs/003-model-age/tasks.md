# Tasks: Model Age Column

**Input**: Design documents from `/specs/003-model-age/`
**Prerequisites**: plan.md (required), spec.md (required), quickstart.md

**Tests**: Not explicitly requested. Manual validation via quickstart.md scenarios.

**Organization**: Single user story — all tasks belong to US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 — Model Age Column (Priority: P1)

**Goal**: Add an "Age" column to the model table in all views showing the number of complete years since each model's release date.

**Independent Test**: Open the site, select any macOS version, verify that every row shows an "Age" column with a correct year count relative to today's date.

### Implementation for User Story 1

- [x] T001 [US1] Implement `modelAge(releaseDate)` helper function in `app.js`: parse the YYYY-MM release date string, compute the number of complete years elapsed from the 1st of that month to the current date, and return a string formatted as "{N} yr" (e.g., "5 yr", "0 yr").
- [x] T002 [US1] Add "Age" column header to the table in `renderModels()` in `app.js`: insert `<th>Age</th>` after the "Released" header in the `thead` row.
- [x] T003 [US1] Add age cell to each model row in `renderModels()` in `app.js`: call `modelAge(m.release_date)` for each model and append the result as a `<td>` after the release date cell.

**Checkpoint**: Age column appears in all three view modes (single-version, version-range, dropped-models). Values are correct. JSON download is unchanged (no age field).

---

## Phase 2: Validation

- [x] T004 Run quickstart.md scenarios 1–4 as a final validation pass: (1) age column in single-version mode with correct values, (2) age column in version-range mode, (3) age column in dropped-models mode with older models showing high ages, (4) JSON download contains no age field.

**Checkpoint**: All 4 quickstart scenarios pass.

---

## Dependencies & Execution Order

T001 → T002 → T003 → T004 (strictly sequential, all in `app.js`)

No parallel opportunities — all tasks modify the same file and depend on prior tasks.

---

## Implementation Strategy

1. Implement `modelAge()` helper (T001)
2. Add column header (T002)
3. Add cell per row (T003)
4. Validate (T004)
