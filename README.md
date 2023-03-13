# nuxt-starter
Starter template for Nuxt project

- [Project Setup](#project-setup)
- [Build Setup](#build-setup)
- [Test docker setup](#test-docker-setup)
- [Configure Roadiz API](#configure-roadiz-api)
    - [Required modules](#required-modules)
    - [Runtime configuration](#runtime-configuration)
    - [Dynamic sitemap configuration](#dynamic-sitemap-configuration)
    - [Dynamic page data based on request.path](#dynamic-page-data-based-on-requestpath)
- [Response uniqueness](#response-uniqueness)
    - [Cache middleware](#cache-middleware)
- [Simplified analytics using *Plausible*](#simplified-analytics-using-plausible)
- [Define an application-wide timezone](#define-an-application-wide-timezone)

## Project Setup

Here are the steps to begin a new project using *rezozero/nuxt-starter*:

```bash
# Create a new directory for your project
mkdir my-new-project; cd my-new-project;

# Clone Nuxt Starter in new folder
git clone https://github.com/rezozero/nuxt-starter.git .

# Remove starter git history
rm -rf .git

# Edit project package.json with project name
nano package.json

# Init git repository
git init -b main

# Add all existing files
git add --all

# create first commit on *main* branch before initializing Git Flow
git commit -m 'chore: First commit'

# Initialize Git flow 
git flow init

# You should be on *develop* now
# Add you own remote repository
git remote add origin git@your-git-service:my-new-project.git

# Push all branches
git push --all
```

## Build Setup

```bash
# Copy sample environment file to .env
cp .env.sample .env

# install dependencies and Husky git hooks
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

This starter uses *Husky* to run linting and tests before each commit. You can use `yarn lint-fix` to automatically fix linting errors.
If some errors are not fixed, you will need to fix them manually before being able to push your code.

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
        apiKey: process.env.API_KEY,
        allowClientPreview: toBoolean(process.env.API_ALLOW_CLIENT_PREVIEW),
        debug: toBoolean(process.env.API_DEBUG),
        origin: process.env.API_ORIGIN
    },
    assetsUrl: process.env.ASSETS_URL,
    baseUrl: process.env.BASE_URL
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

These content are used in `_.vue` page, in `asyncData()` method. Then `asyncData` will perform some checks on 
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
// src/pages/_.vue
export default mixins(Page).extend({
    // ...
    middleware: httpCache({
        's-maxage': 30,
        'stale-while-revalidate': true,
    }),
})
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

## Define an application-wide timezone

Make sure you define a timezone and use `$i18n` preset when formatting dates and time with `$d` method:

```js
// nuxt.config.js
//
// Define global app timezone here because i18n config is not editable at runtime
const defaultTimeZone = 'Europe/Paris'
const defaultLocale = 'fr'
const fallbackLocale = 'fr'
```

If you are using an `$i18n` preset without timezone, time will be formatted using **user-browser timezone**.
You can test it in _Chrome Dev Tool > ... > Sensors > Location_.  

If you do not want to use `$d` method or a *vueI18n* preset, `$config.defaultTimeZone` 
will hold your current timezone configuration, then you can use Vanilla JS API to format your date:

```js
(new Intl.DateTimeFormat(
  this.$i18n.locale, 
  {
    timestyle: 'long', 
    timeZone: this.$config.defaultTimeZone
  }
)).format(new Date())
```

Or *vueI18n*:

```js
this.$i18n.d(
  new Date(), 
  {
    timestyle: 'long', 
    timeZone: this.$config.defaultTimeZone
  }
)
```

Sometimes, using user browser timezone may be a wanted behaviour: to display an interactive date-time specific to user, or
displaying live or/and online events date-time that will occur world-wide (i.e. a Youtube live event). 

Never alter `Date` objects themselves, always `format` them using the wanted timezone. Or this could lead to unwanted
behaviours especially if you are using `Date` objects to filter time-based API items.

## Use InterventionRequest

For testing purpose (e.g. VImage component stories), you can use InterventionRequest locally.

```bash
$ docker-compose up intervention
```
