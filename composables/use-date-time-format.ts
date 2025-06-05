import type { GeneratedLocale } from '@intlify/core-base'
import { I18N_DEFAULT_TIMEZONE } from '~/constants/i18n'

export type DateTime = Date | string | number

export interface UseDateTimeFormatOptions {
    rangeSeparator?: MaybeRefOrGetter<string>
    startDateFormat?: MaybeRefOrGetter<string | Intl.DateTimeFormatOptions>
    endDateFormat?: MaybeRefOrGetter<string | Intl.DateTimeFormatOptions>
    locale?: MaybeRefOrGetter<string>
}

const RANGE_SEPARATOR: string = ' - '

// Extracts a Date object from a DateTime value.
function getDateFromDateTime(dateTime: Ref<DateTime | undefined>): Date | undefined {
    if (!dateTime.value) return

    if (typeof dateTime.value === 'string') {
        if (!isNaN(Date.parse(dateTime.value))) return new Date(dateTime.value)
    }
    else if (typeof dateTime.value === 'object') {
        return dateTime.value
    }

    return undefined
}

/**
 * Formats a date or a date range for display.
 *
 * It handles both single dates and date ranges.
 * If the dateTime is an array, it will format the first and last dates in the array.
 * If the dateTime is a single DateTime, it will format that date.
 *
 * It uses the VueI18n `datetime()` method to format the dates according to the current locale.
 *
 * We don't use the `Intl.DateTimeFormat` directly here to allow for more flexibility in formatting,
 * such as using custom formats or handling specific cases.
 * The main reasons for this are:
 * - For now, the separator in the `Intl.DateTimeFormat` is not customizable, so we handle the formatting manually.
 * - If we use the `<time>` tag for displaying dates, it requires two separate `<time>` elements
 * for start and end dates because `<time>` does not support date ranges directly.
 *
 *
 * @param dateTime - A DateTime or an array of DateTimes to format.
 */
export function useDateTimeFormat(
    dateTime: MaybeRefOrGetter<DateTime | (DateTime | undefined)[] | undefined>,
    options?: MaybeRefOrGetter<UseDateTimeFormatOptions>,
) {
    const { d } = useI18n()

    const rangeSeparator = computed(() => {
        return toValue(toValue(options)?.rangeSeparator) || RANGE_SEPARATOR
    })

    const startDateTime = computed(() => {
        const dateTimeValue = toValue(dateTime)

        return Array.isArray(dateTimeValue) ? dateTimeValue[0] : dateTimeValue
    })

    const endDateTime = computed(() => {
        const dateTimeValue = toValue(dateTime)

        if (Array.isArray(dateTimeValue) && dateTimeValue.length > 0) {
            return dateTimeValue[dateTimeValue.length - 1]
        }

        return undefined
    })

    const startDate = computed(() => {
        return getDateFromDateTime(startDateTime)
    })

    const endDate = computed(() => {
        return getDateFromDateTime(endDateTime)
    })

    // A date range is defined as two dates that are not the same.
    const isDateRange = computed(
        () =>
            startDate.value
            && endDate.value
            && !(
                startDate.value.getFullYear() === endDate.value.getFullYear()
                && startDate.value.getMonth() === endDate.value.getMonth()
                && startDate.value.getDate() === endDate.value.getDate()
            ),
    )

    const startDateFormat = computed<string | Intl.DateTimeFormatOptions>(() => {
        const startDateFormatOption = toValue(toValue(options)?.startDateFormat)

        if (startDateFormatOption) return startDateFormatOption

        // Dates range -> show start date in a specific format
        if (isDateRange.value) {
            // same year -> show day and month OR day only
            if (startDate.value?.getFullYear() === endDate.value?.getFullYear()) {
                // same month -> show day only
                if (startDate.value?.getMonth() === endDate.value?.getMonth()) {
                    return {
                        day: 'numeric',
                        timeZone: I18N_DEFAULT_TIMEZONE,
                    }
                }
                else {
                    // not the same month -> show day and month
                    return {
                        month: 'short',
                        day: 'numeric',
                        timeZone: I18N_DEFAULT_TIMEZONE,
                    }
                }
            }
            else {
                // not the same year -> show day, month and year
                return {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: I18N_DEFAULT_TIMEZONE,
                }
            }
        }

        // Single date
        const format: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: I18N_DEFAULT_TIMEZONE,
        }

        if ((startDate.value?.getHours() === endDate.value?.getHours()) || !endDate.value) {
            // If both start and end dates have hours, show time
            format.hour = '2-digit'
            format.minute = '2-digit'
        }

        return format
    })

    const endDateFormat = computed<string | Intl.DateTimeFormatOptions>(
        () =>
            toValue(toValue(options)?.endDateFormat) || {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: I18N_DEFAULT_TIMEZONE,
            },
    )

    const formattedStartDateTime = computed(() => {
        return startDate.value
            && d(startDate.value, startDateFormat.value, toValue(toValue(options)?.locale) as GeneratedLocale)
    })

    const formattedEndDateTime = computed(() => {
        if (!isDateRange.value) return undefined

        return endDate.value
            && d(endDate.value, endDateFormat.value, toValue(toValue(options)?.locale) as GeneratedLocale)
    })

    const formattedDateTime = computed(() => {
        if (!isDateRange.value) {
            return formattedStartDateTime.value
        }
        else {
            return `${formattedStartDateTime.value}${rangeSeparator.value}${formattedEndDateTime.value}`
        }
    })

    return {
        rangeSeparator,
        startDate,
        endDate,
        isDateRange,
        formattedStartDateTime,
        formattedEndDateTime,
        formattedDateTime,
    }
}
