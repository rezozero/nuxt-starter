export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'nuxt-starter',
        htmlAttrs: {
            lang: process.env.I18N_DEFAULT_LOCALE
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''},
            {name: 'format-detection', content: 'telephone=no'}
        ],
    },

    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-srcdir
    srcDir: 'src',

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['@/scss/main.scss'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['@/plugins/api.ts', '@/plugins/polyfills.client.ts'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: [
        '@/components',
        '@/components/atoms',
        '@/components/molecules',
        '@/components/organisms',
        {path: '@/components/blocks/', global: true},
    ],

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/stylelint
        '@nuxtjs/stylelint-module',
        // https://image.nuxtjs.org/getting-started/installation
        '@nuxt/image'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://i18n.nuxtjs.org/
        'nuxt-i18n'
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {},

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
    },

    // https://fr.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
    publicRuntimeConfig: {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
        assetsUrl: process.env.ASSETS_URL,
        baseUrl: process.env.BASE_URL,
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
    }
}
