import { joinURL } from 'ufo'

// Use cdnUrl for head elements.
// Nuxt doesn't support cdnUrl via config file.
// @see https://github.com/nuxt/nuxt/issues/14145
export default defineNuxtPlugin({
    parallel: true,
    async setup() {
        const config = useRuntimeConfig()

        useHead({
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ].map(
                link => ({
                    ...link,
                    href: joinURL(config.app.cdnURL, link.href),
                }),
            ),
        })
    },
})
