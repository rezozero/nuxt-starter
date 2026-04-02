import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
    extends: ['../'],
    alias: {
        '~': fileURLToPath(new URL('../app', import.meta.url)),
        '~~': fileURLToPath(new URL('../', import.meta.url)),
        '@': fileURLToPath(new URL('../app', import.meta.url)),
        '~stories': fileURLToPath(new URL('./', import.meta.url)),
    },
    ssr: false,
    vite: {
        server: {
            fs: {
                // Vite restricts file serving to the project root by default. nuxt-stories lives in
                // a sibling directory, so its node_modules (e.g. primeicons fonts) would be blocked.
                // '../../nuxt-stories' resolves to the sibling package relative to this stories/ dir.
                allow: ['..', fileURLToPath(new URL('../../nuxt-stories', import.meta.url))],
            },
        },
    },
    modules: [
        '@rezo-zero/nuxt-stories',
    ],
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
