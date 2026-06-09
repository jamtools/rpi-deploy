import {exec} from 'child_process';
import {promisify} from 'util';

import {fullcircle, TestHarness, FullCircleInstance} from 'fullcircle/dist/harness';
import {ReleaseResponse} from '../src/packages/github_releases/release_fetcher';

import {TESTDATA} from './testdata';

const execAsync = promisify(exec);

const DEBUG = true;

describe('yeah', () => {
    let fc: FullCircleInstance;
    let harness: TestHarness;

    beforeEach(async () => {
        fc = await fullcircle({
            listenAddress: 1337,
            defaultDestination: 'api.github.com',
            verbose: false,
        });

        harness = fc.harness('');
    });

    afterEach(async () => {
        await fc.close();
        await harness.closeWithAssertions();
    });

    it('should work', async () => {
        let out: Awaited<ReturnType<typeof execAsync>>;

        out = await execAsync('npm run build');
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        out = await execAsync('npm run dist-pkg');
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        out = await execAsync('docker compose build', {cwd: './docker'});
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        harness.get<undefined, ReleaseResponse>('/repos/jamtools/github-releases-test/releases/latest', (req, res) => {
            res.json(TESTDATA.testDataFirstRelease);
        });

        // TODO: mock asset url download

        out = await execAsync('docker compose up', {cwd: './docker', env: {GITHUB_API_URL: 'http://host.docker.internal:1337'}});
        if (DEBUG) {console.log(out.stdout); console.log(out.stderr);}

        const lines = getConsoleLinesFromDockerComposeStdOut('pi', out.stdout);
        expect(lines).toEqual([
            'new release found',
            // 'downloading release asset',
            // 'yup',
        ]);
    }, 50000);
});

const getConsoleLinesFromDockerComposeStdOut = (containerName: string, stdout: string | Buffer) => {
    const key = `${containerName}-1`;
    const toSearch = `${key}  | `;
    const lines = stdout.toString().split('\n');

    return lines.filter(l => l.includes(toSearch)).map(l => l.split(toSearch)[1]).filter(Boolean);
}

// make artifact downloading mock
// so you can test everything
// make it so you can compile things from `npm run build-app-for-test (test file name)`
// and make it so the test itself can populate those source files with strings during the test

// use fullcircle to test latest releases
// publish the on npm
