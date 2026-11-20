interface LocaleWithLanguage {
    code: string
    language?: string
}

/**
 * Open Graph locale (`fr_FR`) of an i18n locale code, from its BCP 47 `language` (`fr-FR`).
 * Undefined when the locale is unknown or has no `language`, rather than an invalid `og:locale`.
 */
export function getOgLocale(code: string, locales: readonly LocaleWithLanguage[]): string | undefined {
    return locales.find(locale => locale.code === code)?.language?.replace('-', '_')
}
