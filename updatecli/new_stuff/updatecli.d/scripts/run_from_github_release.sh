#!/usr/bin/env bash

set -e

mkdir -p /home/jamtools/code/artifacts
curl -sL -o /home/jamtools/code/artifacts/dist.zip "https://github.com/$1/$2/releases/download/$3/dist.zip"

mkdir -p /home/jamtools/code/artifacts/dist
unzip -o /home/jamtools/code/artifacts/dist.zip -d /home/jamtools/code/artifacts/dist

/home/jamtools/code/scripts/common/create_and_run_service.sh myapp "/usr/bin/node /home/jamtools/code/artifacts/dist/server/dist/local-server.cjs"
