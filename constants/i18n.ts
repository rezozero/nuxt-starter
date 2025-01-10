import type { DetectBrowserLanguageOptions } from '@nuxtjs/i18n/dist/module'

export const I18N_LOCALES = ['fr', 'en'] as const
export const I18N_DEFAULT_LOCALE = 'fr'
export const I18N_DEFAULT_TIMEZONE = 'Europe/Paris'
export const I18N_DETECT_BROWSER_LANGUAGE: DetectBrowserLanguageOptions | false = {
    useCookie: true,
}
