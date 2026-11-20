<script lang="ts" setup>
import type { Locale } from 'date-fns'
import { defineAsyncComponent } from 'vue'
import { DATE_PICKER_WEEK_START, DAYS_IN_WEEK } from '~/constants/date-picker'
import { I18N_DEFAULT_LOCALE, type I18N_LOCALES } from '~/constants/i18n'

type SiteLocale = typeof I18N_LOCALES[number]

// One chunk per site locale, only the page's one is fetched. Adding a site locale fails to compile until it has its own
const DATE_FNS_LOCALE_LOADERS: Record<SiteLocale, () => Promise<Locale>> = {
    fr: () => import('date-fns/locale/fr').then(module => module.fr),
}

function isSiteLocale(code: string): code is SiteLocale {
    return code in DATE_FNS_LOCALE_LOADERS
}

// Placeholder and calendar share the attributes (a width set by the parent, say)
defineOptions({ inheritAttrs: false })

const props = defineProps<{
    // Picks a start and an end, the model is then `[start, end]`
    range?: boolean
}>()

const currentDate = defineModel<Date | Date[] | null>()

type PickerValue = Date | Date[] | null | undefined

// The calendar holds a start without its end, the model gets a one-day range meanwhile: it can be applied as is.
// Coming back from the model, that day shows as a full range, which a next click replaces
const pickerDate = shallowRef<PickerValue>(currentDate.value)
let emittedDate: PickerValue

function onPickerUpdate(value: Date | Date[] | null) {
    pickerDate.value = value

    const [start, end] = Array.isArray(value) ? value : []
    emittedDate = props.range && start && !end ? [start, start] : value
    currentDate.value = emittedDate
}

// Compared by day: the parent may hand the dates back rebuilt, at another time of day
function toDays(value: PickerValue) {
    return (Array.isArray(value) ? value : [value]).map(date => date?.toDateString()).join()
}

// Our own one-day range coming back must not overwrite the start the calendar holds
watch(currentDate, (value) => {
    if (toDays(value) !== toDays(emittedDate)) pickerDate.value = value
})

const { locale, t } = useI18n()

// Nothing renders while the chunk is in flight: the placeholder holds the room meanwhile
const dateFnsLocale = shallowRef<Locale>()

async function loadDateFnsLocale(code: string) {
    const loaded = await DATE_FNS_LOCALE_LOADERS[isSiteLocale(code) ? code : I18N_DEFAULT_LOCALE]()

    // A later language switch may have landed first
    if (code === locale.value) dateFnsLocale.value = loaded
}

const isChunkLoaded = ref(false)
const DatePicker = defineAsyncComponent({
    loader: () => Promise.all([
        import('@vuepic/vue-datepicker').then(module => module.VueDatePicker),
        import('@vuepic/vue-datepicker/dist/main.css'),
        loadDateFnsLocale(locale.value),
    ]).then(([VueDatePicker]) => {
        isChunkLoaded.value = true

        return VueDatePicker
    }),
})

// The language may switch without remounting the calendar: the previous locale shows until the new one lands
watch(locale, loadDateFnsLocale)

// The locale chunk lands before the calendar's: waiting for it alone would leave a blank between the two
const isLoaded = computed(() => isChunkLoaded.value && !!dateFnsLocale.value)

// Years offered by the year panel, around the current one
const YEAR_SPAN = 5
const currentYear = new Date().getFullYear()
const yearRange: [number, number] = [currentYear - YEAR_SPAN, currentYear + YEAR_SPAN]

// Esc goes through to the popover around (if any), the inline calendar has no menu of its own to close
const config = { escClose: false }

// Month the calendar opens on: the start of the selection, today otherwise
const startDate = computed(() => {
    const value = currentDate.value

    return (Array.isArray(value) ? value[0] : value) ?? new Date()
})

const dayLabelFormat = computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'full' }))
const weekDayLabels = computed(() => {
    const format = new Intl.DateTimeFormat(locale.value, { weekday: 'long' })

    // 2023-12-31 is a Sunday (day 0): the first column falls DATE_PICKER_WEEK_START days later
    return Array.from(
        { length: DAYS_IN_WEEK },
        (_, index) => format.format(new Date(2023, 11, 31 + DATE_PICKER_WEEK_START + index)),
    )
})

const ariaLabels = computed(() => ({
    menu: t('date_picker.label'),
    prevMonth: t('date_picker.previous_month'),
    nextMonth: t('date_picker.next_month'),
    prevYear: t('date_picker.previous_year'),
    nextYear: t('date_picker.next_year'),
    openMonthsOverlay: t('date_picker.choose_month'),
    openYearsOverlay: t('date_picker.choose_year'),
    monthPicker: () => t('date_picker.choose_month'),
    yearPicker: () => t('date_picker.choose_year'),
    toggleOverlay: t('date_picker.back'),
    day: (day: { value: Date }) => dayLabelFormat.value.format(day.value),
    weekDay: (index: number) => weekDayLabels.value[index] ?? '',
}))

const $style = useCssModule()
const ui = {
    menu: $style.menu,
    calendar: $style.calendar,
    calendarCell: $style.cell,
}
</script>

