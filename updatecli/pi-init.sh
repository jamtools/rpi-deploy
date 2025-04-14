
mkdir code && cd code
sudo apt update
sudo apt install -y cockpit

# you can then log into cockpit via web browser at https://jamscribe.local:9090
# you use your actual linux user's creds to log in

curl -sL -o /tmp/updatecli_arm64.deb https://github.com/updatecli/updatecli/releases/download/v0.97.0/updatecli_arm64.deb && \
    sudo dpkg -i /tmp/updatecli_arm64.deb && \
    rm /tmp/updatecli_arm64.deb

sudo apt install -y npm
# this command took a loooooong time to run
# let's see if we can avoid installing this way

# also it took a while for the pi to initialize at first
# after a while, the ssh command worked


mkdir -p scripts

echo "
const {EventSource} = require('eventsource');
const {spawn} = require('node:child_process');

const origin = 'http://jam.local:1380';

setTimeout(async () => {
    run();
    new EventSource('http://jam.local:1380/esbuild').addEventListener('change', async e => {
        run();
    });
});

const run = () => {
    spawn('updatecli', ['apply', '--config', '/home/jamtools/code/local_file.yml'], {
        env: {
            PATH: process.env.PATH,
        },
        cwd: process.cwd(),
        stdio: 'inherit',
    });
};
" > scripts/check_esbuild.js

echo '
#!/bin/bash
# set -e

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
' > scripts/compare_with_file.sh

chmod +x scripts/compare_with_file.sh

echo '
' > scripts/run_from_esbuild.sh

chmod +x scripts/run_from_esbuild.sh

echo "
name: Watch esbuild output file hash and deploy if changed
sources:
  fileHash:
    kind: shell
    name: local hash
    spec:
      command: curl -s http://jam.local:1380/index.js | sha256sum | cut -d' ' -f1
conditions:
  hashChanged:
    kind: shell
    sourceid: fileHash
    spec:
      command: ./scripts/compare_with_file.sh ./.last_index_hash
targets:
  fetchBinary:
    kind: shell
    spec:
      command: ./scripts/run_from_esbuild.sh
" > local_file.yml

npm init -y
npm i eventsource

node scripts/check_esbuild.js
