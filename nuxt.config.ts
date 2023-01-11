import { joinURL } from 'ufo'
// @ts-ignore
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin'
import toBoolean from './src/utils/to-boolean'
import createSitemaps from './src/utils/roadiz/create-sitemaps'

const isProduction = process.env.NODE_ENV === 'production'
// i18n
const locales = ['en']
const defaultTimeZone = 'Europe/Paris' // Define global app timezone here because i18n config is not editable at runtime
const defaultLocale = 'en'
const fallbackLocale = 'en'

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        htmlAttrs: {
            lang: defaultLocale,
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],
    },
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-srcdir
    srcDir: 'src',
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['~/scss/main.scss'],
    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~/plugins/polyfills.client.ts',
        '~/plugins/document-url.ts',
        '~/plugins/roadiz-url.ts',
        '~/plugins/sentry.client.ts',
    ],
    // Auto import components: https://go.nuxtjs.dev/config-components
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
        { path: '~/components/blocks/', global: true },
    ],
    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/stylelint
        '@nuxtjs/stylelint-module',
        // https://image.nuxtjs.org/getting-started/installation
        '@nuxt/image',
        // https://github.com/nuxt-community/style-resources-module#setup
        '@nuxtjs/style-resources',
        // https://github.com/nuxt-community/svg-module
        '@nuxtjs/svg',
        // https://github.com/nuxt/postcss8
        '@nuxt/postcss8',
        // https://github.com/nuxt/components
        'nuxt-storm',
    ],
    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://i18n.nuxtjs.org/
        'nuxt-i18n',
        // https://sentry.nuxtjs.org/
        '@nuxtjs/sentry',
        // https://github.com/roadiz/nuxt-module#configuration
        '@roadiz/nuxt-module',
        // https://sitemap.nuxtjs.org/guide/setup
        '@nuxtjs/sitemap',
        // https://github.com/moritzsternemann/vue-plausible#configuration
        /* Disable Plausible unless you have a valid domain */
        // 'vue-plausible',
        // https://github.com/nuxt-community/recaptcha-module
        '@nuxtjs/recaptcha',
    ],
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        loaders: {
            css: {
                modules: {
                    compileType: 'icss',
                },
            },
            cssModules: {
                modules: {
                    localIdentName: isProduction ? '[local]_[hash:base64:5]' : '[name]__[local]--[hash:base64:5]',
                },
            },
        },
        plugins: [
            new SpriteLoaderPlugin({
                plainSprite: true,
                spriteAttrs: {
                    id: 'svg-sprite',
                },
            }),
        ],
        // fix broken styles during live editing into dev tools https://github.com/vuejs-templates/webpack/issues/1331
        cssSourceMap: false,
    },
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
    server: {
        host: '0.0.0.0', // allow external access in dev mode
    },
    // https://nuxtjs.org/docs/configuration-glossary/configuration-loading
    loading: '@/components/organisms/VLoading/VLoading.vue',
    // https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
    publicRuntimeConfig: {
        roadiz: {
            baseURL: joinURL(process.env.API_URL || process.env.BASE_URL || '', process.env.API_ENDPOINT_PREFIX || ''),
            apiKey: process.env.API_KEY,
            allowClientPreview: toBoolean(process.env.API_ALLOW_CLIENT_PREVIEW),
            debug: toBoolean(process.env.API_DEBUG),
            origin: process.env.API_ORIGIN,
        },
        /* Disable Plausible unless you have a valid domain */
        // plausible: {
        //     domain: process.env.PLAUSIBLE_DOMAIN,
        //     apiHost: process.env.PLAUSIBLE_API_HOST || 'https://plausible.io',
        // },
        interventionRequest: {
            baseUrl: process.env.INTERVENTION_REQUEST_BASE_URL || process.env.API_URL || '',
            noProcessBasePath: process.env.INTERVENTION_REQUEST_NO_PROCESS_PATH || process.env.DOCUMENT_PATH,
            basePath: process.env.INTERVENTION_REQUEST_ASSETS_PATH || process.env.INTERVENTION_REQUEST_BASE_PATH,
        },
        apiURL: process.env.API_URL,
        apiEndpointPrefix: process.env.API_ENDPOINT_PREFIX,
        baseURL: process.env.BASE_URL,
        documentPath: process.env.DOCUMENT_PATH,
        defaultTimeZone,
        defaultLocale,
        fallbackLocale,
        // Google Recaptcha
        recaptcha: {
            siteKey: process.env.RECAPTCHA_SITE_KEY || 'siteKey_not_defined', // default value prevents module from throwing an error
            version: 3,
        },
    },
    // https://i18n.nuxtjs.org/
    i18n: {
        locales: locales.map((locale) => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        langDir: 'assets/locales/',
        detectBrowserLanguage: false,
        strategy: 'prefix',
        defaultLocale,
        vuex: false,
        vueI18n: {
            fallbackLocale,
            // Date-time format presets examples including application-wide time-zone to prevent using
            // user-browser time-zone (see README.md #define-an-application-wide-timezone)
            dateTimeFormats: locales.reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur]: {
                        short: {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            timeZone: defaultTimeZone,
                        },
                        hour: {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                            timeZone: defaultTimeZone,
                        },
                    },
                }),
                {}
            ),
        },
    },
    // https://github.com/nuxt-community/style-resources-module#setup
    styleResources: {
        scss: ['@/scss/_style-resources.scss'],
        hoistUseStatements: true,
    },
    // https://sitemap.nuxtjs.org/guide/setup
    sitemap: {
        // hostname: process.env.BASE_URL,
        i18n: true,
        path: '/sitemap.xml',
        cacheTime: 1000 * 60 * 60 * 2,
        defaults: {
            changefreq: 'daily',
            lastmod: new Date(),
        },
        sitemaps: createSitemaps(locales),
    },
    // https://github.com/moritzsternemann/vue-plausible#configuration
    /* Disable Plausible unless you have a valid domain */
    // plausible: {
    //     trackLocalhost: false,
    // },
    // https://github.com/nuxt-community/svg-module
    svg: {
        svgSpriteLoader: {
            extract: true,
            runtimeGenerator: require.resolve('./src/utils/svg/sprite-component-generator.js'),
            spriteFilename: 'image/sprite.[hash:8].svg',
        },
    },
    // https://github.com/rezozero/intervention-request-provider
    image: {
        provider: 'interventionRequest',
        providers: {
            interventionRequest: {
                name: 'interventionRequest',
                provider: require.resolve('./node_modules/@rezo-zero/intervention-request-provider/dist/index.js'),
            },
        },
        screens: {
            '2xl': false, // remove useless 2xl size (duplicate with xxl size)
            hd: 1920,
        },
    },
    // https://storybook.nuxtjs.org/api/options
    storybook: {
        stories: ['~/components/**/*.stories.js', '~/stories/**/*.stories.js'],
        parameters: {
            viewport: {
                viewports: {
                    iPhoneSE: {
                        name: 'iPhone SE',
                        styles: {
                            width: '375px',
                            height: '660px',
                        },
                    },
                    iPadPortrait: {
                        name: 'iPad portrait',
                        styles: {
                            width: '768px',
                            height: '1024px',
                        },
                    },
                    iPadLandscape: {
                        name: 'iPad landscape',
                        styles: {
                            width: '1024px',
                            height: '768px',
                        },
                    },
                },
            },
        },
        addons: [
            {
                name: '@storybook/preset-scss',
                options: {
                    cssLoaderOptions: {
                        modules: true,
                        localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                },
            },
        ],
    },
    // https://sentry.nuxtjs.org/guide/setup
    sentry: {
        lazy: true,
    },
}
