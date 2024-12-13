import { I18N_LOCALES } from '~/i18n/i18n.config'

export function isAvailableI18nLocale(locale: string): locale is typeof I18N_LOCALES[number] {
    return (I18N_LOCALES as unknown as string[]).includes(locale)
}
