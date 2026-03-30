# AI Context — Nuxt Starter

This file captures project context, conventions, and best practices.
It is a guide for human contributors and AI assistants.

## Purpose and scope

- Purpose: provide a coherent, maintainable, modular Nuxt base.
- Scope: UI, assets, i18n, images, stories, monitoring, sitemap, docker.
- Expectations: follow existing conventions and avoid unrelated changes.

## Project snapshot

- Framework: Nuxt
- Dev/build: Vite
- Styles: SCSS
- Scripts: TypeScript
- Package manager: pnpm
- Code quality: ESLint / Stylelint (no Prettier)

Key modules:
- i18n: nuxt-i18n
- Images: @nuxt/image + Intervention Request provider
- SVG: vite-svg-loader, @nuxt/icon
- Stories: @rezo-zero/nuxt-stories
- Monitoring: Sentry
- SEO: @nuxtjs/sitemap

## Architecture

- Components live under `app/components`
- Prefer small, focused, reusable components.
- Follow established patterns before introducing new ones.

## Naming conventions

- Component filenames use PascalCase (match existing components).
- Vue component names follow their filenames.
- SCSS partials use a leading underscore when appropriate.
- Keep names descriptive and aligned with the atomic level.

## Design system

- Reuse existing tokens, variables, and mixins before creating new ones.
- Keep typography, spacing, and color decisions consistent across components.
- Add new tokens only when a real gap exists and document them near usage.

## Coding standards

- ESLint handles linting and formatting.
- Prettier is disabled for this project.
- Avoid global reformatting unrelated to a change.

## Documentation and comments

- All documentation files and code comments must be written in English.

Useful commands:
- Lint all: `pnpm lint`
- Lint JS/TS: `pnpm lint:js`
- Lint styles: `pnpm lint:css`
- Lint fix: `pnpm lint-fix`

## Workflow

- Setup: `pnpm install`
- Dev: `pnpm dev`
- Stories: `pnpm dev:stories` (requires `.env.stories`)
- Build: `pnpm build`
- Preview: `pnpm preview`

## i18n

- Translations come from Xilofone.
- Required env vars live in `.env`.
- Fetch: `pnpm xilo`

## Images and SVG

- Images: @nuxt/image with Intervention Request provider.
- SVG components: `vite-svg-loader`.
- Icons: `@nuxt/icon` via `VIcon`.

## Monitoring and SEO

- Sentry for error monitoring (env var `SENTRY_DSN`).
- Sitemap generated from `pages/`, dynamic routes via `/api/sitemap`.

## Contribution

- `main` is protected; PRs are required.
- Conventional Commits for messages.
- One topic per PR; avoid unrelated changes.

## AI guidance (Do / Don't)

Do:
- Follow existing conventions and repo structure.
- Explain changes and the reason behind them.
- Limit edits to files involved in the task.

Don't:
- Modify or commit secrets (`.env`, credentials).
- Introduce global reformatting.
- Add new conventions without justification.
