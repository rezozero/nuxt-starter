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
Fill the Xilofone env variables in the `.env` file.

```dotenv
XILOFONE_BASE_URL=https://xilofone.rezo-zero.com
XILOFONE_USERNAME=
XILOFONE_PASSWORD=
XILOFONE_FILE_ID=
XILOFONE_OUTPUT=assets/locales/
```

Run the following command to fetch the messages:
```bash
npm run xilo
```

## Image

The application uses `@nuxt/image` module.  
Please refer to the Nuxt image module [documentation](https://image.nuxt.com/) for more information.

The provider by default is Intervention Request.  
Fill the .env file with the values for the provider.
```dotenv
NUXT_PUBLIC_INTERVENTION_REQUEST_BASE_URL=
NUXT_PUBLIC_INTERVENTION_REQUEST_NO_PROCESS_BASE_URL=
NUXT_PUBLIC_INTERVENTION_REQUEST_IMAGES_PATH=
```
See the provider [documentation](https://github.com/rezozero/intervention-request-provider) for more information.

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

## Stories

The application uses `@rezo-zero/nuxt-stories` module.  

All the files with the `.stories.vue` extension are automatically imported and displayed in the stories.   
The stories are available on `/_stories`.

The app must use a layout (at least a default one) for allowing the stories to be displayed.  
See Nuxt stories [caveat section](https://github.com/rezozero/nuxt-stories?tab=readme-ov-file#caveats).

Checkout the Nuxt stories [documentation](https://github.com/rezozero/nuxt-stories) for more information.
