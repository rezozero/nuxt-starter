# AGENTS.md

Instructions for AI coding agents working on this repository. Humans: start with [`README.md`](./README.md).

Nuxt starter (SSR) connected to a Roadiz CMS — client projects start from it. Stack and versions: `package.json`, `nuxt.config.ts`. No Tailwind, no Prettier.

## Commands

Scripts are in `package.json`. Non-obvious ones:

- `pnpm xilo` overwrites `i18n/locales/nuxt.*.json` from Xilofone (see Translations).
- `pnpm stories` needs `stories/.env` and `docker compose up` (image server).

## Read before coding

- [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) — frontend rules (principles, DOM, CSS Modules, SCSS, accessibility, i18n). Follow it strictly.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — routing, blocks, API, env variables, cache.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — branches, commits, PR/MR checklist.
- Agency reference: `docs/fabriquer/03-frontend` in the `Rezo-Zero/documentation` GitLab repository.

## Frontend principles

- **Native first**: use browser features (`<dialog>`, Popover API, `<details>`, native form validation, modern CSS) before writing JS.
- **Mobile first**: base styles target mobile, `@include media('>=md')` adds on top.
- **Style in CSS, not JS**: nothing that depends on client-side measurements — it breaks SSR and causes layout shift.
- **Minimal DOM**: no wrapper without a semantic or layout reason.
- **Inferred types**: let TypeScript infer; annotate only contracts (props, emits, public signatures, empty refs). No `any`.

## Non-negotiable rules

- Before creating a component, search `app/components/` and the stories for an existing `V*` one; extend it through its `--v-*` custom properties. Same for tokens and mixins in `app/assets/scss/`.
- Styles follow `docs/GUIDELINES.md` §3–4 (CSS Modules naming, SCSS rules).
- No hardcoded UI strings — always i18n keys.
- Figma is the only source for designs: if a value is missing, ask instead of guessing.
- Accessibility (RGAA) and GDPR are delivery requirements: no third-party resource loaded by the browser without consent, self-hosted fonts.
- Never use `display: none` / `visibility: hidden` on interactive or form elements.
- Never read, modify or commit secrets (`.env`, credentials). Secrets live in Bitwarden; point to the entry instead of asking for the value.
- Code, comments, commit messages and PR titles in English.

## Translations (Xilofone)

Xilofone is the source of truth; `pnpm xilo` regenerates `i18n/locales/nuxt.*.json`. When you add or change a key, edit every `nuxt.*.json` file **and explicitly tell the developer to report the same change in Xilofone**, otherwise it will be overwritten.

## Scope

- Limit edits to files involved in the task; no unrelated reformatting.
- Do not add a new convention without justification.
- On a structural change (new module, convention, env variable, workflow), update the relevant file in `docs/` (and `.env.sample`) in the same change.
- Before handing over: `pnpm lint` and `pnpm test` pass, and the change is checked on desktop and mobile.
