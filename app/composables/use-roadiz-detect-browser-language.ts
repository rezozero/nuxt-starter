import type { RoadizAlternateLink } from '@roadiz/types'
import { mergeVaryHeader } from '~/utils/http/merge-vary-header'

// The redirect depends on the visitor: temporary, never cached
const REDIRECT_CODE = 302

export async function useRoadizDetectBrowserLanguage({ locale, alternateLinks }: {
    locale: string
    alternateLinks?: RoadizAlternateLink[]
}) {
    const { detectBrowserLanguage } = useRuntimeConfig().public.i18n

    if (!detectBrowserLanguage) return

    const isRootPath = useRoute().path === '/' || alternateLinks?.some(link => link.url === '/')

    if (!isRootPath && detectBrowserLanguage.redirectOn === 'root') return

    // From here the response depends on the visitor's language, so shared caches must key on it
    if (import.meta.server) {
        const vary = useResponseHeader('Vary')
        const names = detectBrowserLanguage.useCookie ? ['Accept-Language', 'Cookie'] : ['Accept-Language']

        vary.value = mergeVaryHeader(vary.value, ...names)
    }

    const { $i18n } = useNuxtApp()
    // The request cookie, not useCookie(): on the server, it reads back the cookie @nuxtjs/i18n wrote while rendering
    const cookieLocale = detectBrowserLanguage.useCookie ? $i18n.getLocaleCookie() : undefined

    if (cookieLocale && detectBrowserLanguage.alwaysRedirect !== true) return

    const preferredLocale = cookieLocale || useBrowserLocale()

    if (
        preferredLocale
        && preferredLocale !== locale
        && $i18n.locales.value.find(availableLocale => availableLocale.code === preferredLocale)
    ) {
        const alternateLink = alternateLinks?.find(link => link.locale === preferredLocale)

        if (!alternateLink?.url) return

        // nuxt-cache-control reads the event status, which Nitro only sets to 302 after its hook ran,
        // so without this the redirect would be sent as publicly cacheable
        const event = useRequestEvent()
        if (event) setResponseStatus(event, REDIRECT_CODE)

        await navigateTo(alternateLink.url, { replace: true, external: true, redirectCode: REDIRECT_CODE })
    }
}
