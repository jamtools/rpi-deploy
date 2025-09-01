#!/usr/bin/env bash
set -e

mkdir -p artifacts
curl -sL -o /home/pi/code/artifacts/index.js http://jam.local:1380/index.js

/home/pi/code/scripts/common/create_and_run_service.sh $1 "node /home/pi/code/artifacts/index.js"
