# nuxt-starter
Starter template for Nuxt project

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Test docker setup

```bash
# build for production
$ yarn build

$ docker-compose build
$ docker-compose up -d
```

## Configure Roadiz API

Add required modules configuration:

```js
// nuxt.config.js
// Modules: https://go.nuxtjs.dev/config-modules
modules: [
    // https://github.com/roadiz/nuxt-module#configuration
    '@roadiz/nuxt-module',
    // https://sitemap.nuxtjs.org/guide/setup
    '@nuxtjs/sitemap',
]
```

Provide runtime config to be able to change configuration values between
environments. Do not use `dotenv` values elsewhere in `nuxt.config.js` or it will be
hard-coded in build time.

```js
// nuxt.config.js
// https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
publicRuntimeConfig: {
    roadiz: {
        baseUrl: process.env.API_URL,
        apiKey: process.env.API_KEY,
        preview: toBoolean(process.env.API_PREVIEW),
        debug: toBoolean(process.env.API_DEBUG),
        origin: process.env.API_ORIGIN,
    },
    assetsUrl: process.env.ASSETS_URL,
    baseUrl: process.env.BASE_URL,
}
```

### Sitemap

```js
// nuxt.config.js
import { sitemapOptions } from './src/utils/roadiz'
// https://sitemap.nuxtjs.org/guide/setup
sitemap: () => sitemapOptions(['fr', 'en'])
```
