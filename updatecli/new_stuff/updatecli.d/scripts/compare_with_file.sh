#!/bin/bash
# set -euo pipefail

COMPARE_FILE="$1"
SOURCE_VALUE="${2:-}"

# If SOURCE_VALUE is empty, use last argument passed (from Updatecli)
if [ -z "$SOURCE_VALUE" ]; then
  SOURCE_VALUE="${@: -1}"
fi

if [ ! -f "$COMPARE_FILE" ]; then
  echo "Compare file not found, creating with value: $SOURCE_VALUE"
  echo "$SOURCE_VALUE" > "$COMPARE_FILE"
  exit 0
fi

EXISTING_VALUE=$(cat "$COMPARE_FILE")

if [ "$EXISTING_VALUE" = "$SOURCE_VALUE" ]; then
  echo "No change needed. Value matches $COMPARE_FILE."
  exit 0
else
  echo "Value changed. Updating $COMPARE_FILE."
  echo "$SOURCE_VALUE" > "$COMPARE_FILE"
  exit 0
fi
