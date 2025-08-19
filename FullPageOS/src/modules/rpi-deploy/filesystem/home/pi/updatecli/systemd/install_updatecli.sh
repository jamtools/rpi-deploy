#!/bin/bash

# Define the desired version of updatecli
UPDATECLI_VERSION="v0.93.0"
ARCH=$(uname -m)

# Determine the architecture
case $ARCH in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64)
        ARCH="arm64"
        ;;
    armv6l)
        ARCH="armv6"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Installation directory
INSTALL_DIR="/usr/local/bin"

# Check if updatecli is already installed and at the desired version
if command -v updatecli &>/dev/null; then
    INSTALLED_VERSION=$(updatecli version | awk '{print $3}')
    if [ "$INSTALLED_VERSION" == "$UPDATECLI_VERSION" ]; then
        echo "updatecli $UPDATECLI_VERSION is already installed."
        exit 0
    else
        echo "Updating updatecli from version $INSTALLED_VERSION to $UPDATECLI_VERSION."
    fi
else
    echo "Installing updatecli $UPDATECLI_VERSION."
fi

# Download and install updatecli
TMP_DIR=$(mktemp -d)
curl -sL -o "$TMP_DIR/updatecli_${ARCH}.tgz" "https://github.com/updatecli/updatecli/releases/download/$UPDATECLI_VERSION/updatecli_${ARCH}.tgz"
tar -xzf "$TMP_DIR/updatecli_${ARCH}.tgz" -C "$TMP_DIR"
mv "$TMP_DIR/updatecli" "$INSTALL_DIR/updatecli"
chmod +x "$INSTALL_DIR/updatecli"
rm -rf "$TMP_DIR"

echo "updatecli $UPDATECLI_VERSION has been installed successfully."
