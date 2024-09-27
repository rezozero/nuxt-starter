<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
    datetime: [Date, String, Boolean, Array] as PropType<Date | string | false | (string | Date | false)[]>,
    locale: String,
    singleDateFormat: String,
    multipleDateFormat: String,
})

const i18n = useI18n()
const localizeHour = useLocalizeHour()
const locale = computed(() => props.locale || i18n.locale.value)

function getDateTime(date: Date, options?: { hours: boolean }): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2)

    let result = `${date.getFullYear()}-${month}-${date.getDate()}`

    if (options?.hours) {
        const hours = ('0' + date.getHours()).slice(-2)
        const minutes = ('0' + date.getMinutes()).slice(-2)

        result += `T${hours}:${minutes}`
    }

    return result
}

// START
const start = computed(() => (Array.isArray(props.datetime) ? props.datetime[0] : props.datetime))
const startDate = computed(() => {
    if (!start.value) return

    if (typeof start.value === 'string') {
        if (!isNaN(Date.parse(start.value))) return new Date(start.value)
    }
    else if (typeof start.value === 'object') {
        return start.value
    }

    return undefined
})
const startDateTime = computed(() => startDate.value && getDateTime(startDate.value))
const startDateFormat = computed(() => {
    if (startDate.value?.getFullYear() === endDate.value?.getFullYear()) {
        if (startDate.value?.getMonth() === endDate.value?.getMonth()) return 'date'
        else return 'short-date-only'
    }

    return 'short'
})
const startDateText = computed(() => {
    if (!startDate.value) return

    // Date range
    if (isDateRange.value) {
        return i18n.d(startDate.value, startDateFormat.value, locale.value)
    }

    // Single date
    const format = Array.isArray(props.datetime) ? 'short' : 'short-hour'

    let result = i18n.d(startDate.value, format, locale.value)

    // TODO: better way to change the hour separator?
    if (locale.value === 'fr') {
        result = localizeHour(result)

        if (result.substring(result.length - 2) === '00') {
            result = result.substring(0, result.length - 2)
        }
    }

    return result
})

// END
const end = computed(() => {
    if (Array.isArray(props.datetime) && props.datetime.length > 0) {
        return props.datetime[props.datetime.length - 1]
    }

    return undefined
})
const endDate = computed(() => {
    if (!end.value) return

    if (typeof end.value === 'string') {
        if (!isNaN(Date.parse(end.value))) return new Date(end.value)
    }
    else if (typeof end.value === 'object') {
        return end.value
    }

    return undefined
})
const endDateTime = computed(() => endDate.value && getDateTime(endDate.value))
const endDateText = computed(() => endDate.value && i18n.d(endDate.value, 'short', locale.value))

// IS DATE RANGE
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
</script>

<template>
    <span v-if="isDateRange">
        <time :datetime="startDateTime">{{ startDateText }}</time> –
        <time :datetime="endDateTime">{{ endDateText }}</time>
    </span>
    <time
        v-else
        :datetime="startDateTime"
    >{{ startDateText }}</time>
</template>

<style module lang="scss"></style>
