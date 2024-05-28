import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

const DEBUG = true;

describe('yeah', () => {
    it('should work', async () => {
        let out = await execAsync('npm run build');
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        out = await execAsync('npm run dist-pkg');
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        out = await execAsync('docker compose build', {cwd: './docker'});
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        out = await execAsync('docker compose up', {cwd: './docker'});
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        const lines = getConsoleLinesFromDockerComposeStdOut('pi', out.stdout);
        expect(lines).toEqual(['yup']);
    }, 50000);
});

const getConsoleLinesFromDockerComposeStdOut = (containerName: string, stdout: string) => {
    const key = `${containerName}-1`;
    const toSearch = `${key}  | `;
    const lines = stdout.split('\n');

    return lines.filter(l => l.includes(toSearch)).map(l => l.split(toSearch)[1]);
}

// make artifact downloading mock
// so you can test everything
// make it so you can compile things from `npm run build-app-for-test (test file name)`
// and make it so the test itself can populate those source files with strings during the test

// use fullcircle to test latest releases
// publish the on npm
