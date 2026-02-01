# Feature Specification: Dropped Models View & Product-Line Summary

**Feature Branch**: `002-dropped-models`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "I want to make it easy to browse which
Mac models are dropped when support for a software moves from one macOS
version to another. For instance, let's assume that freecad wants to
abandon supporting macOS 11 and set the minimum to macOS 12, I want
this page to be an easy way to discover which models are abandoned. By
the way, an additional ask, I want a short short summary that counts
the number of Mac Pro (if any), Mac mini, MacBook, MacBook Air, etc
before the big table on the page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Dropped Models Between Two macOS Versions (Priority: P1)

A visitor (such as a software maintainer or IT administrator) wants to
know which Mac models would lose support if their software raised its
minimum macOS requirement from one version to a newer one. They select
the "old minimum" and the "new minimum" macOS versions, and the site
shows a list of Mac models that are compatible with the old minimum but
NOT compatible with the new minimum — i.e., the models that would be
"dropped" by this change.

**Why this priority**: This is the core value proposition of this
feature — answering "which hardware do we abandon?" is the entire
reason a visitor comes to this view.

**Independent Test**: Can be tested by selecting two macOS versions
(e.g., macOS Big Sur → macOS Monterey) and verifying the displayed
list matches a manual diff of the two per-version JSON files.

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** a visitor selects "old
   minimum: macOS Big Sur" and "new minimum: macOS Monterey", **Then**
   they see all Mac models that are compatible with Big Sur but not
   with Monterey, grouped by product line.
2. **Given** a dropped-models view is displayed, **When** the visitor
   scans the list, **Then** each model shows its short name, model
   identifier, CPU architecture, and release date — same fields as the
   existing compatibility table.
3. **Given** two consecutive versions are selected (e.g., macOS
   Sequoia → macOS Tahoe), **When** no models are dropped between
   them, **Then** the site displays a clear "No models dropped" message.
4. **Given** a dropped-models result is displayed, **When** the
   visitor clicks "Download as JSON", **Then** they receive a JSON
   file containing only the dropped models.

---

### User Story 2 - Product-Line Summary Counts (Priority: P2)

Before the detailed model table, a visitor sees a compact summary
showing the count of models per product line (e.g., "3 MacBook Pro,
2 iMac, 1 Mac mini"). This gives an at-a-glance sense of the scope
and impact without scrolling through the full table.

**Why this priority**: The summary enhances usability and provides
immediate context, but the feature is fully functional without it.
This applies to ALL views on the site (single-version, range, and
dropped-models), not just the dropped-models view.

**Independent Test**: Can be tested by loading any view and verifying
the summary counts match the number of rows in each product-line
group in the table below.

**Acceptance Scenarios**:

1. **Given** a single macOS version is selected, **When** the
   compatible models are displayed, **Then** a summary line appears
   above the table showing the count per product line (e.g.,
   "16 MacBook Pro, 8 MacBook Air, 5 iMac, ...").
2. **Given** a dropped-models view is displayed, **When** 3 MacBook
   Pro and 2 iMac models are dropped, **Then** the summary shows
   "3 MacBook Pro, 2 iMac".
3. **Given** any view is displayed, **When** a product line has zero
   models, **Then** that product line is omitted from the summary
   (not shown as "0 Mac Pro").
4. **Given** any view is displayed, **When** the summary is shown,
   **Then** it also displays the total model count (e.g.,
   "52 models total").

---

### Edge Cases

- What happens when the visitor selects the same version for both old
  and new minimum? The site MUST display a clear message such as
  "Select two different versions" rather than showing an empty or
  confusing result.
- What happens when the visitor selects a newer version as the "old
  minimum" and an older version as the "new minimum"? This cannot
  happen — the "new minimum" selector only offers versions newer than
  the selected "old minimum".
- What happens when no models exist in a product line for a given
  view? That product line is simply omitted from both the summary and
  the table.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a "Dropped Models" mode where the
  visitor selects an "old minimum" and a "new minimum" macOS version.
- **FR-002**: In Dropped Models mode, the site MUST display all Mac
  models that are compatible with the old minimum version but NOT
  compatible with the new minimum version (set difference:
  old minus new).
- **FR-003**: The dropped models list MUST use the same table format
  as the existing compatibility views (short name, model identifier,
  CPU architecture, release date), grouped by product line.
- **FR-004**: The site MUST display a product-line summary above the
  model table in ALL views (single-version, version-range, and
  dropped-models). The summary shows the count of models per product
  line and a total count.
- **FR-005**: Product lines with zero models MUST be omitted from the
  summary.
- **FR-006**: The "Download as JSON" action MUST work in
  Dropped Models mode, exporting only the dropped models.
- **FR-007**: In Dropped Models mode, if the old and new minimum are
  the same version, the site MUST display a validation message instead
  of results.
- **FR-008**: In Dropped Models mode, the version selectors MUST
  enforce ascending order: the "new minimum" selector only offers
  versions newer than the selected "old minimum".

### Key Entities

- **DroppedModelSet**: The set of Mac models present in the old
  minimum version's compatibility list but absent from the new minimum
  version's compatibility list. Computed as a set difference on
  `model_identifier`. No new data storage needed — this is derived
  from existing per-version JSON files.

## Clarifications

### Session 2026-02-01

- Q: Should dropped-models mode allow any two versions or only adjacent versions? → A: Any two versions (arbitrary jump, e.g., 10.13 → 15).
- Q: Should the two version selectors enforce ascending order? → A: Yes. The "new minimum" selector MUST only offer versions newer than the selected "old minimum".

## Assumptions

- The existing per-version JSON files and data model from feature
  001-mac-compat-reference are available and unchanged.
- "Dropped" means a model's `model_identifier` appears in the old
  version's file but does not appear in the new version's file.
- The product-line summary applies to all views site-wide, not just
  dropped-models mode.
- The dropped-models mode is a third mode alongside the existing
  "Single Version" and "Version Range" modes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can identify all dropped models between any
  two macOS versions within 10 seconds of selecting both versions.
- **SC-002**: The product-line summary counts match the actual number
  of models displayed in the table below, for every view on the site.
- **SC-003**: The dropped-models result for Big Sur → Monterey matches
  a manual diff of the two per-version JSON files with 100% accuracy.
- **SC-004**: The "Download as JSON" in dropped-models mode produces a
  valid JSON file containing exactly the displayed dropped models.
