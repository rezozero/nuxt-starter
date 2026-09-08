# How To Contribute

The `main` branch is protected, and all changes must be made through pull requests.

For prerequisites and setup, see [`README.md`](../README.md).

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

Please avoid including multiple unrelated features or fixes in a single PR — one PR should do one thing only. If your editor introduced unrelated whitespace or formatting changes, revert them before submitting.

## Checks expected in PRs

- `pnpm lint`
- `pnpm lint:js` (if you touched JS/TS/Vue)
- `pnpm lint:css` (if you touched styles)

## Tooling

- **Package manager:** [pnpm](https://pnpm.io/)
- **Linting and formatting:** ESLint — run `pnpm lint-fix` to auto-fix. Prettier is disabled; disable it in your editor if installed to avoid conflicts.
