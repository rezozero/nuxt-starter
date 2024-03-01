import svgLoader from 'vite-svg-loader'
import { version } from './package.json'

export default defineNuxtConfig({
    devtools: { enabled: true },
    // extends: ['github:rezozero/nuxt-layer#0.1.0'],
    // css: ['~/assets/scss/main.scss'],
    modules: ['@nuxtjs/svg-sprite'],
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
        { path: '~/components/blocks/', global: true },
    ],
    runtimeConfig: {
        public: {
            version,
            site: {
                url: 'http://localhost:3000',
            },
            api: {
                url: '',
                endpointPrefix: '/api',
                documentPath: '/files',
            },
            interventionRequest: {
                baseUrl: '',
                noProcessBaseUrl: '',
            },
            matomo: {
                url: '',
                containerID: '',
            },
            googleTagManager: '',
            recaptcha: {
                siteKey: '',
                version: 3,
            },
        },
    },
    vite: {
        // css: {
        //     preprocessorOptions: {
        //         scss: {
        //             additionalData: `@import "~/assets/scss/_style-resources.scss";`,
        //         },
        //     },
        // },
        plugins: [
            svgLoader({
                defaultImport: 'url',
            }),
        ],
    },
    // https://github.com/nuxt-modules/svg-sprite#options
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },
})
