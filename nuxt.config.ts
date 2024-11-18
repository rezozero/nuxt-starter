import svgLoader from 'vite-svg-loader'
import type { NuxtPlugin } from '@nuxt/schema'
import { version } from './package.json'
import { hoistUseStatements } from './utils/vite/hoist-use-statements'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './i18n.config'

const isNuxtStories = process.env.NUXT_STORIES === '1'
const plugins: (NuxtPlugin | string)[] = []

if (isNuxtStories) {
    plugins.push('./plugins/stories/msw.ts')
}

export default defineNuxtConfig({
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
        '@nuxtjs/robots',
    ],
    plugins,
    // Don' use layer for now
    // extends: ['github:rezozero/nuxt-layer#v0.1.6'],
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
        { path: '~/components/blocks/', global: true },
    ],
    devtools: { enabled: true },
    css: ['~/assets/scss/main.scss'],
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
            googleTagManager: {
                id: '',
            },
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
    experimental: {
        asyncContext: true,
        appManifest: false, // We don't need client route rules for now, and Nuxt makes an extra request to get them.
    },
    compatibilityDate: '2024-07-24',
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
                        'frame-src \'self\' *.youtube.com *.youtube-nocookie.com *.vimeo.com *.instagram.com *.soundcloud.com *.google.com *.deezer.com *.spotify.com',
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
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    // additionalData: `@use "~/assets/scss/_style-resources.scss" as *;`,
                    quietDeps: true,
                    // For now, just silence the deprecation warning.
                    // But we have to use Dart Sass modern API https://sass-lang.com/documentation/breaking-changes/legacy-js-api/ soon.
                    // Vite 5.x uses the legacy API as default https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
                    // Probably for best performance we should use `api: "modern-compiler"` and `sass-embedded` package.
                    // Waiting on Vite fixing the missing sourcemap files https://github.com/vitejs/vite/pull/18113 warning.
                    silenceDeprecations: ['legacy-js-api'],
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
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },
    // https://v8.i18n.nuxtjs.org/getting-started/setup
    i18n: {
        strategy: 'prefix_except_default',
        detectBrowserLanguage: false,
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        langDir: 'assets/locales/',
        compilation: {
            // Message can contains HTML tag
            strictMessage: false,
        },
    },
    // https://image.nuxt.com/get-started/configuration
    image: {
        quality: 75,
        screens: {
            xs: 375, // override nuxt/img sizes to match our breakpoints
            sm: 480, // override
            vl: 1280, // override
            xl: 1440, // override
            xxl: 1600, // override
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
    // https://nuxtseo.com/robots/api/config
    robots: {
        allow: ['/'],
        disallow: ['/rz-admin', '/maintenance', '/_icons', '/api'],
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
    // https://github.com/nuxt-modules/svg-sprite#options
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },
})
