import fs from 'fs';

import {GithubReleaseFetcher, ReleaseResponse} from '../github_releases/release_fetcher';
import {downloadFile} from './download_file';
import {execFile as execFileWithCallback, exec as execWithCallback} from 'child_process';
import {promisify} from 'util';

const execFile = promisify(execFileWithCallback);
const exec = promisify(execWithCallback);

const pathToRepoConfigFile = 'repo_config.json';

type RepoConfig = {
    owner: string;
    repo: string;
}

if ([...process.argv].pop()?.endsWith('runner_manager.ts')) {
    setTimeout(() => {
        const client = new GithubReleaseFetcher();
        const job = new RunnerManager(client, './workspace', 'index-macos-arm64');
        job.run();
        // job.start();
    });
}

export class RunnerManager {
    private releaseFetcher: GithubReleaseFetcher;
    private directory: string;
    private assetName: string;

    private timeout: NodeJS.Timeout | null = null;

    constructor(releaseFetcher: GithubReleaseFetcher, directory: string, assetName: string) {
        this.releaseFetcher = releaseFetcher;
        this.directory = directory;
        this.assetName = assetName;
    }

    public close = async () => {

    }

    private getRepoConfig = async (): Promise<RepoConfig> => {
        const repoConfig = await fs.promises.readFile(`${this.directory}/${pathToRepoConfigFile}`);
        return JSON.parse(repoConfig.toString());
    }

    run = async () => {
        const repoConfig = await this.getRepoConfig();

        const lastFetchedRelease = await this.getLastFetchedRelease();
        const newRelease = await this.releaseFetcher.getLatestRelease(repoConfig.owner, repoConfig.repo);

        const lastData = lastFetchedRelease?.data;
        const newData = newRelease.data;

        if (lastData && newData && lastData.id === newData.id) {
            console.log('Last fetched release is the same as the latest release');
            return;
        }

        if ((lastFetchedRelease && lastFetchedRelease.data.name === newRelease.data.name)) {
            console.log('no new release found');
            return;
        }

        console.log('new release found');

        await this.saveFetchedRelease(newRelease);

        await this.runNewRelease(newRelease, repoConfig);
    }

    private saveFetchedRelease = async (data: ReleaseResponse) => {
        const lastReleaseFetchedFileName = `${this.directory}/last_fetched_release.json`;
        const backupReleaseFetchedFileName = `${this.directory}/last_fetched_release.json.bak-${new Date().getTime()}`;

        // backup currently stored release data
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
    }

    private runNewRelease = async (release: ReleaseResponse, repoConfig: RepoConfig) => {
        const releaseAssets = release.data.assets;

        const runnersDirectory = `${this.directory}/runners`;
        await fs.promises.mkdir(runnersDirectory, {recursive: true});

        const existingRunnerDirs = await fs.promises.readdir(runnersDirectory);
        const runnerDir = `${runnersDirectory}/runner-${existingRunnerDirs.length + 1}`;

        await fs.promises.mkdir(runnerDir);

        await fs.promises.writeFile(`${runnerDir}/release.json`, JSON.stringify(release.data));

        const asset = releaseAssets.find(asset => asset.name === this.assetName);
        if (!asset) {
            throw new Error(`no asset found with name: ${this.assetName}`);
        }

        console.log('downloading release asset');

        const assetPath = `${runnerDir}/${this.assetName}`;
        await downloadFile(asset.browser_download_url, assetPath);
        await exec(`chmod +x ${assetPath}`);

        const execResponse = await execFile(assetPath);
        console.log(execResponse.stdout);
    }

    private getLastFetchedRelease = async (): Promise<ReleaseResponse | null> => {
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
}
