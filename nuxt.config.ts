import { fileURLToPath } from 'node:url'
import svgLoader from 'vite-svg-loader'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './app/constants/i18n'
import { version } from './package.json'
import { createHash } from 'node:crypto'

const isDev = process.env.NODE_ENV === 'development'
const isGenerate = process.argv.includes('generate')
const isGenerateMaintenance = isGenerate && process.argv.includes('--maintenance')

export default defineNuxtConfig({
    modules: [
        // the Intervention Request provider module has to be registered before the Nuxt image module
        // @see https://github.com/rezozero/intervention-request-provider?tab=readme-ov-file#installation
        '@rezo-zero/intervention-request-provider',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        '@vueuse/nuxt',
        '@rezo-zero/nuxt-cache-control',
        '@nuxt/eslint',
        '@nuxtjs/robots',
        '@nuxt/icon',
        '@sentry/nuxt/module',
    ],
    components: [
        '~/components',
        {
            path: '~/blocks',
            // As the blocks are used in the CMS, we need to import them globally.
            global: true,
        },
    ],
    devtools: {
        enabled: process.env.NUXT_DEVTOOLS === 'true',
    },
    app: {
        head: {
            htmlAttrs: {
                lang: I18N_DEFAULT_LOCALE,
            },
            // if head elements are assets, it should be loaded via the head plugin (for supporting cdnUrl)
        },
    },
    css: ['~/assets/scss/main.scss'],
    runtimeConfig: {
        // Server-only: overrides api.url for Node SSR context (e.g. internal cluster URL).
        // Never exposed to the browser bundle.
        // Falls back to NUXT_PUBLIC_API_URL when unset.
        serverApiUrl: '',
        public: {
            version,
            site: {
                name: '',
                url: '',
                env: '',
            },
            newsletter: {
                schemaEndpoint: '/api/newsletter_form/definition',
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
                cloudId: '',
                siteId: 1,
                containerID: '',
                trackerUrl: '',
            },
            googleTagManager: {
                id: '',
                debug: '',
            },
            friendlyCaptcha: {
                siteKey: '',
            },
            reCaptcha: {
                siteKey: '',
            },
            hCaptcha: {
                siteKey: '',
            },
            turnstile: {
                siteKey: '',
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
    ignore: [
        ...(isGenerateMaintenance ? ['app/layouts/**', 'app/pages/**', 'app/components/blocks/**', 'app/components/organisms/**', 'server/api/**'] : []),
        (isGenerateMaintenance || isDev) ? '!app/pages/maintenance.vue' : 'app/pages/maintenance.vue',
        !isDev ? 'app/**/*.stories.vue' : undefined, // prevents stories from blocks (globally imported) to be included in the production bundles
    ],
    features: {
        noScripts: isGenerateMaintenance, // maintenance page does not need JS
        inlineStyles: id => !!id && id.includes('.vue'), // trying to keep the duplicated styles to a minimum  https://github.com/nuxt/nuxt/issues/21821#issuecomment-2556813895
    },
    experimental: {
        asyncContext: true,
        appManifest: false, // We don't need client route rules for now, and Nuxt makes an extra request to get them.
    },
    compatibilityDate: '2026-06-05',
    nitro: {
        prerender: {
            autoSubfolderIndex: false,
            crawlLinks: false,
            failOnError: true,
            ignore: [
                (route) => {
                    if (!isGenerateMaintenance)
                        return false

                    return !route.includes('maintenance')
                },
            ],
        },
        routeRules: {
            '/**': {
                headers: {
                    // https://web.dev/articles/floc?hl=fr#can_websites_opt_out_of_being_included_in_the_floc_computation
                    'Permissions-Policy': 'interest-cohort=()',
                    // Hardening client security policies
                    // https://developer.mozilla.org/fr/docs/Web/HTTP/CSP
                    'Content-Security-Policy': [
                        // Only allows these iframe origins
                        'frame-src \'self\' *.cloudflare.com *.hcaptcha.com *.gstatic.com *.frcapi.com *.youtube.com *.youtube-nocookie.com *.vimeo.com *.instagram.com *.soundcloud.com *.google.com *.deezer.com *.spotify.com *.podcasts.apple.com *.linkedin.com',
                        // Only allows these script origins
                        // "script-src 'self' 'unsafe-inline' *.google.com *.googleapis.com *.gstatic.com",
                        // Only allows these images origins
                        // "img-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
                    ].join('; '),
                },
            },
            '/maintenance': {
                prerender: isGenerateMaintenance,
                headers: {
                    'X-Robots-Tag': 'noindex',
                },
            },
        },
    },
    vite: {
        build: {
            // If the generated svg-sprite file is under 4kb, the build process converts it to an inlined base64 file,
            // which breaks the use of icons.
            assetsInlineLimit: 0,
        },
        css: {
            modules: {
                generateScopedName(name: string, filename: string) {
                    // Strip query params that differ between SSR (?ssr=true) and client
                    const cleanFilename = (filename.split('?')[0] ?? filename).replace(/\\/g, '/')
                    const hash = createHash('md5').update(cleanFilename).digest('hex').substring(0, 5)
                    // in dev mode, display the componentName in the className
                    if (isDev) {
                        const componentName = cleanFilename.split('/').pop()?.replace(/\.vue.*$/, '').replace(/\./g, '-') ?? ''
                        return `${componentName}_${name}_${hash}`
                    }
                    return `_${name}_${hash}`
                },
            },
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "${fileURLToPath(new URL('./app/assets/scss/_resources.scss', import.meta.url))}" as *;`,
                    loadPaths: [fileURLToPath(new URL('./app', import.meta.url))],
                    quietDeps: true,
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
            svgLoader({
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeTitle: false,
                                    // viewBox is required to resize SVGs with CSS.
                                    // @see https://github.com/svg/svgo/issues/1128
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                defaultImport: 'url',
            }),
        ],
    },
    postcss: {
        plugins: {
            // https://github.com/cuth/postcss-pxtorem?tab=readme-ov-file#options
            'postcss-pxtorem': {
                propList: ['*'],
                exclude: /(node_modules|scss\/export)/i,
            },
        },
    },
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },
    // https://i18n.nuxtjs.org/docs/getting-started/usage
    i18n: {
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
        },
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        compilation: {
            strictMessage: false, // Message can contains HTML tag
        },
    },
    // https://nuxt.com/modules/icon#usage
    icon: {
        componentName: 'NuxtIcon',
        class: '',
        fallbackToApi: false,
        localApiEndpoint: '/_nuxt_icon',
        customCollections: [
            {
                normalizeIconName: false,
                prefix: 'icon',
                // The icons directory is used into other context (e.g. stories), so we need to get the absolute path.
                dir: fileURLToPath(new URL('./app/assets/images/icons', import.meta.url)),
            },
        ],
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
        disallow: ['/rz-admin', '/maintenance', '/api'],
    },
    // https://www.nuxtseo.com/sitemap/getting-started/installation
    sitemap: {
        enabled: !isGenerateMaintenance,
        sources: ['/api/sitemap'],
    },
})