<template>
    <!-- Server side and until the calendar's chunk lands: same grid, no layout shift, no hydration of the vendor -->
    <VDatePickerPlaceholder
        v-if="!isLoaded"
        v-bind="$attrs"
        :month="startDate"
    />
    <ClientOnly>
        <DatePicker
            v-bind="$attrs"
            :model-value="pickerDate"
            :class="$style.root"
            :range="props.range"
            :start-date="startDate"
            focus-start-date
            :locale="dateFnsLocale"
            :week-start="DATE_PICKER_WEEK_START"
            :year-range="yearRange"
            :formats="{ weekDay: 'EEEEE', month: 'LLLL' }"
            :aria-labels="ariaLabels"
            :ui="ui"
            :time-config="{ enableTimePicker: false }"
            :config="config"
            inline
            auto-apply
            arrow-navigation
            hide-offset-dates
            @update:model-value="onPickerUpdate"
        >
            <template #arrow-left>
                <VIcon
                    name="arrow-left"
                    :class="$style.arrow"
                />
            </template>
            <template #arrow-right>
                <VIcon
                    name="arrow-right"
                    :class="$style.arrow"
                />
            </template>
        </DatePicker>
    </ClientOnly>
</template>

<style lang="scss" module>
//
//  ⚠️ Overrides DatePicker (vendor) style
//

$day-size: $date-picker-day-size;
$day-gap: $date-picker-day-gap;

.root {
    // Theme of the calendar: override these from the parent (or a theme) rather than the vendor variables
    --v-date-picker-color: #010101;
    --v-date-picker-background: #fff;
    --v-date-picker-hover-background: #f0f0f0;
    --v-date-picker-selected-color: #fff;
    --v-date-picker-selected-background: #010101;
    --v-date-picker-selected-hover-background: #333;
    --v-date-picker-range-background: #f0f0f0;
    --v-date-picker-today-border-color: #757575;
    --v-date-picker-button-background: transparent;
    --v-date-picker-button-hover-background: #f0f0f0;
    --v-date-picker-button-pressed-background: #e0e0e0;
    --v-date-picker-button-radius: 4px;

    width: 100%;
    max-width: $date-picker-max-width;
    margin-inline: auto;

    // Nested under the root: wins over the vendor theme class, which sets the same variables on the menu
    .menu {
        --dp-font-family: inherit;

        // Text buttons (month, year, panel items) take the radius of the buttons, the days stay round
        --dp-border-radius: var(--v-date-picker-button-radius);
        --dp-cell-border-radius: 50vmax;
        --dp-cell-size: #{$day-size};
        --dp-cell-padding: 0;
        --dp-row-margin: 0;
        --dp-menu-padding: 0;
        --dp-menu-min-width: 0;
        --dp-calendar-wrap-padding: 0;
        --dp-month-year-row-height: #{$date-picker-header-height};
        --dp-month-year-row-button-size: auto;
        --dp-background-color: var(--v-date-picker-background);
        --dp-text-color: var(--v-date-picker-color);
        --dp-hover-color: var(--v-date-picker-hover-background);
        --dp-hover-text-color: var(--v-date-picker-color);

        // The vendor greys the icon buttons' icon on hover (arrows, panels' bottom button): a lighter shift
        --dp-hover-icon-color: color-mix(in srgb, var(--v-date-picker-color) 70%, transparent);
        --dp-primary-color: var(--v-date-picker-selected-background);
        --dp-primary-text-color: var(--v-date-picker-selected-color);
        --dp-range-between-dates-background-color: var(--v-date-picker-range-background);
        --dp-range-between-dates-text-color: var(--v-date-picker-color);
        --dp-range-between-border-color: transparent;

        border: none;
    }

    // The menu shrinks to its content in the vendor flex row: it takes the full width, like the placeholder
    :global(.dp--outer-menu-wrap) {
        flex-grow: 1;
    }

    // Header: month and year centered between two icon buttons
    :global(.dp--month-year-wrap .dp--month-year-wrap) {
        justify-content: center;
    }

    :global(.dp--arrow-btn-nav) {
        padding: 0;
    }

    // Icon buttons: the month arrows and the panels' way back to the days
    :global(.dp--inner-nav),
    :global(.dp--overlay-action) {
        padding: $date-picker-arrow-padding;
        border-radius: var(--v-date-picker-button-radius);
        background-color: var(--v-date-picker-button-background);
        color: var(--v-date-picker-color);
        transition: background-color 0.2s;

        @media (hover: hover) {
            &:hover {
                background-color: var(--v-date-picker-button-hover-background);
            }
        }

        &:active {
            background-color: var(--v-date-picker-button-pressed-background);
        }
    }

    // The vendor stretches it along the panel's bottom edge
    :global(.dp--overlay-action) {
        width: fit-content;
        height: auto;
        inset-inline: 0;
        margin-inline: auto;
    }

    :global(.dp--month-year-select) {
        width: auto;
        padding: 2px 4px;
        color: var(--v-date-picker-color);
        font-weight: 600;
        text-transform: capitalize;
    }

    // Weeks grid: days separated by a gap, the columns take the gap so that
    // the range band runs continuously from one day to the next
    :global(.dp--calendar-header),
    :global(.dp--calendar-row) {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(7, $day-size + $day-gap);
    }

    // The weekdays sit outside the weeks' flex column: their margin also stands for the row gap
    :global(.dp--calendar-header) {
        margin-block: 16px 2 * $day-gap;
    }

    :global(.dp--calendar-header-item) {
        width: auto;
        height: auto;
        padding: 4px;
        font-size: px-to-rem(12);
        font-weight: 600;
        text-transform: uppercase;
    }

    :global(.dp--calendar-header-separator) {
        display: none;
    }

    :global(.dp--calendar) {
        display: flex;
        flex-direction: column;
        gap: $day-gap;
    }

    // Range band: the in-between days fill their column (see `.cell`), the ends (selected or hovered)
    // their inner half. The vendor tracks the hover on the column, gap included, so the styles follow
    // the column's `:hover`, never the day's. An end only gets its half when the band runs on to the other end:
    // a lone start, hovered or not, keeps its circle alone
    :global(.dp--calendar:has(.dp--range-between, .dp--range-border-end, .dp--date-hoverable-end) .dp--calendar-item:has(.dp--range-border-start):not(:has(.dp--range-border-end))),
    :global(.dp--calendar-item:has(.dp--date-hoverable-start)) {
        background: linear-gradient(to right, transparent 50%, var(--dp-range-between-dates-background-color) 50%);
    }

    :global(.dp--calendar:has(.dp--range-between, .dp--range-border-start, .dp--date-hoverable-start) .dp--calendar-item:has(.dp--range-border-end):not(:has(.dp--range-border-start))),
    :global(.dp--calendar-item:has(.dp--date-hoverable-end)) {
        background: linear-gradient(to left, transparent 50%, var(--dp-range-between-dates-background-color) 50%);
    }

    // Range being picked: the vendor keeps the last hovered day until the pointer leaves the menu.
    // The preview only lasts while the pointer is over the weeks, row gaps included
    :global(.dp--calendar:not(:hover):has(.dp--date-hoverable-start, .dp--date-hoverable-end)) {
        --dp-range-between-dates-background-color: transparent;
        --dp-range-between-dates-text-color: var(--dp-text-color);
    }

    // Today and the hovered day keep their circle inside the band: their column paints the band instead
    :global(.dp--calendar-item:has(.dp--range-between.dp--today)),
    :global(.dp--calendar-item:hover:has(.dp--range-between)) {
        background-color: var(--dp-range-between-dates-background-color);
    }

    :global(:is(.dp--overlay-cell, .dp--overlay-cell-active)) {
        text-transform: capitalize;
    }

    @media (hover: hover) {
        :global(.dp--overlay-cell-active:hover) {
            background-color: var(--v-date-picker-selected-hover-background);
        }
    }
}

