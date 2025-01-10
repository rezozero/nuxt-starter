import { I18N_LOCALES } from '~/constants/i18n'

export function isAvailableI18nLocale(locale: string): locale is typeof I18N_LOCALES[number] {
    return (I18N_LOCALES as unknown as string[]).includes(locale)
}
