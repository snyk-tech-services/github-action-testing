const github = require('@actions/github')
const core = require('@actions/core')


const waitForCompletedStatus = (octokit: any, org: any, repo: any, branch: any, suiteId: number) => {
    return new Promise((resolve,reject) => {
        const interval = setInterval(async () => {
            let suite = await octokit.checks.getSuite({
                owner: org,
                repo: repo,
                check_suite_id: suiteId,
            });
            console.log(suite.data.status)
            if(suite.data.status == 'completed'){
                clearInterval(interval)
                resolve(suite.data.status)
            }
        }, 10000)
    })
    
    
}

async function runAction() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    try{
        const ghToken = core.getInput('myToken');
        // const snykFixBranchPattern = core.getInput('branchPattern')
        
        const payload = github.context.payload
    
        const ORGANIZATION = payload.organization.login
        const REPO = payload.pull_request.base.repo.name
        const BRANCH = payload.pull_request.head.ref
        const DIFFURL = payload.pull_request.diff_url
        //`https://patch-diff.githubusercontent.com/raw/mtyates/puppet_webapp/pull/3.diff`
        
        // if(BRANCH.startsWith(snykFixBranchPattern)) {    
        //     // DO Whatever
        // }
        //console.log(payload)
        const octokit = new github.GitHub(ghToken);
        console.log(ORGANIZATION)
        console.log(REPO)
        console.log(BRANCH)

        const suites = await octokit.checks.listSuitesForRef({
            owner: ORGANIZATION,
            repo: REPO,
            ref: BRANCH
        });
        let suiteId = 0
        suites.data.check_suites.forEach(suite => {
            if(suite.app.slug == 'circleci-checks'){
                suiteId = suite.id
            }
        })
        if(suiteId == 0){
            throw new Error('Could not find check suite to wait for completion')
        }
        let status = await waitForCompletedStatus(octokit, ORGANIZATION,REPO, BRANCH, suiteId)
        console.log(status)
        console.log('done')


    } catch(err) {
        console.log(err)
    }
}

runAction();

export {
    
}
