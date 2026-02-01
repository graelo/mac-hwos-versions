#!/usr/bin/env bash
# Validate all JSON data files in data/
# Run from repository root: bash scripts/validate-data.sh

set -euo pipefail

ERRORS=0
DATA_DIR="data"

echo "=== Validating JSON data files ==="
echo ""

# 1. Check that every file referenced in index.json exists
echo "--- Checking index.json references ---"
for df in $(jq -r '.[].data_file' "$DATA_DIR/index.json"); do
  if [ -f "$DATA_DIR/$df" ]; then
    echo "  OK: $df"
  else
    echo "  MISSING: $df"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# 2. Validate each per-version JSON file
echo "--- Validating per-version files ---"
for f in "$DATA_DIR"/macos-*.json; do
  basename=$(basename "$f")
  echo "  Checking $basename..."

  # Parse check
  if ! jq empty "$f" 2>/dev/null; then
    echo "    FAIL: invalid JSON"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Required fields check
  missing=$(jq '[.models[] | select(
    .model_identifier == null or
    .short_name == null or
    .product_line == null or
    .cpu_architecture == null or
    .release_date == null
  )] | length' "$f")
  if [ "$missing" -gt 0 ]; then
    echo "    FAIL: $missing entries missing required fields"
    ERRORS=$((ERRORS + 1))
  fi

  # Duplicate model_identifiers
  total=$(jq '.models | length' "$f")
  unique=$(jq '[.models[].model_identifier] | unique | length' "$f")
  if [ "$total" != "$unique" ]; then
    dupes=$((total - unique))
    echo "    FAIL: $dupes duplicate model_identifiers ($total total, $unique unique)"
    ERRORS=$((ERRORS + 1))
  fi

  # cpu_architecture values
  bad_arch=$(jq '[.models[].cpu_architecture] | unique | map(select(. != "x86-64" and . != "arm64")) | length' "$f")
  if [ "$bad_arch" -gt 0 ]; then
    echo "    FAIL: $bad_arch invalid cpu_architecture values"
    jq '[.models[].cpu_architecture] | unique | map(select(. != "x86-64" and . != "arm64"))' "$f"
    ERRORS=$((ERRORS + 1))
  fi

  echo "    OK ($total models)"
done
echo ""

# 3. Summary
if [ "$ERRORS" -gt 0 ]; then
  echo "=== FAILED: $ERRORS error(s) found ==="
  exit 1
else
  echo "=== ALL CHECKS PASSED ==="
  exit 0
fi
