import fs from 'fs';

import {ReleaseResponse, GithubReleaseFetcher} from './release_fetcher';

setTimeout(() => {
    main();
});

const main = async () => {
    // main_fetchFromGithub();

    // main_readFromStoredFile();

    // main_writeStoredFile();

    main_checkLatestRelease();
};

const main_checkLatestRelease = async () => {
    const latest = await getLastFetchedRelease();
    console.log(latest);


    const newRelease = await main_readFromStoredFile();

    if (latest) {
        if (newRelease.data.created_at === latest.data.created_at) {
            console.log('same release found. no update needed');
            return;
        }

        // save over last release
        // saveFetchedRelease(newRelease);

        console.log('updating existing application');

        // TODO: kill currently running program

    } else {
        console.log('deploying initial application');
    }

    // create runner folder
    // put github release assets into the runner folder
    // run the index script in the release folder
};

const main_writeStoredFile = async () => {
    const data = await main_readFromStoredFile();
    await saveFetchedRelease(data);
};

const saveFetchedRelease = async (data: ReleaseResponse) => {
    const lastReleaseFetchedFileName = './workspace/last_fetched_release.json';
    const backupReleaseFetchedFileName = `./workspace/last_fetched_release.json.bak-${new Date().getTime()}`;

    // backup currently stored data
    try {
        await fs.promises.rename(lastReleaseFetchedFileName, backupReleaseFetchedFileName);
    } catch (e) {
        const message = (e as Error).message || '';
        if (!message.includes('no such file or directory')) {
            throw e;
        }
    }

    const toSaveString = JSON.stringify(data);
    await fs.promises.writeFile(lastReleaseFetchedFileName, toSaveString);
};

const main_readFromStoredFile = async () => {
    const testdataFirstRelease = await fs.promises.readFile('./src/packages/github_releases/testdata/second_release.json');
    const releaseData: ReleaseResponse = JSON.parse(testdataFirstRelease.toString());

    return releaseData;

    // const latest = await getLastFetchedRelease();
    // if (latest) {
    //     console.log('release file found ' + latest.data.name);
    // } else {
    //     console.log('no release file found');
    // }
};

const getLastFetchedRelease = async (): Promise<ReleaseResponse | null> => {
    const lastReleaseFetchedFileName = './workspace/last_fetched_release.json';
    try {
        const storedReleaseInfoString = await fs.promises.readFile(lastReleaseFetchedFileName);
        const storedReleaseInfo: ReleaseResponse = JSON.parse(storedReleaseInfoString.toString());
        return storedReleaseInfo;
    } catch (e) {
        const message = (e as Error).message || '';
        if (message.includes('no such file or directory')) {
            return null;
        }

        throw e;
    }
}

const main_fetchFromGithub = async () => {
    const client = new GithubReleaseFetcher();
    client.getLatestRelease('jamtools', 'github-releases-test').then(d => {
        fs.promises.writeFile('data.json', JSON.stringify(d));
    }, d => {
        fs.promises.writeFile('error.json', JSON.stringify(d));
    });
};
