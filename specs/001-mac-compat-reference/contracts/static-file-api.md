# Static File API Contract

**Branch**: `001-mac-compat-reference` | **Date**: 2026-02-01

This project has no server-side API. The "API" is a set of static
JSON files served via GitHub Pages at predictable URLs.

## Base URL

```
https://<github-user>.github.io/mac-hwos-versions/data/
```

## Endpoints

### GET /data/index.json

Returns the version index — an array of all macOS versions with
metadata and file paths.

**Response**: `Content-Type: application/json`

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

**Usage**:
```bash
curl https://<base>/data/index.json
```

### GET /data/macos-{version}-{name}.json

Returns all compatible Mac models for a specific macOS version.

**URL pattern**: `/data/macos-{version_number}-{name}.json`

**Examples**:
- `/data/macos-15-sequoia.json`
- `/data/macos-10.13-high-sierra.json`
- `/data/macos-26-tahoe.json`

**Response**: `Content-Type: application/json`

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

**Usage**:
```bash
# Fetch models compatible with macOS Sequoia
curl https://<base>/data/macos-15-sequoia.json

# Extract just arm64 models with jq
curl -s https://<base>/data/macos-15-sequoia.json \
  | jq '.models[] | select(.cpu_architecture == "arm64")'

# Find models compatible with both Monterey and Sequoia
comm -12 \
  <(curl -s .../macos-12-monterey.json | jq -r '.models[].model_identifier' | sort) \
  <(curl -s .../macos-15-sequoia.json | jq -r '.models[].model_identifier' | sort)
```

## Error Handling

Since these are static files:

- **200 OK**: File exists and is served.
- **404 Not Found**: File does not exist (invalid version or typo).
- No authentication, no rate limiting, no query parameters.

## CORS

GitHub Pages serves files with permissive CORS headers, allowing
`fetch()` from any origin. No additional configuration needed.

## Stability Guarantees

- File URLs are stable: once a macOS version file is published, its
  URL does not change.
- The `index.json` is append-only: new versions are added, existing
  entries are not removed.
- The JSON schema is backward-compatible: new fields may be added
  but existing fields are not removed or renamed.
