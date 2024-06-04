import {Octokit, RestEndpointMethodTypes} from '@octokit/rest';

export type ReleaseResponse = RestEndpointMethodTypes['repos']['getLatestRelease']['response'];

export class GithubReleaseFetcher {
    client: Octokit;

    constructor(url?: string) {
        this.client = new Octokit({
            baseUrl: url,
        });
    }

    getLatestRelease = async (owner: string, repo: string): Promise<ReleaseResponse> => {
        return this.client.repos.getLatestRelease({
            owner,
            repo,
        });
    }
}
