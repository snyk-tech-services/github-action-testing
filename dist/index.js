"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github = require('@actions/github');
const core = require('@actions/core');
async function runAction() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    try {
        const ghToken = core.getInput('myToken');
        // const snykFixBranchPattern = core.getInput('branchPattern')
        const payload = github.context.payload;
        const ORGANIZATION = payload.organization.login;
        const REPO = payload.pull_request.base.repo.name;
        const BRANCH = payload.pull_request.head.ref;
        const DIFFURL = payload.pull_request.diff_url;
        //`https://patch-diff.githubusercontent.com/raw/mtyates/puppet_webapp/pull/3.diff`
        // if(BRANCH.startsWith(snykFixBranchPattern)) {    
        //     // DO Whatever
        // }
        console.log(payload);
        const octokit = new github.GitHub(ghToken);
        const suites = octokit.checks.listSuitesForRef({
            ORGANIZATION,
            REPO,
            BRANCH
        });
        console.log(suites);
    }
    catch (err) {
        console.log(err);
    }
}
runAction();
//# sourceMappingURL=index.js.map