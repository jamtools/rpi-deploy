#!/usr/bin/env bash

set -e

mkdir -p /home/pi/code/artifacts
curl -sL -o /home/pi/code/artifacts/dist.zip "https://github.com/$1/$2/releases/download/$3/dist.zip"

mkdir -p /home/pi/code/artifacts/dist
unzip -o /home/pi/code/artifacts/dist.zip -d /home/pi/code/artifacts/dist

/home/pi/code/scripts/common/create_and_run_service.sh "${SERVICE_NAME:-myapp}" "${SERVICE_COMMAND}"

source /home/pi/code/secrets.env

if [ -n "${WEBHOOK_URL}" ]; then
  echo "Sending webhook notification"
  curl -X POST -H "Content-Type: application/json" -d '{"text":"new release deployed"}' "${WEBHOOK_URL}"
fi
