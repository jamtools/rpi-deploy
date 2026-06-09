#!/usr/bin/env bash
set -e

ESBUILD_SERVER_URL="${ESBUILD_SERVER_URL:-http://localhost:1380}"
SERVICE_NAME="${1:-myapp-dev}"

mkdir -p /home/pi/code/artifacts
curl -sL -o /home/pi/code/artifacts/index.js "${ESBUILD_SERVER_URL}/index.js"

/home/pi/code/scripts/common/create_and_run_service.sh "$SERVICE_NAME" "node /home/pi/code/artifacts/index.js"
