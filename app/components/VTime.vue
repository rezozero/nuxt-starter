<script setup lang="ts">
import type { UseDateTimeFormatOptions, DateTime } from '@/composables/use-date-time-format'

const props = defineProps<{
    datetime: MaybeRefOrGetter<DateTime | DateTime[]>
    options?: UseDateTimeFormatOptions
    locale?: UseDateTimeFormatOptions['locale']
    startDateFormat?: UseDateTimeFormatOptions['startDateFormat']
    endDateFormat?: UseDateTimeFormatOptions['endDateFormat']
}>()

const dateTimeFormatOptions = computed<UseDateTimeFormatOptions>(() => ({
    ...props.options,
    locale: props.locale,
    startDateFormat: props.startDateFormat,
    endDateFormat: props.endDateFormat,
}))

const {
    isDateRange,
    rangeSeparator,
    startDate,
    formattedStartDateTime,
    endDate,
    formattedEndDateTime,
} = useDateTimeFormat(props.datetime, dateTimeFormatOptions)
</script>

<template>
    <slot
        v-if="startDate"
        name="start"
        :start-date="startDate"
        :formatted-start-date-time="formattedStartDateTime"
    >
        <time :datetime="startDate.toISOString()">{{ formattedStartDateTime }}</time>
    </slot>
    <slot
        v-if="isDateRange"
        name="range-separator"
        :range-separator="rangeSeparator"
    >
        {{ rangeSeparator }}
    </slot>
    <slot
        v-if="endDate"
        name="end"
        :end-date="endDate"
        :formatted-end-date-time="formattedEndDateTime"
    >
        <time :datetime="endDate.toISOString()">{{ formattedEndDateTime }}</time>
    </slot>
</template>
