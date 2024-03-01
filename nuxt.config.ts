import svgLoader from 'vite-svg-loader'
import { version } from './package.json'
import { hoistUseStatements } from './utils/vite/hoist-use-statements'

const defaultLocale = 'fr'
const locales = ['fr']

export default defineNuxtConfig({
    devtools: { enabled: true },
    extends: ['github:rezozero/nuxt-layer#v0.1.1'],
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/svg-sprite',
        // the Intervention Request provider module has to be registered before the Nuxt image module
        // @see https://github.com/rezozero/intervention-request-provider?tab=readme-ov-file#installation
        '@rezo-zero/intervention-request-provider',
        '@nuxt/image',
        '@rezo-zero/nuxt-stories',
        '@nuxtjs/sitemap',
    ],
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
                environment: 'development',
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
            sentry: {
                dsn: '',
            },
        },
    },
    css: ['~/assets/scss/main.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: hoistUseStatements(`@import "~/assets/scss/_style-resources.scss";`),
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
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
    // https://v8.i18n.nuxtjs.org/getting-started/setup
    i18n: {
        // Use no_prefix strategy to avoid redirecting localized paths without locale prefix
        strategy: 'no_prefix',
        detectBrowserLanguage: false,
        defaultLocale,
        locales: locales.map((locale) => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        langDir: 'assets/locales/',
    },
    // https://image.nuxt.com/get-started/configuration
    image: {
        provider: 'interventionRequest',
        quality: 75,
        screens: {
            xs: 375, // override size to match our breakpoints
            xl: 1440, // override size to match our breakpoints
            hd: 1920, // additional size
            qhd: 2500, // additional size
        },
        // @ts-ignore not working with [1]
        densities: '1',
        presets: {
            default: {
                sizes: 'xs:100vw md:100vw lg:100vw vl:100vw xl:100vw hd:100vw qhd:100vw',
            },
        },
    },
    // https://www.nuxtseo.com/sitemap/getting-started/installation
    sitemap: {
        sources: ['/api/sitemap'],
    },
})
