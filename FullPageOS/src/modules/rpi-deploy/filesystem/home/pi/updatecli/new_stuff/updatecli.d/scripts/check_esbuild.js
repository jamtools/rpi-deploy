const {EventSource} = require('eventsource');
const {spawn} = require('node:child_process');

const origin = 'http://jam.local:1380';

setTimeout(async () => {
    run();
    new EventSource(origin + '/esbuild').addEventListener('change', async e => {
        run();
    });
});

const run = () => {
    spawn('/home/jamtools/code/scripts/run_from_esbuild.sh', ['myapp'], {
    // spawn('updatecli', ['apply', '--config', '/home/jamtools/code/local_file.yml'], {
        env: {
            PATH: process.env.PATH,
        },
        cwd: process.cwd(),
        stdio: 'inherit',
    });
};