// Weeks grid: the month change slides it sideways, which must not scroll its container
.calendar {
    overflow-x: clip;
}

// Day
.cell {
    // Darker than the header buttons, which share the vendor hover color
    --dp-hover-color: var(--v-date-picker-selected-hover-background);
    --dp-hover-text-color: var(--v-date-picker-selected-color);

    font-size: px-to-rem(14);

    // The column is wider than the day (gap included)
    margin-inline: auto;

    // The vendor transitions `all` on hover: the shape and width must switch at once
    &:global(.dp--cell-inner):hover {
        transition-property: background-color, border-color, color;
    }

    &:global(.dp--range-between:not(.dp--today)) {
        width: 100%;
    }

    &:global(.dp--range-between.dp--today) {
        border-radius: var(--dp-cell-border-radius);
    }

    // The range ends stay circles: the vendor squares their inner side
    &:global(.dp--range-border-start),
    &:global(.dp--range-border-end) {
        border-radius: 50%;
    }

    &:global(.dp--today) {
        border-color: var(--v-date-picker-today-border-color);
    }

    // End of a range being picked: it looks selected as long as the band runs to it (see the preview above).
    // Doubled class: wins over the vendor `:hover` rule that squares its inner side, loaded after this one
    &:global(.dp--cell-inner.dp--date-hoverable-start),
    &:global(.dp--cell-inner.dp--date-hoverable-end) {
        border-radius: 50%;
        background-color: var(--dp-primary-color);
        color: var(--dp-primary-text-color);

        :global(.dp--calendar:not(:hover)) & {
            background-color: transparent;
            color: var(--dp-text-color);
        }
    }

    // Hovered column (see the range band)
    :global(.dp--calendar-item:hover) > & {
        &:global(.dp--date-hoverable) {
            background-color: var(--dp-hover-color);
            color: var(--dp-hover-text-color);
        }

        &:global(.dp--range-between) {
            width: var(--dp-cell-size);
            border-radius: var(--dp-cell-border-radius);
        }

        &:global(.dp--active) {
            background-color: var(--v-date-picker-selected-hover-background);
        }
    }
}

.arrow {
    display: block;
    width: $date-picker-arrow-size;
    height: $date-picker-arrow-size;
}
</style>
