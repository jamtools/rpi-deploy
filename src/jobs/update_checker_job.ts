import fs from 'fs';

import {GithubReleaseFetcher} from '../packages/github_releases/release_fetcher';
import {RunnerManager} from '../packages/runner_management/runner_manager';

const pathToRepoConfigFile = 'repo_config.json';

const DEFAULT_INTERVAL = 1000 * 60 * 60; // 1 hour

export class UpdateCheckerJob {
    private directory: string;
    private runnerManager: RunnerManager;

    private interval: number;
    private timeout: NodeJS.Timeout | null = null;

    constructor(releaseFetcher: GithubReleaseFetcher, directory: string, assetName: string, interval?: number) {
        this.directory = directory;
        this.runnerManager = new RunnerManager(releaseFetcher, directory, assetName);
        this.interval = interval || DEFAULT_INTERVAL;
    }

    public start = async () => {
        const files = await fs.promises.readdir(this.directory);
        if (!files.includes(pathToRepoConfigFile)) {
            throw new Error('no repo config file found');
        }

        this.run();

        this.timeout = setInterval(this.run, this.interval);
    }

    public close = async () => {
        if (this.timeout) {
            clearInterval(this.timeout);
        }

        await this.runnerManager.close();
    }

    run = async () => {
        this.runnerManager.run();
    }
}
