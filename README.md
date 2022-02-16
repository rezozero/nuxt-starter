# nuxt-starter
Starter template for Nuxt project

* [Build Setup](#build-setup)
* [Test docker setup](#test-docker-setup)
* [Configure Roadiz API](#configure-roadiz-api)
    + [Required modules](#required-modules)
    + [Runtime configuration](#runtime-configuration)
    + [Dynamic sitemap configuration](#dynamic-sitemap-configuration)
    + [Dynamic page data based on request.path](#dynamic-page-data-based-on-requestpath)
* [Response uniqueness](#response-uniqueness)
    + [Cache middleware](#cache-middleware)
* [Simplified analytics using *Plausible*](#simplified-analytics-using-plausible)


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

By default, this starter uses **dynamic routing** with a unique `_.vue` route which calls Roadiz API
using the requested path. This way, you will be able to add / move / delete pages directly for Roadiz backoffice.
Nuxt sitemap is set up using this dynamic routing too, then you'll need to pass `sitemapOptions(['fr', 'en'])` with
at least hard-coded available locales to *sitemap* module options.

Feel free to revert on *static routing* and manually call API in each page `asyncData` method.

### Required modules

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

### Runtime configuration

Provide runtime config to be able to change configuration values between
environments. Do not use `dotenv` values elsewhere in `nuxt.config.js` or it will be
hard-coded in build time.

```js
// nuxt.config.js
import toBoolean from './src/utils/to-boolean'
// https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
publicRuntimeConfig: {
    roadiz: {
        baseURL: process.env.API_URL,
        {
            apiKey: process.env.API_KEY,
            preview: toBoolean(process.env.API_PREVIEW),
            debug: toBoolean(process.env.API_DEBUG),
            origin: process.env.API_ORIGIN,
        }
    },
    assetsUrl: process.env.ASSETS_URL,
    baseUrl: process.env.BASE_URL,
}
```

### Dynamic sitemap configuration

```js
// nuxt.config.js
import { sitemapOptions } from './src/utils/roadiz'
// https://sitemap.nuxtjs.org/guide/setup
sitemap: () => sitemapOptions(['fr', 'en'])
```

### Dynamic page data based on request.path

All the magic happens in [`fetchPage`](https://github.com/rezozero/nuxt-starter/blob/main/src/store/actions.ts#L42) store action. 
This method is responsible for populating **first SSR request** data with a `PageResponse` interface containing:

- Current page and block data
- Alternate links (translations) for current request

These content are used in `_.vue` layout, in `asyncData()` method. Then `asyncData` will perform some checks on 
real request `url` and will redirect users if resource path changed.

`fetchPage` method can be used to fetch extra data according to your page `@type`. For example, fetch a blog-post collection
if your current page is a `BlogPostListing`, thus you'll be able to extend `PageResponse` adding your own additional data.

`fetchPage` is first called from `nuxtServerInit` where other important data can be collected from Roadiz API:

- Common content response (menus, SEO content, footer content)

All these data are stored in Vuex Store to be accessible from any Vue component.

## Response uniqueness

Make sure you do not introduce random Vue components identifiers in order to keep a unique ETag for all requests
on a given page.

To test your response uniqueness, generate multiple md5 checksums from a given page:
```shell
curl -q http://192.168.1.24:3000 | md5sum
```

If the md5 sum is the same, your response will be cacheable by Varnish or any other reverse proxy caches. If the md5 sum 
is different each time, check your component to track where you introduced randomness or incremented variables.

### Cache middleware

We added a server middleware to allow a very TTL on your SSR responses and make them cacheable for a reverse-proxy
cache, such as Varnish. Feel free to update the `s-maxage` header value to the best value for your project.

```js
// nuxt.config.js
serverMiddleware: ['@middleware/cache.ts']
```

Notice that there is no invalidation tool built-in so keep TTL as low as possible to see your backoffice changes not to
late. Nuxt response TTL is set up only to address traffic pikes. Make sure your Roadiz API is served behind *Varnish* in the
first place to allow long TTL and cache-tag invalidation on your content API. Varnish in front of your Nuxt SSR is therefore
optional.

## Simplified analytics using *Plausible*

[Plausible](https://plausible.io/) does not require any GDPR cookie consent and can be self-hosted.

This starter embeds a *Plausible* module ready to go which listens to page views and can be configured with a self-hosted
domain. See https://github.com/moritzsternemann/vue-plausible#integration for further integration with `trackEvent()` for
example.

```js
// nuxt.config.js
publicRuntimeConfig: {
    plausible: {
        domain: process.env.PLAUSIBLE_DOMAIN,
        apiHost: process.env.PLAUSIBLE_API_HOST || 'https://plausible.io',
    },
}
```
