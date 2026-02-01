# Mac Hardware / macOS Compatibility Reference

A browsable, programmable reference for which Mac hardware is supported
by each macOS version, backed by JSON data extracted from official Apple
support pages, served as a static GitHub Pages site.

## Live Site

**https://graelo.github.io/mac-hwos-versions/**

## What's Inside

- Compatibility data for macOS 10.11 (El Capitan) through macOS 26
  (Tahoe)
- Every Mac model identified by Apple model identifier (e.g.,
  `MacBookPro17,1`)
- CPU architecture (Intel x86-64 or Apple Silicon arm64), product line,
  and release date for each model
- Data sourced from official Apple support pages

## Browse

Open the site. Pick a macOS version from the dropdown to see all
compatible Mac models. Switch to "Version Range" mode to find models
compatible with every version in a range. Download the current view as
JSON.

## Programmatic Access

All data is available as static JSON files. No JavaScript required.

### Version Index

```bash
curl -s https://graelo.github.io/mac-hwos-versions/data/index.json
```

Returns an array of all macOS versions:

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

### Per-Version Data

```bash
# All models compatible with macOS Sequoia
curl -s https://graelo.github.io/mac-hwos-versions/data/macos-15-sequoia.json

# Just Apple Silicon models
curl -s .../data/macos-15-sequoia.json \
  | jq '.models[] | select(.cpu_architecture == "arm64") | .short_name'

# Model count per version
curl -s .../data/macos-15-sequoia.json | jq '.models | length'
```

### Cross-Version Queries

```bash
# Models compatible with both Monterey and Tahoe
comm -12 \
  <(curl -s .../data/macos-12-monterey.json | jq -r '.models[].model_identifier' | sort) \
  <(curl -s .../data/macos-26-tahoe.json | jq -r '.models[].model_identifier' | sort)
```

### URL Pattern

```
/data/index.json                       # Version index
/data/macos-{version}-{name}.json      # Per-version data
```

Examples: `/data/macos-15-sequoia.json`,
`/data/macos-10.13-high-sierra.json`, `/data/macos-26-tahoe.json`

## Data Schema

### Per-Version File

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

| Field | Description |
|-------|-------------|
| `model_identifier` | Apple model ID, primary key (e.g., `MacBookPro17,1`) |
| `short_name` | Display name (e.g., "MacBook Pro (13-inch, M1, Late 2020)") |
| `product_line` | MacBook Pro, MacBook Air, iMac, Mac mini, Mac Pro, Mac Studio, MacBook, iMac Pro |
| `cpu_architecture` | `"x86-64"` (Intel) or `"arm64"` (Apple Silicon) |
| `release_date` | Hardware release date, `YYYY-MM` format |

## Adding a New macOS Version

1. Find the Apple support page for the new version
2. Extract compatible models using the LLM prompt in
   [`docs/extraction-guide.md`](docs/extraction-guide.md)
3. Save as `data/macos-{version}-{name}.json`
4. Add an entry to `data/index.json`
5. Commit and push — the site updates automatically

No code changes required.

## Data Sources

All compatibility data is extracted from official Apple support pages:

- [macOS Sequoia](https://support.apple.com/en-us/120282)
- [macOS Tahoe](https://support.apple.com/en-us/122867)
- [macOS Sonoma](https://support.apple.com/en-us/105113)
- [macOS Ventura](https://support.apple.com/en-us/102861)
- [macOS Monterey](https://support.apple.com/en-us/103260)
- [macOS Big Sur](https://support.apple.com/en-us/111980)
- [macOS Catalina](https://support.apple.com/en-us/118458)
- [macOS Mojave](https://support.apple.com/en-us/111930)
- [macOS High Sierra](https://support.apple.com/en-us/111934)
- [macOS Sierra](https://support.apple.com/en-us/111988)
- [OS X El Capitan](https://support.apple.com/en-us/111989)

Model identifiers cross-referenced with Apple's "Identify your Mac"
pages per product line.

## License

Data sourced from Apple Support. This project provides a convenient
reference format and does not claim ownership of Apple's compatibility
data.
