# Quickstart: Mac Hardware / macOS Compatibility Reference

**Branch**: `001-mac-compat-reference` | **Date**: 2026-02-01

## Scenario 1: Browse compatibility for a single macOS version

1. Open the site in a browser.
2. The version selector shows all macOS versions (10.11 through 26).
3. Select "macOS Sequoia".
4. A table appears showing compatible Mac models grouped by product
   line (MacBook Pro, MacBook Air, iMac, etc.).
5. Each row shows: short name, model identifier, CPU architecture,
   and release date.
6. Click "Download as JSON" to get the displayed list as a file.

**Expected**: The table matches the content of
https://support.apple.com/en-us/120282 enriched with model
identifiers and release dates.

## Scenario 2: Filter by macOS version range

1. Open the site in a browser.
2. Select a range: min = "macOS Monterey", max = "macOS Sequoia".
3. The table shows only models compatible with all versions from
   Monterey through Sequoia.
4. Click "Download as JSON" to get the filtered list.

**Expected**: Only models that appear in every per-version file from
Monterey (12) through Sequoia (15) are shown.

## Scenario 3: Programmatic access with curl

```bash
# 1. Discover available versions
curl -s https://<base>/data/index.json | jq '.[].version_name'

# 2. Fetch macOS Sequoia compatibility
curl -s https://<base>/data/macos-15-sequoia.json | jq '.models | length'

# 3. List all arm64 models for Sequoia
curl -s https://<base>/data/macos-15-sequoia.json \
  | jq '.models[] | select(.cpu_architecture == "arm64") | .short_name'

# 4. Find models compatible with both Monterey and Tahoe
comm -12 \
  <(curl -s .../data/macos-12-monterey.json | jq -r '.models[].model_identifier' | sort) \
  <(curl -s .../data/macos-26-tahoe.json | jq -r '.models[].model_identifier' | sort)
```

**Expected**: Each curl request returns valid JSON. The index lists
~16 versions. Per-version files contain 20–80 model entries.

## Scenario 4: Maintainer adds a new macOS version

1. Apple releases macOS 27 with a support page.
2. Maintainer extracts data using the documented LLM prompt
   (see `docs/extraction-guide.md`).
3. Maintainer saves result as `data/macos-27-<name>.json`.
4. Maintainer adds an entry to `data/index.json`.
5. Maintainer commits and pushes. GitHub Pages deploys automatically.
6. Open the site — the new version appears in the selector.

**Expected**: No code changes, no build step. The site picks up the
new JSON file on next page load.

## Scenario 5: Verify data integrity

```bash
# Validate all JSON files parse correctly
for f in data/*.json; do
  jq empty "$f" && echo "OK: $f" || echo "FAIL: $f"
done

# Check that every model in a version file has required fields
jq '.models[] | select(
  .model_identifier == null or
  .short_name == null or
  .product_line == null or
  .cpu_architecture == null or
  .release_date == null
)' data/macos-15-sequoia.json
# Expected: no output (all fields present)
```
