# Quickstart: Dropped Models View & Product-Line Summary

**Branch**: `002-dropped-models` | **Date**: 2026-02-01

## Scenario 1: View dropped models between Big Sur and Monterey

1. Open the site in a browser.
2. Click "Dropped Models" in the mode toggle.
3. Select "Old Minimum: macOS Big Sur".
4. Select "New Minimum: macOS Monterey".
5. A summary bar appears: e.g., "3 MacBook Pro, 2 iMac — 5 models
   total".
6. Below it, a table shows only the models dropped (compatible with
   Big Sur but not Monterey), grouped by product line.
7. Click "Download as JSON" to get the dropped models as a file.

**Expected**: The dropped models are those whose `model_identifier`
appears in `macos-11-big-sur.json` but not in
`macos-12-monterey.json`.

## Scenario 2: No models dropped (Sequoia → Tahoe)

1. Open the site, select "Dropped Models" mode.
2. Select "Old Minimum: macOS Sequoia", "New Minimum: macOS Tahoe".
3. The site shows "No models dropped."

**Expected**: Few or no models are dropped between consecutive recent
versions.

## Scenario 3: Large jump (El Capitan → Tahoe)

1. Select "Dropped Models" mode.
2. Select "Old Minimum: OS X El Capitan", "New Minimum: macOS Tahoe".
3. A large list of dropped models appears with a summary bar.

**Expected**: Many older Intel models that El Capitan supported are
not supported by Tahoe.

## Scenario 4: Product-line summary in single-version mode

1. Open the site (default: Single Version mode).
2. Select "macOS Sequoia".
3. A summary bar appears above the table: e.g., "16 MacBook Pro,
   8 MacBook Air, 8 iMac, 1 iMac Pro, 4 Mac mini, 2 Mac Pro,
   3 Mac Studio — 63 models total".

**Expected**: The summary counts match the number of rows in each
product-line group.

## Scenario 5: Constrained new-minimum selector

1. Select "Dropped Models" mode.
2. Select "Old Minimum: macOS Monterey (12)".
3. The "New Minimum" dropdown shows only macOS Ventura (13) through
   macOS Tahoe (26) — no versions at or before Monterey.

**Expected**: It is impossible to select a new minimum that is older
than or equal to the old minimum.
