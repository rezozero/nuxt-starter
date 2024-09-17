import svgLoader from 'vite-svg-loader'
import type { NuxtPlugin } from '@nuxt/schema'
import { version } from './package.json'
import { hoistUseStatements } from './utils/vite/hoist-use-statements'

const defaultLocale = 'fr'
const locales = ['fr']

const isNuxtStories = process.env.NUXT_STORIES === '1'

const plugins: (NuxtPlugin | string)[] = []

if (isNuxtStories) {
    plugins.push('./plugins/stories/msw.ts')
}

export default defineNuxtConfig({
    devtools: { enabled: true },

    plugins,

    // Don't use layer for now
    // extends: ['github:rezozero/nuxt-layer#v0.1.6'],
    modules: [
        '@nuxtjs/svg-sprite',
        // the Intervention Request provider module has to be registered before the Nuxt image module
        // @see https://github.com/rezozero/intervention-request-provider?tab=readme-ov-file#installation
        '@rezo-zero/intervention-request-provider',
        '@nuxt/image',
        '@rezo-zero/nuxt-stories',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        '@vueuse/nuxt',
        '@rezo-zero/nuxt-cache-control',
        '@nuxt/eslint',
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
            cacheControl: {
                maxAge: 60 * 60, // 1 hour
                staleWhileRevalidate: 60 * 2, // 2 minutes
                public: true,
            },
            cacheTags: {
                key: 'cache-tags',
            },
        },
    },

    css: ['~/assets/scss/main.scss'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: hoistUseStatements(`@import "~/assets/scss/_style-resources.scss";`),
                    quietDeps: true,
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

    nitro: {
        routeRules: {
            '/**': {
                headers: {
                    // https://web.dev/articles/floc?hl=fr#can_websites_opt_out_of_being_included_in_the_floc_computation
                    'Permissions-Policy': 'interest-cohort=()',
                    // Hardening client security policies
                    // https://developer.mozilla.org/fr/docs/Web/HTTP/CSP
                    'Content-Security-Policy': [
                        // Only allows these iframe origins
                        'frame-src \'self\' *.youtube.com *.vimeo.com *.instagram.com *.soundcloud.com *.google.com *.deezer.com *.spotify.com',
                        // Only allows these script origins
                        // "script-src 'self' 'unsafe-inline' *.google.com *.googleapis.com *.gstatic.com",
                        // Only allows these images origins
                        // "img-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
                    ].join('; '),
                },
            },
            // Auto generated page by svgSprite module
            '/_icons': {
                headers: {
                    // Do not index the page and remove it from sitemap
                    'X-Robots-Tag': 'noindex',
                },
            },
        },
    },

    // https://github.com/nuxt-modules/svg-sprite#options
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },

    // https://v8.i18n.nuxtjs.org/getting-started/setup
    i18n: {
        strategy: 'prefix_except_default',
        detectBrowserLanguage: false,
        defaultLocale,
        locales: locales.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        langDir: 'assets/locales/',
    },

    // https://image.nuxt.com/get-started/configuration
    image: {
        quality: 75,
        screens: {
            xs: 375, // override size to match our breakpoints
            xl: 1440, // override size to match our breakpoints
            hd: 1920, // additional size
            qhd: 2500, // additional size
        },
        // @ts-expect-error not working with [1]
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

    // https://github.com/rezozero/nuxt-stories
    stories: {
        pattern: [
            '**/*.stories.vue',
            '!playground', // exclude layer stories
        ],
    },

    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },

    compatibilityDate: '2024-07-24',
})
