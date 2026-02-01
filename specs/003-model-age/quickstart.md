# Quickstart: Model Age Column

**Branch**: `003-model-age` | **Date**: 2026-02-01

## Scenario 1: Age column in single-version mode

1. Open the site in a browser.
2. Select "macOS Sequoia" from the version dropdown.
3. The model table shows columns: Model, Identifier, Architecture,
   Released, Age.
4. A MacBook Pro released in "2023-01" shows "3 yr" (assuming current
   date is 2026-02).
5. A MacBook Pro released in "2025-09" shows "0 yr".

**Expected**: Every row has an Age value that equals the floor of
complete years between the release date and today.

## Scenario 2: Age column in version-range mode

1. Switch to "Version Range" mode.
2. Select "From: macOS Big Sur", "To: macOS Sequoia".
3. The Age column is present in the results table.

**Expected**: Age values are correct for all displayed models.

## Scenario 3: Age column in dropped-models mode

1. Switch to "Dropped Models" mode.
2. Select "Old Minimum: macOS Big Sur", "New Minimum: macOS Monterey".
3. The dropped models table includes the Age column.
4. Older dropped models (e.g., released in 2013) show ages like
   "12 yr" or "13 yr".

**Expected**: Age column works identically to other modes.

## Scenario 4: JSON download unchanged

1. In any mode, click "Download as JSON".
2. Open the downloaded file.
3. Model entries contain the original fields only (model_identifier,
   short_name, product_line, cpu_architecture, release_date).
4. No "age" field is present.

**Expected**: The download output is not affected by the age column.
