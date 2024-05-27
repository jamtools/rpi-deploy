import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

const DEBUG = false;

describe('yeah', () => {
    it('should work', async () => {
        let out = '';
        out = (await execAsync('npm run build')).stdout;
        if (DEBUG) console.log(out);

        out = (await execAsync('npm run dist-pkg')).stdout;
        if (DEBUG) console.log(out);

        out = (await execAsync('docker compose build', {cwd: './docker'})).stdout;
        if (DEBUG) console.log(out);

        out = (await execAsync('docker compose up', {cwd: './docker'})).stdout;
        if (DEBUG) console.log(out);

        const lines = getConsoleLinesFromDockerComposeStdOut('pi', out);
        expect(lines).toEqual(['yup']);
    }, 50000);
});

const getConsoleLinesFromDockerComposeStdOut = (containerName: string, stdout: string) => {
    const key = `docker-${containerName}-1`;
    const toSearch = `${key}  | `;
    const lines = stdout.split('\n');

    return lines.filter(l => l.startsWith(toSearch)).map(l => l.substring(toSearch.length));
}
