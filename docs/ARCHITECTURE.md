# Architecture

This document provides a quick architecture overview for developer onboarding.

## Overview

This project is a Nuxt starter connected to Roadiz. Routing is dynamic and the
`app/pages/[...slug].vue` page resolves content via a Roadiz web response.

Main flow:

```
HTTP request
  -> Nuxt route ([...slug].vue)
    -> useRoadizWebResponse(route.path)
      -> Roadiz web response (data + meta + headers)
        -> render components
```

## Folder structure

```
app/
  pages/        Nuxt routes (catch-all for Roadiz)
  components/   Shared Vue components (V prefix)
  blocks/       Roadiz block components (globally registered)
  assets/       SCSS, icons, story fixtures
server/         Nitro server API and story assets
i18n/           Locales and config
docs/           Project documentation (architecture, guidelines, contributing)
```

## Pages and routing

- `app/pages/[...slug].vue` is the main route. Roadiz decides the content.
- `defineI18nRoute(false)` disables i18n routes for this page because Roadiz owns the URL.
- If the web response URL does not match the current route, a 301 redirect is applied.

## Roadiz blocks

Roadiz blocks components are located into `app/blocks` and are imported globally.

## UI stories

Stories are exposed on `/_stories` and are based on `*.stories.vue` files.
The default layout is required for display.

## i18n

- Module: `@nuxtjs/i18n`
- Locales: `i18n/locales/nuxt.<locale>.json`
- Source: Xilofone via `pnpm xilo`
- At the beginning of a project, import the translation files into Xilofone before running `pnpm xilo`
- Docs: https://i18n.nuxtjs.org/

## Images

- Module: `@nuxt/image`
- Provider: Intervention Request
- Docs: https://image.nuxt.com/
- Required env variables:
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_BASE_URL`
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_NO_PROCESS_BASE_URL`
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_IMAGES_PATH`

## SVG

Import an SVG as a Vue component:

```vue
<script setup lang="ts">
import IconCheck from '~/assets/images/icons/check.svg?component'
</script>

<template>
    <IconCheck />
</template>
```

For icons, use `VIcon` with assets in `app/assets/images/icons`.

## SEO, sitemap, robots

- `@nuxtjs/sitemap` generates the sitemap from `pages/` and `/api/sitemap`.
- `@nuxtjs/robots` configures the robots file.
- SEO meta comes from Roadiz data.

## Monitoring

- Sentry is configured via `NUXT_PUBLIC_SENTRY_DSN`.

## API

The application connects to a Roadiz API via `NUXT_PUBLIC_API_URL`.

When the Node SSR process and the browser live in different network planes, set `NUXT_SERVER_API_URL` so SSR requests use a different URL than the browser. This happens in two common scenarios:

**Local development** — both the API and Nuxt run in Docker, but the browser runs on the host machine:
```dotenv
# Browser reaches the API through the exposed Docker port
NUXT_PUBLIC_API_URL=http://localhost:8080
# Node SSR reaches the API directly inside the Docker network
NUXT_SERVER_API_URL=http://api:8080
```

**Cloud/Kubernetes** — keep SSR traffic inside the cluster network:
```dotenv
NUXT_PUBLIC_API_URL=https://api.example.com
NUXT_SERVER_API_URL=http://api.internal
```

When `NUXT_SERVER_API_URL` is absent, both SSR and browser use `NUXT_PUBLIC_API_URL`. The server URL is never exposed to the client bundle.

> **Warning:** `NUXT_SERVER_API_URL` must only be used for data fetching. Never use it to build URLs rendered in HTML (image `src`, anchor `href`, etc.): server and client would produce different values, causing Vue hydration mismatches.

## Runtime config and .env variables

Public values are exposed via `runtimeConfig.public` in `nuxt.config.ts`.
Common variables:

- Site: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_SITE_ENV`
- API: `NUXT_PUBLIC_API_URL`, `NUXT_PUBLIC_API_ENDPOINT_PREFIX`
- Images: `NUXT_PUBLIC_INTERVENTION_REQUEST_*`
- i18n: `XILOFONE_*`
- Sentry: `NUXT_PUBLIC_SENTRY_DSN`
- Analytics: `NUXT_PUBLIC_MATOMO_URL`, `NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`
- Captcha: `NUXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY`, `NUXT_PUBLIC_RECAPTCHA_SITE_KEY`,
  `NUXT_PUBLIC_HCAPTCHA_SITE_KEY`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY`

The base template is in `.env.sample`.

## Cache, headers, and security

- `@rezo-zero/nuxt-cache-control` manages cache-control headers.
- Cache tags are sent by Roadiz and exposed via `useCacheTags`.
- `nuxt.config.ts` applies a base CSP and security headers.

## Maintenance

Maintenance mode is a dedicated build that ignores most pages and ships without JS.

```bash
pnpm generate:maintenance
```
