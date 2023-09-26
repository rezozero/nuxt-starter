# Nuxt starter

## Override Nuxt runtime configuration

You can override Nuxt runtime configuration by creating a `.env` file at the root of your project and
using `NUXT_PUBLIC` prefix on any **existing** config vars name.

```dotenv
# .env
NUXT_PUBLIC_BASE_URL=http://localhost:3000
NUXT_PUBLIC_API_BASE_URL=http://roadiz-core-app.test/api
NUXT_PUBLIC_INTERVENTION_REQUEST_BASE_URL=http://roadiz-core-app.test/assets
NUXT_PUBLIC_INTERVENTION_REQUEST_NO_PROCESS_BASE_URL=http://roadiz-core-app.test/images
``` 

---

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## SVG

### Single file

Use `vite-svg-loader` to import SVG file.  
See the plugin [documentation](https://github.com/jpkleemans/vite-svg-loader) for more information.

```vue
<script setup lang="ts">
import IconCheck from '~/assets/images/icons/check.svg?component'
</script>

<template>
    <div>
        <IconCheck />
    </div>
</template>
```

### Sprite

All the files in `~/assets/images/icons` are automatically imported in a SVG sprite.  
It uses `@nuxtjs/svg-sprite` module. See the module [documentation](https://github.com/nuxt-modules/svg-sprite/tree/master) for more information.

```vue
<template>
    <div>
        <SvgIcon name="check" width="14" height="11" />
    </div>
</template>
```
