import { withBase, withHttps, withoutProtocol, withoutTrailingSlash, withQuery } from 'ufo'

// @see https://github.com/nuxt/scripts/blob/main/src/runtime/registry/matomo-analytics.ts
interface MatomoAnalyticsApi {
    _paq: unknown[]
}

declare global {
    interface Window extends MatomoAnalyticsApi {}
}

export default defineNuxtPlugin({
    name: 'matomo',
    parallel: true,
    async setup() {
        const config = useRuntimeConfig().public.matomo

        if (!config.cloudId) return

        const normalizedCloudId = withoutTrailingSlash(withoutProtocol(config.cloudId))
        const origin = config?.url ? config?.url : `https://cdn.matomo.cloud/${normalizedCloudId}/`
        const siteId = String(config?.siteId) || '1'
        const trackerUrl = (config?.trackerUrl || config?.url)
            ? config?.trackerUrl
                ? withHttps(config.trackerUrl)
                : withBase(`/matomo.php`, withHttps(config?.url || ''))
            : normalizedCloudId && withBase(`/matomo.php`, withHttps(normalizedCloudId))
        const noScriptUrl = withQuery(trackerUrl, { idsite: siteId, rec: 1 })

        // Server side
        if (import.meta.server) {
            // No script
            useHead({
                noscript: [
                    {
                        innerHTML: `<p><img referrerpolicy="no-referrer-when-downgrade" src="${noScriptUrl}" style="border:0;" alt="" /></p>`,
                        tagPosition: 'bodyOpen',
                    },
                ],
            })
        }
        // Client side
        else {
            const _paq = window._paq = window._paq || []

            _paq.push(['disableCookies'])
            _paq.push(['trackPageView'])
            _paq.push(['enableLinkTracking'])
            _paq.push(['setSiteId', siteId])
            _paq.push(['setTrackerUrl', trackerUrl])

            useHead({
                script: [
                    {
                        src: withBase(`/matomo.js`, origin),
                        defer: true,
                        async: true,
                    },
                ],
            })

            const currentPage = useCurrentPage()

            watch(currentPage, (newValue, oldValue) => {
                const newUrl = toValue(newValue?.webResponse)?.item?.url
                const oldUrl = toValue(oldValue?.webResponse)?.item?.url

                if (!newUrl || newUrl === oldUrl) return

                window._paq.push(['setReferrerUrl', oldUrl])
                window._paq.push(['setCustomUrl', newUrl])
                window._paq.push(['setDocumentTitle', newValue?.title])
                window._paq.push(['trackPageView'])
            })
        }
    },
})
