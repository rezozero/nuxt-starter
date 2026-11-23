<script lang="ts" setup>
/**
 * Stands in for `VDatePicker` on the server and while the calendar's chunk loads, drawn on the same
 * grid so the calendar takes its place without moving the content around it.
 */
import { DATE_PICKER_WEEK_START, DAYS_IN_WEEK } from '~/constants/date-picker'

const props = defineProps<{
    // Month the calendar opens on
    month: Date
}>()

// The calendar draws only the weeks that hold a day of the month
const weekCount = computed(() => {
    const year = props.month.getFullYear()
    const month = props.month.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const leadingDays = (firstDay - DATE_PICKER_WEEK_START + DAYS_IN_WEEK) % DAYS_IN_WEEK
    const dayCount = new Date(year, month + 1, 0).getDate()

    return Math.ceil((leadingDays + dayCount) / DAYS_IN_WEEK)
})
</script>

<template>
    <div
        :class="$style.root"
        aria-busy="true"
    >
        <div
            :class="$style.header"
            aria-hidden="true"
        >
            <div
                class="loading-animation"
                :class="$style.arrow"
            />
            <div
                class="loading-animation"
                :class="$style.title"
            />
            <div
                class="loading-animation"
                :class="$style.arrow"
            />
        </div>
        <div
            :class="$style.weeks"
            aria-hidden="true"
        >
            <div :class="[$style.week, $style['week--weekdays']]">
                <div
                    v-for="weekday in DAYS_IN_WEEK"
                    :key="weekday"
                    :class="$style.weekday"
                >
                    <div
                        class="loading-animation"
                        :class="$style['weekday-label']"
                    />
                </div>
            </div>
            <div
                v-for="week in weekCount"
                :key="week"
                :class="$style.week"
            >
                <div
                    v-for="day in DAYS_IN_WEEK"
                    :key="day"
                    class="loading-animation"
                    :class="$style.day"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
// Mirrors the overrides of `VDatePicker` on the calendar's markup
.root {
    width: 100%;
    max-width: $date-picker-max-width;
    margin-inline: auto;
}

.header {
    display: flex;
    min-height: $date-picker-header-height;
    align-items: center;
    justify-content: space-between;
}

.arrow {
    width: $date-picker-arrow-size + 2 * $date-picker-arrow-padding;
    height: $date-picker-arrow-size + 2 * $date-picker-arrow-padding;
    border-radius: 4px;
}

.title {
    width: 120px;
    height: 1em;
    border-radius: 100vmax;
}

.weeks {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    gap: $date-picker-day-gap;
}

.week {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(7, $date-picker-day-size + $date-picker-day-gap);

    &--weekdays {
        margin-bottom: $date-picker-day-gap;
    }
}

.weekday {
    padding: 4px;
    font-size: px-to-rem(12);
}

.weekday-label {
    width: 1em;
    height: 1lh;
    border-radius: 100vmax;
    margin-inline: auto;
}

.day {
    width: $date-picker-day-size;
    height: $date-picker-day-size;
    border-radius: 50%;
    margin-inline: auto;
}
</style>
