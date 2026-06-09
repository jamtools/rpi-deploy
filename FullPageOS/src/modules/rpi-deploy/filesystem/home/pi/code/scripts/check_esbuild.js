const {EventSource} = require('eventsource');
const {spawn} = require('node:child_process');

const origin = process.env.ESBUILD_SERVER_URL || 'http://localhost:1380';
const serviceName = process.env.SERVICE_NAME || 'myapp-dev';

console.log(`Starting esbuild watcher for ${origin} with service ${serviceName}`);

setTimeout(async () => {
    run();
    new EventSource(origin + '/esbuild').addEventListener('change', async e => {
        run();
    });
});

const run = () => {
    spawn('/home/pi/code/scripts/run_from_esbuild.sh', [serviceName], {
    // spawn('updatecli', ['apply', '--config', '/home/pi/code/local_file.yml'], {
        env: {
            ...process.env,
            ESBUILD_SERVER_URL: origin,
            SERVICE_NAME: serviceName,
        },
        cwd: '/home/pi/code',
        stdio: 'inherit',
    });
};
