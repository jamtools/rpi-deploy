import testDataNoReleases from '../src/packages/github_releases/testdata/no_releases.json';
import testDataFirstRelease from '../src/packages/github_releases/testdata/first_release.json';
import testDataSecondRelease from '../src/packages/github_releases/testdata/second_release.json';

export const TESTDATA = {
    testDataNoReleases,
    testDataFirstRelease: {
        ...testDataFirstRelease,
        status: 200 as const,
    },
    testDataSecondRelease: {
        ...testDataSecondRelease,
        status: 200 as const,
    },
};
