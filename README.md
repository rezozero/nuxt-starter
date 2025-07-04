# Nuxt starter

## Application overview

- Nuxt as framework
- Vite for development and build
- SCSS for styles
- Typescript for scripts
- PNPM as package manager
- EsLint / StyleLint for linting and code formatting

##  Environment variables

Duplicate the `.env.sample` file and rename it to `.env`.  
Fill in the environment variables with the correct values.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```
Start the development server on `http://localhost:6006` with stories preset (use the `.env.stories` file):

```bash
docker compose up -d // start the Intervention Request service
pnpm dev:stories
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Code quality and formatting

Run the following command to lint and format the code:

```bash
pnpm lint
```

### Lint and format script (JS / Vue files)

```bash
pnpm lint:js
```

### Lint and format style (CSS / SCSS / Vue files)

```bash
pnpm lint:css
```

### Lint fix (script and style)

```bash
pnpm lint-fix
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
pnpm xilo
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

### Icon module

All the SVG files in `~/assets/images/icons` can be displayed using the VIcon component.
Set the file name to display svg as a background-image or mask-image element.
See the module `@nuxt/icon` [documentation](https://nuxt.com/modules/icon) for more information.

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


## Monitoring

Sentry is included in the application for error monitoring.

Fill the .env file with the values for enabling Sentry.
```dotenv
SENTRY_DSN=
```


## Sitemap

The application uses `@nuxtjs/sitemap` module.  
It generates a sitemap from the `pages/` directory.
Dynamic routes can be added with the server route `/api/sitemap`.

Read the full module documentation [here](https://www.nuxtseo.com/sitemap/getting-started/installation).

## Docker build

The application can be built and run in a Docker container. This starter provide a multi-stage Dockerfile
with a production build and a Nginx server.

You can test build node image with the following command:

```bash
docker buildx build --target node-prod -t nuxt-starter/node .
```

Or use docker buildx bake to build all images in parallel. Update `docker-bake.hcl` file with your own values.

```bash
docker buildx bake
```

This starter provide a .gitlab-ci.yml example file for a CI/CD pipeline using docker build.

## Contributing

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
