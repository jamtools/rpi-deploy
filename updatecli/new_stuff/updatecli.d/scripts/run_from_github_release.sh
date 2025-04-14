#!/usr/bin/env bash

set -e

mkdir -p artifacts
curl -sL -o artifacts/index.js "https://github.com/$1/$2/releases/download/$3/index.js"

/home/jamtools/code/scripts/common/create_and_run_service.sh myapp "/usr/bin/node /home/jamtools/code/artifacts/index.js"
