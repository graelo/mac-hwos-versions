# Data Model: Mac Hardware / macOS Compatibility Reference

**Branch**: `001-mac-compat-reference` | **Date**: 2026-02-01

## Entity: VersionIndex

**File**: `data/index.json`

Top-level array of all macOS versions covered by the project.

```json
[
  {
    "version_name": "macOS Sequoia",
    "version_number": "15",
    "release_date": "2024-09",
    "source_url": "https://support.apple.com/en-us/120282",
    "data_file": "macos-15-sequoia.json"
  }
]
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version_name` | string | yes | Display name (e.g., "macOS Sequoia") |
| `version_number` | string | yes | Version number (e.g., "15", "10.13") |
| `release_date` | string | yes | `YYYY-MM` format |
| `source_url` | string | yes | Apple support page URL |
| `data_file` | string | yes | Filename of the per-version JSON file |

### Ordering

Array is sorted by version number ascending (oldest first).

## Entity: Per-Version File (CompatibilityEntry)

**File**: `data/macos-{version_number}-{name}.json`
(e.g., `data/macos-15-sequoia.json`)

Contains metadata about the macOS version and a flat array of all
compatible Mac models.

```json
{
  "version_name": "macOS Sequoia",
  "version_number": "15",
  "release_date": "2024-09",
  "source_url": "https://support.apple.com/en-us/120282",
  "models": [
    {
      "model_identifier": "MacBookPro17,1",
      "short_name": "MacBook Pro (13-inch, M1, Late 2020)",
      "product_line": "MacBook Pro",
      "cpu_architecture": "arm64",
      "release_date": "2020-11"
    }
  ]
}
```

### Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version_name` | string | yes | Same as in index |
| `version_number` | string | yes | Same as in index |
| `release_date` | string | yes | `YYYY-MM` format |
| `source_url` | string | yes | Apple support page URL |
| `models` | array | yes | Array of MacModel objects |

### MacModel Fields (within `models` array)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model_identifier` | string | yes | Apple model ID (e.g., `MacBookPro17,1`). Primary key. |
| `short_name` | string | yes | Display label (e.g., "MacBook Pro (13-inch, M1, Late 2020)") |
| `product_line` | string | yes | One of: MacBook, MacBook Pro, MacBook Air, iMac, iMac Pro, Mac mini, Mac Studio, Mac Pro |
| `cpu_architecture` | string | yes | `"x86-64"` or `"arm64"` |
| `release_date` | string | yes | `YYYY-MM` format (hardware release date) |

### Constraints

- `model_identifier` MUST be unique within a single per-version
  file (no duplicate entries for the same model).
- `model_identifier` is the cross-version join key — the same
  identifier appearing in multiple per-version files means that
  model is compatible with all those macOS versions.
- `cpu_architecture` is exactly `"x86-64"` or `"arm64"` — no other
  values.
- `product_line` uses the canonical Apple product line name.
- `models` array is sorted by `product_line` (alphabetically), then
  by `release_date` (ascending) within each product line.

## Relationships

```text
VersionIndex (index.json)
  └── 1:1 ──► Per-Version File (macos-15-sequoia.json)
                └── 1:N ──► MacModel entries (within "models" array)

Cross-version linking:
  MacModel.model_identifier in file A
    == MacModel.model_identifier in file B
  ⟹ that hardware is compatible with both macOS versions
```

## Data Volume Estimates

- macOS versions: ~16 (10.11 through 26)
- Models per version: ~20–80 (older OS versions support more models)
- Unique model identifiers across all versions: ~150–250
- Total JSON size (all files combined): <500 KB
