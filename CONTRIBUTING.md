# How To Contribute

For prerequisites and setup, see [`README.md`](./README.md). Code rules are in [`docs/GUIDELINES.md`](./docs/GUIDELINES.md).

## Branches

### This starter

The `main` branch is protected: all changes go through a pull request targeting `main`.

### Client projects built from the starter

Client projects follow the agency git flow (see `docs/methodologie/01-git-flow` in the `Rezo-Zero/documentation` repository):

- `main` and `develop` are protected. Merge requests target `develop`; only `hotfix/*` branches start from `main`.
- Branches linked to an issue are named `{workItemId}-short-slug` (e.g. `123-fix-sso-login`).
- `release/*` and `hotfix/*` are opened as a draft MR, then finished locally (`git flow … finish -s`, signed tag) — never with the Merge button.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/), in English and in the imperative mood. The changelog is generated from them (`git cliff`): a message outside the convention does not appear in it.

`fix:` and `feat:` are for actual code changes. For typos or documentation, use `docs:` or `chore:` instead: `fix: typo` → `docs: fix typo`.

## Pull / merge requests

- The PR/MR title follows the commit convention: it becomes the commit message, as we always **squash and merge**.
- One PR/MR = one topic. Revert unrelated whitespace or formatting changes.
- Mention the issues it fixes or the story it implements (`Closes #123`).
- It is reviewed by someone other than its author — whether written by a human or an AI agent.
- CI must be green before merging.

## Checks before opening a PR/MR

- `pnpm lint` (also run by the pre-push hook) and `pnpm test`
- Desktop and mobile check of the change
- Accessibility (RGAA): contrast, visible focus, keyboard navigation, status messages, 200% zoom, 320px width
- New or changed translation keys reported in Xilofone

## Tooling

- **Package manager:** [pnpm](https://pnpm.io/)
- **Linting and formatting:** ESLint and Stylelint — run `pnpm lint-fix` to auto-fix. Prettier is not used; disable it in your editor to avoid conflicts.
