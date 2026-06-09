# Nuxt starter

Nuxt starter for Roadiz-driven sites and platforms, with UI stories, i18n, optimized images, and a production-ready Docker setup.

## Stack

- **Nuxt 4 / Vue 3 / TypeScript** — SSR
- **CSS Modules + SCSS** — no Tailwind, no global utility classes
- **@roadiz/types** — CMS content types
- **pnpm** — package manager
- **ESLint** — linting and formatting (no Prettier)

Key modules: `@nuxt/image` · `@nuxtjs/i18n` · `@rezo-zero/nuxt-stories` · `@nuxtjs/sitemap` · Sentry

## Prerequisites

- Node `24.14.1`
- PNPM `11.5.1`

## Quick start

1) Duplicate `.env.sample` into `.env` — required variables are listed in the Environment section below.
2) Install dependencies:

```bash
pnpm install
```

3) Start the dev server:

```bash
pnpm dev
```

4) Open `http://localhost:3000`.
5) (Optional) Start stories:

```bash
docker compose up -d
pnpm stories
```

## Environment (.env)

- `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_SITE_ENV`
- `NUXT_PUBLIC_API_URL` (if using a remote API)
- `NUXT_PUBLIC_INTERVENTION_REQUEST_*` for the image provider
- `XILOFONE_*` if you want to fetch translations

Full list and usage details: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Commands

```bash
pnpm dev            # start dev server
pnpm stories        # start UI stories (requires .env.stories)
pnpm build          # production build
pnpm lint           # lint all
pnpm lint-fix       # lint and auto-fix
pnpm xilo           # fetch translations from Xilofone
```

## Docker build

Node build:

```bash
docker buildx build --target node-prod -t nuxt-starter/node .
```

Full build with bake:

```bash
docker buildx bake
```

## Documentation

| File | What it covers |
|------|----------------|
| [`CLAUDE.md`](./CLAUDE.md) | Code conventions, AI guidance (auto-loaded by Claude Code) |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | PR workflow, commit conventions, linting |
| [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) | Frontend code rules: DOM, CSS Modules, accessibility, Vue, images |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technical architecture: routing, blocks, cache, env variables |
