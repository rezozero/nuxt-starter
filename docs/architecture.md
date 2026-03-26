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

## Pages and routing

- `app/pages/[...slug].vue` is the main route. Roadiz decides the content.
- `defineI18nRoute(false)` disables i18n routes for this page because Roadiz owns the URL.
- If the web response URL does not match the current route, a 301 redirect is applied.

## Components and structure

Components are organized with atomic design:

- `app/components/atoms`
- `app/components/molecules`
- `app/components/organisms`
- `app/components/blocks`

Blocks are imported globally with the `.global.vue` suffix to avoid including stories
in production bundles.

## UI stories

Stories are exposed on `/_stories` and are based on `*.stories.vue` files.
The default layout is required for display.

## i18n

- Module: `@nuxtjs/i18n`
- Locales: `i18n/locales/nuxt.<locale>.json`
- Source: Xilofone via `pnpm xilo`

## Images

- Module: `@nuxt/image`
- Provider: Intervention Request
- Required env variables:
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_BASE_URL`
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_NO_PROCESS_BASE_URL`
  - `NUXT_PUBLIC_INTERVENTION_REQUEST_IMAGES_PATH`

## SEO, sitemap, robots

- `@nuxtjs/sitemap` generates the sitemap from `pages/` and `/api/sitemap`.
- `@nuxtjs/robots` configures the robots file.
- SEO meta comes from Roadiz data.

## Cache, headers, and security

- `@rezo-zero/nuxt-cache-control` manages cache-control headers.
- Cache tags are sent by Roadiz and exposed via `useCacheTags`.
- `nuxt.config.ts` applies a base CSP and security headers.

## Maintenance

Maintenance mode is a dedicated build that ignores most pages and ships without JS.

Command:

```bash
pnpm generate:maintenance
```

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
