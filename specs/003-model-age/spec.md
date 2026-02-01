# Feature Specification: Model Age Column

**Feature Branch**: `003-model-age`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "I want an additional column in all views,
next to 'Released', that shows the age of the model (in years)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Model Age at a Glance (Priority: P1)

A visitor browsing the compatibility table wants to quickly assess how
old each Mac model is without doing mental arithmetic from the release
date. An "Age" column next to the "Released" column shows the age in
years, giving an immediate sense of whether a model is recent or aging
out.

**Why this priority**: This is the sole feature — adding the age column
to all existing views (single-version, version-range, and dropped-models).

**Independent Test**: Open the site, select any macOS version, and
verify that every row in the table shows an "Age" column with a value
in years that is consistent with the model's release date and today's
date.

**Acceptance Scenarios**:

1. **Given** the site is loaded in any view mode, **When** a visitor
   looks at the model table, **Then** an "Age" column appears to the
   right of the "Released" column.
2. **Given** a model was released in 2020-06, **When** the current date
   is 2026-02, **Then** the age displays as "5 yr" (the number of full
   years elapsed).
3. **Given** a model was released in 2025-09, **When** the current date
   is 2026-02, **Then** the age displays as "0 yr" (less than one full
   year has elapsed).
4. **Given** the site is viewed in Dropped Models mode, **When** dropped
   models are displayed, **Then** the age column is present and correct
   for the dropped models as well.

---

### Edge Cases

- What happens when a model's release date is in the current month or
  a future month? The age displays as "0 yr".
- What happens when the release date format is missing a day component
  (e.g., "2020-06" instead of "2020-06-15")? The age is computed from
  the first of that month (since existing data uses YYYY-MM format).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The model table MUST include an "Age" column positioned
  immediately after the "Released" column in all views (single-version,
  version-range, and dropped-models).
- **FR-002**: The age MUST be displayed as the number of complete years
  elapsed since the model's release date, formatted as "{N} yr" (e.g.,
  "5 yr", "0 yr", "12 yr").
- **FR-003**: The age MUST be computed relative to the current date at
  the time of page load.
- **FR-004**: The age column MUST appear in the JSON download output
  as well — not as a new field, since age is a derived value that
  changes over time. The download MUST continue to export only the
  original data fields (no age field in JSON).

## Assumptions

- The release date in existing data files uses the YYYY-MM format. Age
  computation treats the release as occurring on the 1st of that month.
- "Complete years elapsed" means the floor of the difference in years
  (e.g., 5 years and 11 months = "5 yr").
- The age is display-only and not stored in any data file.
- This feature reuses the existing table structure and requires no new
  data files or dependencies.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every row in the model table across all three view modes
  shows an age value that matches the expected full-year difference
  between the model's release date and the current date.
- **SC-002**: The age column is visible and correctly positioned (after
  "Released") on both desktop and mobile viewports.
- **SC-003**: The JSON download output remains unchanged (no age field
  added to the exported data).
