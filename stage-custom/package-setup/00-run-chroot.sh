#!/bin/bash
set -e

mkdir -p /proc /dev /sys /run /tmp

# Install required packages
apt-get update
apt-get install -y python3

# Configure Wi-Fi
mkdir -p /etc/wpa_supplicant

cat << EOF > /etc/wpa_supplicant/wpa_supplicant.conf
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="Your_SSID"
    psk="Your_Password"
}
EOF

chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf

# Set up a simple HTTP server
cat << SERVER_EOF > /usr/local/bin/simple-http-server.py
#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Hello from Raspberry Pi!')

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), SimpleHandler)
    print('Starting server at http://0.0.0.0:8080')
    server.serve_forever()
SERVER_EOF
chmod +x /usr/local/bin/simple-http-server.py

# Create and enable a systemd service for the HTTP server
cat << SERVICE_EOF > /etc/systemd/system/simple-http-server.service
[Unit]
Description=Simple HTTP Server
After=network.target

[Service]
ExecStart=/usr/local/bin/simple-http-server.py
Restart=always
User=root

[Install]
WantedBy=multi-user.target
SERVICE_EOF

systemctl enable simple-http-server.service
