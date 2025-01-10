import { localeCodes, nuxtI18nOptions } from '#build/i18n.options.mjs'

// Workaround for useCookieLocale() returning empty string
// @see https://github.com/nuxt-modules/i18n/issues/2975
export function useI18nCookie(): Ref<string> {
    const locale: Ref<string> = ref('')
    const detect = nuxtI18nOptions.detectBrowserLanguage

    if (detect && detect.useCookie) {
        const cookieKey = detect.cookieKey
        const code = useCookie<string>(cookieKey).value ?? null

        if (code && localeCodes.includes(code)) {
            locale.value = code
        }
    }

    return locale
}
