import { murmurHash128 } from 'murmurhash-native'
import { joinURL } from 'ufo'
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin'
import toBoolean from './src/utils/to-boolean'
import createSitemaps from './src/utils/roadiz/create-sitemaps'

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        htmlAttrs: {
            lang: process.env.I18N_DEFAULT_LOCALE,
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
    css: ['@/scss/main.scss'],

    render: {
        etag: {
            hash: (html) => murmurHash128(html),
        },
    },

    serverMiddleware: ['@middleware/cache.ts'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['@/plugins/polyfills.client.ts'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: [
        '@/components',
        '@/components/atoms',
        '@/components/molecules',
        '@/components/organisms',
        { path: '@/components/blocks/', global: true },
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
        'vue-plausible',
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
                    localIdentName: '[name]__[local]--[hash:base64:5]',
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
    },

    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
    server: {
        host: '0.0.0.0', // allow external access in dev mode
    },

    // https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
    publicRuntimeConfig: {
        roadiz: {
            baseURL: joinURL(process.env.API_URL, process.env.API_ENDPOINT_PREFIX),
            apiKey: process.env.API_KEY,
            preview: toBoolean(process.env.API_PREVIEW),
            debug: toBoolean(process.env.API_DEBUG),
            origin: process.env.API_ORIGIN,
        },
        plausible: {
            domain: process.env.PLAUSIBLE_DOMAIN,
            apiHost: process.env.PLAUSIBLE_API_HOST || 'https://plausible.io',
        },
        interventionRequest: {
            baseUrl: joinURL(process.env.API_URL, 'assets'),
        },
        baseURL: process.env.BASE_URL,
    },

    // https://i18n.nuxtjs.org/
    i18n: {
        detectBrowserLanguage: false,
        strategy: 'no_prefix',
        defaultLocale: process.env.I18N_DEFAULT_LOCALE || 'fr',
        parsePages: false,
        vuex: false,
        vueI18n: {
            fallbackLocale: process.env.I18N_FALLBACK_LOCALE || 'fr',
            messages: {
                // en: require('./src/assets/locales/en.json'),
                // fr: require('./src/assets/locales/fr.json'),
            },
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
        sitemaps: createSitemaps(['fr', 'en']),
    },

    // https://github.com/moritzsternemann/vue-plausible#configuration
    plausible: {
        trackLocalhost: false,
    },

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
}
