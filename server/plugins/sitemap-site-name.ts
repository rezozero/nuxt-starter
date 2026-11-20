import type { RoadizNodesSourcesHead } from '@roadiz/types'
import { I18N_DEFAULT_LOCALE } from '~/constants/i18n'

// The sitemap module reads the site name from nuxt-site-config, which only knows `NUXT_PUBLIC_SITE_NAME`.
// The pages take it from the CMS common content (see `useRoadizMeta()`), so the sitemap does the same.
// Only the sitemap routes (`/__sitemap__/style.xsl`, `/__sitemap__/debug.json`) display it:
// fetching the common content on every other request would be wasted.
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('site-config:init', async ({ event, siteConfig }) => {
        if (!event.path.startsWith('/__sitemap__/')) return

        const siteName = await $fetch<{ head?: RoadizNodesSourcesHead }>('/common_content', {
            baseURL: getApiUrl(),
            headers: { Accept: 'application/ld+json' },
            params: { _locale: I18N_DEFAULT_LOCALE },
        })
            .then(response => response.head?.siteName)
            // Keep the runtime config name rather than breaking the sitemap stylesheet.
            .catch(() => undefined)

        // An empty name is ignored by the stack, so the runtime config one stays as a fallback.
        siteConfig.push({
            _context: 'roadiz:common-content',
            name: siteName ?? undefined,
        })
    })
})
