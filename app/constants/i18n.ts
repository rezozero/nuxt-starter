// `language` is the BCP 47 tag, read by the browser language detection and `og:locale`
export const I18N_LOCALE_OBJECTS = [
    { code: 'fr', language: 'fr-FR' },
] as const
export const I18N_LOCALES = I18N_LOCALE_OBJECTS.map(locale => locale.code)
export const I18N_DEFAULT_LOCALE = 'fr'
export const I18N_DEFAULT_TIMEZONE = 'Europe/Paris'
