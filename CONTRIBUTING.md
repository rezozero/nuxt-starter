# How To Contribute

The `main` branch is protected, and all changes must be made through pull requests.

## Send a Pull Request

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which allows a changelog to be auto-generated based on the commits.  
Please read the guide through if you aren't familiar with it already.  
Note that `fix:` and `feat:` are for actual code changes (that might affect logic). For typo or document changes, use `docs:` or `chore:` instead:  
`fix: typo` -> `docs: fix typo`

### Making the Pull Request

When sending a pull request, make sure your PR's title also follows the Commit Convention.  

If your PR fixes or resolves existing issues, please make sure you mention them in the PR description.  
  
It's ok to have multiple commits in a single PR; you don't need to rebase or force push for your changes as we will use Squash and Merge to squash the commits into one commit when merging.

In general, please also make sure that there are no unrelated changes in a PR. For example, if your editor has made any changes to whitespace or formatting elsewhere in a file that you edited, please revert these so it is more obvious what your PR changes.   
And please avoid including multiple unrelated features or fixes in a single PR. 
If it is possible to separate them, it is better to have multiple PRs to review and merge separately. In general, a PR should do one thing only.

## Use ESLint

We use ESLint for both linting and formatting.

## No Prettier

Since ESLint is already configured to format the code, there is no need to duplicate the functionality with Prettier.   
To format the code, you can run `pnpm lint-fix` or referring the ESLint section for IDE Setup.

If you have Prettier installed in your editor, we recommend you disable it when working on the project to avoid conflict.

## Package Manager

We use [pnpm](https://pnpm.io/) as our package manager.
