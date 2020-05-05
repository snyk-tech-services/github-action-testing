# Github actions Boilerplace for Snyk Tech Services

Add Circle + Snyk badges here

Working on this.

## Usage

Public github action makes it very easy to use. 
In your repo:
1. Add your github token as a secret
2. Create .github/workflows/main.yaml with the following

```
on: 
  pull_request:
      types: [opened]

jobs:
  snyk_fix_propagate:
    runs-on: ubuntu-latest
    name: Snyk post processing
    steps:
    - name: Fix propagation
      id: snyk-job
      uses: snyk-tech-services/github-actions-snyk-boilerplate@vX
      with:
        myToken: ${{ secrets.ghToken }}
```
        

Once there, any newly opened PR will trigger your logic.

### Optional Action Inputs to override default values
- `branchPattern` - The branch pattern (by default to `whatever you want`) to filter on upon PR opening to then trigger this logic.