import type { LocaleObject, NuxtI18nInstance } from 'nuxt-i18n'

export function setLocaleFromPath(i18n: NuxtI18nInstance, path: string): Promise<void> {
    // It assumes the i18n strategy is `prefix`.
    const locale = path.split('/')[1]
    const availableLocales = (i18n.locales || []) as (string | LocaleObject)[]
    const matchingAvailableLocale = availableLocales.find(
        (i18nLocale: string | LocaleObject) =>
            i18nLocale === locale || (typeof i18nLocale !== 'string' && i18nLocale.code === locale)
    )

    return matchingAvailableLocale ? i18n.setLocale(locale) : Promise.resolve()
}
