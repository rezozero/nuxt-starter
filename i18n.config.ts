import type { I18nOptions } from 'vue-i18n'

export const I18N_LOCALES = ['fr']
export const I18N_DEFAULT_LOCALE = 'fr'
export const I18N_DEFAULT_TIMEZONE = 'Europe/Paris'

// defineI18nConfig() does not work, therefore we need to type the config object
export default {
    datetimeFormats: I18N_LOCALES.reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: {
                // 28 jan. 2021
                'short': {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // 20:15
                'hour': {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // 28 jan. 2021 20:15
                'short-hour': {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // 28 jan.
                'short-date-only': {
                    day: 'numeric',
                    month: 'short',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // monday
                'weekday': {
                    weekday: 'long',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // 28
                'date': {
                    day: 'numeric',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // mon. 28 jan. 2021
                'long-date': {
                    day: 'numeric',
                    weekday: 'short',
                    month: 'short',
                    year: 'numeric',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
                // mon. 28 jan. 2021 20:15
                'long-date-hour': {
                    day: 'numeric',
                    weekday: 'short',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
            },
        }),
        {},
    ),
} satisfies I18nOptions
