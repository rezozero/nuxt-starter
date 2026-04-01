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
})
