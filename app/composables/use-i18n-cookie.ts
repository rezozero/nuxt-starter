import { I18N_LOCALES } from '~/constants/i18n'

// Workaround for useCookieLocale() returning empty string
// @see https://github.com/nuxt-modules/i18n/issues/2975
export function useI18nCookie(): Ref<string> {
    const locale: Ref<string> = ref('')
    const { detectBrowserLanguage } = useRuntimeConfig().public.i18n

    if (detectBrowserLanguage && detectBrowserLanguage.useCookie) {
        const cookieKey = detectBrowserLanguage.cookieKey
        const code = useCookie<string>(cookieKey).value ?? null

        if (code && I18N_LOCALES.includes(code as (typeof I18N_LOCALES)[number])) {
            locale.value = code as (typeof I18N_LOCALES)[number]
        }
    }

    return locale
}
