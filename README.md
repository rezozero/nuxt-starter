# Nuxt starter

Nuxt starter for Roadiz-driven sites and platforms, with UI stories, i18n, optimized images, and a production-ready Docker setup.

## Stack

- **Nuxt 4 / Vue 3 / TypeScript** — SSR
- **CSS Modules + SCSS** — no utility framework; only a few global helpers (e.g. `.visually-hidden`)
- **@roadiz/types** — CMS content types
- **pnpm** — package manager
- **ESLint** — linting and formatting (no Prettier)

Key modules: `@nuxt/image` · `@nuxtjs/i18n` · `@rezo-zero/nuxt-stories` · `@nuxtjs/sitemap` · Sentry

## Prerequisites

- Node `24.21.0`
- PNPM `11.5.1` (via `corepack enable pnpm`)

## Quick start

1) Duplicate `.env.sample` into `.env` — every variable is documented in it.
2) Export the private npm registry credentials required by `@events-api/javascript-sdk` (values in Bitwarden), then install dependencies:

```bash
export EVENTS_API_NPM_REGISTRY_URL=…
export EVENTS_API_NPM_TOKEN=…
```


```bash
pnpm install
```

3) Start the dev server:

```bash
pnpm dev
```

4) Open `http://localhost:3000`.
5) (Optional) Start stories — `docker compose up` provides the image server they need:

```bash
cp stories/.env.sample stories/.env
docker compose up -d
pnpm stories
```

## Architecture in 2 minutes

- Dynamic routing via Roadiz in `app/pages/[...slug].vue`.
- Pages come from a Roadiz web response and render through global blocks.
- Stories are available on `/_stories` to preview components.
- Maintenance page is generated via a dedicated build.

Full details, including the folder structure: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Environment (.env)

Copy `.env.sample` to `.env`: every variable is listed and commented there. Naming rules: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Commands

```bash
pnpm dev            # start dev server
pnpm stories        # start UI stories (requires stories/.env)
pnpm build          # production build
pnpm generate       # static generation
pnpm preview        # preview the production build
pnpm lint           # lint all (lint:js + lint:css)
pnpm lint-fix       # lint and auto-fix
pnpm test           # unit tests (Vitest)
pnpm xilo           # fetch translations from Xilofone
```

## Docker build

With Compose, set the variables in `.env` or in the shell, then:

```bash
docker compose -f compose.prod.yml build
```

Node build:

```bash
docker buildx build --target node-prod \
    --secret id=npm_token,env=EVENTS_API_NPM_TOKEN \
    --secret id=npm_registry_url,env=EVENTS_API_NPM_REGISTRY_URL \
    -t nuxt-starter/node .
```

Full build with bake:

```bash
docker buildx bake \
    --set '*.secrets=id=npm_token,env=EVENTS_API_NPM_TOKEN' \
    --set '*.secrets=id=npm_registry_url,env=EVENTS_API_NPM_REGISTRY_URL'
```

## Documentation

| File | What it covers |
|------|----------------|
| [`AGENTS.md`](./AGENTS.md) | Instructions for AI coding agents (imported by [`CLAUDE.md`](./CLAUDE.md)) |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Branches, commit conventions, PR/MR checklist |
| [`SECURITY.md`](./SECURITY.md) | How to report a vulnerability |
| [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) | Frontend principles and code rules: DOM, CSS Modules, accessibility, Vue, images |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technical architecture: folder structure, routing, blocks, cache, env variables |
