import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
    extends: ['../'],
    alias: {
        '~': fileURLToPath(new URL('../app', import.meta.url)),
        '@': fileURLToPath(new URL('../app', import.meta.url)),
    },
    modules: [
        '@rezo-zero/nuxt-stories',
    ],
    ssr: false,
    stories: {
        mode: 'shell',
        frameCwd: '../',
        framePort: 3000,
    },
    // Prevent i18n from creating ___locale suffixed route name variants (e.g. shell-v-button___fr).
    // The stories shell uses router.getRoutes() to build its nav — locale variants corrupt the
    // iframe URLs (e.g. /-frame/v-button/css-size___fr). no_prefix skips route localisation entirely.
    i18n: {
        strategy: 'no_prefix',
    },
})
