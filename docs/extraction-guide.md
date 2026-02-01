# Data Extraction Guide

How to extract Mac hardware compatibility data from Apple support pages
and add it to this project.

## Overview

Each macOS version has a corresponding Apple support page listing
compatible Mac models. We extract this data into a structured JSON file
following our data model.

Two types of Apple pages are used:

1. **Compatibility pages** (one per macOS version) — list compatible
   models by product line using short names.
2. **"Identify your Mac" pages** (one per product line) — provide model
   identifiers, part numbers, and newest compatible OS.

## "Identify your Mac" Reference Pages

| Product Line | URL |
|-------------|-----|
| MacBook Pro | https://support.apple.com/en-us/108052 |
| MacBook Air | https://support.apple.com/en-us/102869 |
| MacBook | https://support.apple.com/en-us/103257 |
| iMac | https://support.apple.com/en-us/108054 |
| Mac mini | https://support.apple.com/en-us/102852 |
| Mac Pro | https://support.apple.com/en-us/102887 |
| Mac Studio | https://support.apple.com/en-us/102231 |

## Step-by-Step: Adding a New macOS Version

### 1. Identify the Apple support page

Find the Apple support article for the new macOS version. It will list
all compatible Mac models grouped by product line.

Example: macOS Sequoia -> https://support.apple.com/en-us/120282

### 2. Extract compatible models using an LLM

Use the following prompt with an LLM that can read web pages:

```text
Read the Apple support page at [URL].

Extract all compatible Mac models listed on this page. For each model:
1. Note the short name exactly as written (e.g., "MacBook Pro (16-inch, 2019)")
2. Note the product line (MacBook Pro, MacBook Air, iMac, etc.)

Then, for each model, cross-reference the appropriate "Identify your Mac"
page to find:
3. The model identifier (e.g., MacBookPro17,1)
4. The CPU architecture: "arm64" for Apple Silicon, "x86-64" for Intel
5. The release date in YYYY-MM format

Output the result as JSON following this exact schema:

{
  "version_name": "macOS [Name]",
  "version_number": "[number]",
  "release_date": "[YYYY-MM]",
  "source_url": "[the Apple support page URL]",
  "models": [
    {
      "model_identifier": "[e.g., MacBookPro17,1]",
      "short_name": "[e.g., MacBook Pro (13-inch, M1, Late 2020)]",
      "product_line": "[e.g., MacBook Pro]",
      "cpu_architecture": "[x86-64 or arm64]",
      "release_date": "[YYYY-MM]"
    }
  ]
}

Sort models by product_line alphabetically, then by release_date ascending.
One entry per model_identifier (a single short name may have multiple
identifiers).
```

### 3. Validate the extracted data

- Every model entry has all 5 required fields
- No duplicate model_identifiers
- cpu_architecture is exactly "x86-64" or "arm64"
- Models are sorted by product_line then release_date
- Spot-check a few models against the source page

Run the validation script:

```bash
bash scripts/validate-data.sh
```

### 4. Save and update the index

Save the JSON file as `data/macos-{version_number}-{name}.json`.

Example: `data/macos-15-sequoia.json`

Add an entry to `data/index.json`:

```json
{
  "version_name": "macOS Sequoia",
  "version_number": "15",
  "release_date": "2024-09",
  "source_url": "https://support.apple.com/en-us/120282",
  "data_file": "macos-15-sequoia.json"
}
```

Keep the index sorted by version_number ascending.

### 5. Commit and deploy

```bash
git add data/macos-15-sequoia.json data/index.json
git commit -m "Add macOS 15 Sequoia compatibility data"
git push
```

GitHub Pages will deploy automatically.

## Worked Example: Adding macOS Sequoia

**Before** (index.json excerpt):
```json
[
  ...
  {
    "version_name": "macOS Sonoma",
    "version_number": "14",
    "release_date": "2023-09",
    "source_url": "https://support.apple.com/en-us/105113",
    "data_file": "macos-14-sonoma.json"
  }
]
```

**After** (index.json excerpt):
```json
[
  ...
  {
    "version_name": "macOS Sonoma",
    "version_number": "14",
    "release_date": "2023-09",
    "source_url": "https://support.apple.com/en-us/105113",
    "data_file": "macos-14-sonoma.json"
  },
  {
    "version_name": "macOS Sequoia",
    "version_number": "15",
    "release_date": "2024-09",
    "source_url": "https://support.apple.com/en-us/120282",
    "data_file": "macos-15-sequoia.json"
  }
]
```
