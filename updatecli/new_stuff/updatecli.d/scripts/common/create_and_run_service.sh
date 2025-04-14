#!/usr/bin/env bash

set -e

SECONDS=0

SERVICE_NAME="$1"
COMMAND="$2"

SYSTEMD_PATH="/etc/systemd/system/${SERVICE_NAME}.service"

NEW_SERVICE_CONTENT="[Unit]
Description=$SERVICE_NAME
After=network.target

[Service]
Type=simple
ExecStart=$COMMAND
Restart=on-failure
WorkingDirectory=/home/jamtools/code/artifacts

[Install]
WantedBy=multi-user.target"

echo "Before check took $SECONDS seconds"
if [ ! -f "$SYSTEMD_PATH" ] || ! echo "$NEW_SERVICE_CONTENT" | sudo diff - "$SYSTEMD_PATH" >/dev/null 2>&1; then
    echo "Service file needs updating..."
    echo "$NEW_SERVICE_CONTENT" | sudo tee "$SYSTEMD_PATH" > /dev/null
    echo "Before reload took $SECONDS seconds"
    sudo systemctl daemon-reload
    echo "After reload took $SECONDS seconds"
else
    echo "Service file is up to date"
fi

echo "Before restart took $SECONDS seconds"

echo "Restarting service..."
sudo systemctl enable "$SERVICE_NAME"

echo "Before restart took $SECONDS seconds"
sudo systemctl restart "$SERVICE_NAME"

echo "After restart took $SECONDS seconds"

echo "Done!"
