import type { RoadizAlternateLink } from '@roadiz/types'
import { nuxtI18nOptions } from '#build/i18n.options.mjs'

export async function useRoadizDetectBrowserLanguage({ locale, alternateLinks }: { locale: string, alternateLinks: RoadizAlternateLink[] }) {
    const { detectBrowserLanguage } = nuxtI18nOptions

    if (!detectBrowserLanguage) return

    const isRootPath = useRoute().path === '/' || alternateLinks.some(link => link.url === '/')

    if (!isRootPath && detectBrowserLanguage.redirectOn === 'root') return

    const cookieLocale = useI18nCookie().value

    if (cookieLocale && detectBrowserLanguage.alwaysRedirect !== true) return

    const { $i18n } = useNuxtApp()
    const browserLocale = useBrowserLocale()
    const preferredLocale = detectBrowserLanguage.useCookie ? (cookieLocale || browserLocale) : browserLocale

    if (preferredLocale && preferredLocale !== locale && $i18n.locales.value.find(availableLocale => availableLocale.code === preferredLocale)) {
        const alternateLink = alternateLinks.find(link => link.locale === preferredLocale)

        if (alternateLink) await navigateTo(alternateLink.url, { replace: true, external: true })
    }
}
