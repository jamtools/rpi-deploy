import {UpdateCheckerJob} from '../../jobs/update_checker_job';
import {GithubReleaseFetcher} from '../../packages/github_releases/release_fetcher';

const workspaceDirectory = process.env.WORKSPACE_DIRECTORY || './workspace';

const assetName = process.env.ASSET_NAME || 'index-macos-arm64';

setTimeout(async () => {
    const client = new GithubReleaseFetcher();
    const job = new UpdateCheckerJob(client, workspaceDirectory, assetName);
    await job.run();
});
