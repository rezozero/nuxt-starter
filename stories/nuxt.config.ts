export default defineNuxtConfig({
    extends: ['../'],
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
