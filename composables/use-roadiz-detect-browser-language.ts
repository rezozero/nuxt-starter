import type { RoadizAlternateLink } from '@roadiz/types'
import { nuxtI18nOptions } from '#build/i18n.options.mjs'

export async function useRoadizDetectBrowserLanguage({ locale, alternateLinks }: { locale: string, alternateLinks: RoadizAlternateLink[] }) {
    const { $i18n } = useNuxtApp()
    const detectBrowserLanguage = nuxtI18nOptions.detectBrowserLanguage
    const isRootPath = alternateLinks.some(link => link.url === '/')

    // trying to redirect to the preferred locale for the root page (home page) only
    if (detectBrowserLanguage && isRootPath) {
        const cookieLocale = useI18nCookie().value

        if (!cookieLocale || !detectBrowserLanguage.useCookie || (detectBrowserLanguage.useCookie && cookieLocale && detectBrowserLanguage.alwaysRedirect)) {
            const browserLocale = useBrowserLocale()
            const preferredLocale = detectBrowserLanguage.useCookie ? (cookieLocale || browserLocale) : browserLocale

            if (preferredLocale && preferredLocale !== locale && $i18n.locales.value.find(availableLocale => availableLocale.code === preferredLocale)) {
                const alternateLink = alternateLinks.find(link => link.locale === preferredLocale)

                if (alternateLink) await navigateTo(alternateLink.url, { replace: true, external: true })
            }
        }
    }
}
