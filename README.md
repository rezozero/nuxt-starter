# Nuxt starter

##  Nuxt runtime configuration

Duplicate the `.env.example` file and rename it to `.env`.
Fill in the environment variables with the correct values.

## Setup

Make sure to install the dependencies:

```bash
npm run install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## I18n

The application uses `nuxt-i18n` module for internationalization.  
Please refer to the [documentation](https://v8.i18n.nuxtjs.org/) for more information.

The localized messages come from Xilofone, our translation management system.  
The messages can be fetched automatically using the `@rezo-zero/xilofone-fetch` script.  
Fill the Xilofone env variables in the `.env` file and run the following command to fetch the messages:

```bash
npm run xilo
```

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

Nuxt layer introduces a component `VIcon` to easily use the sprite.

```vue
<template>
    <div>
        <VIcon name="check" />
    </div>
</template>
```
