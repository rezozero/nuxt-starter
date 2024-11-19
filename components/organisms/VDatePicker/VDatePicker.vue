<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { DatePickerModel } from 'v-calendar/src/use/datePicker'
import type { SimpleDateRange } from 'v-calendar/dist/types/src/utils/date/range'

const [currentDate, modelModifiers] = defineModel<DatePickerModel>()

const datePickerInstance = ref<ComponentPublicInstance | null>(null)
const DatePicker = defineAsyncComponent({
    loader: () => Promise.all([
        import('v-calendar').then(module => module.DatePicker),
        import('v-calendar/style.css'),
    ]).then(([DatePicker]) => DatePicker),
})

// Calendar style
const $style = useCssModule()
const attributes = [
    {
        key: 'today',
        bar: {
            class: $style.today,
        },
        dates: new Date(),
    },
]
const selectAttribute = {
    highlight: {
        start: {
            class: [$style.highlight, $style['highlight--start']],
            contentClass: [$style['highlight-content--start']],
        },
        base: {
            class: [$style.highlight, $style['highlight--in-between']],
            contentClass: [$style['highlight-content--in-between']],
        },
        end: {
            class: [$style.highlight, $style['highlight--end']],
            contentClass: [$style['highlight-content--end']],
        },
    },
}

// DatePicker style
// Use direction for hide unselected date when leave calendar (When single date is selected)
const dragDirection = ref<'forward' | 'backward' | null>(null)
const draggingRange = ref<SimpleDateRange | null>(null)

function onDrag(range: SimpleDateRange) {
    draggingRange.value = range

    if (currentDate.value && 'start' in currentDate.value) {
        dragDirection.value = range.start < currentDate.value.start ? 'backward' : 'forward'
    }
    else {
        dragDirection.value = null
    }
}

function onDayClick() {
    currentDate.value = draggingRange.value
}
</script>

<template>
    <DatePicker
        ref="datePickerInstance"
        v-model="currentDate"
        :attributes="attributes"
        :class="[$style.root, dragDirection && $style[`root--drag-direction-${dragDirection}`]]"
        :drag-attribute="selectAttribute"
        :input-debounce="0"
        :locale="$i18n.locale"
        :masks="{ weekdays: 'WW' }"
        :model-modifiers="modelModifiers"
        borderless
        color="rz-dark"
        transparent
        @dayclick="onDayClick"
        @drag="onDrag"
    >
        <template #header-prev-button>
            {{ '<' }}
        </template>
        <template #header-next-button>
            {{ '>' }}
        </template>
    </DatePicker>
</template>

<style lang="scss" module>
@use 'sass:math';
@use "assets/scss/functions/rem" as *;

//
//  ⚠️ Overrides DatePicker (vendor) style
//

.root:global(.vc-container) {
    width: 100%;
    max-width: rem(380);

    &[columns='2'] {
        max-width: rem(660);
    }
}

.root ~ :global(.vc-popover-content-wrapper .vc-rz-dark.vc-light), // (Month modal)
.root:global(.vc-rz-dark.vc-light) {
    --vc-accent-50: #fff;
    --vc-accent-100: #fff;
    --vc-accent-200: #f0f0f0;
    --vc-accent-500: #757575;
    --vc-accent-600: #010101;
    --vc-accent-900: #010101;
    --vc-gray-50: #fff;
    --vc-gray-100: #f0f0f0;
    --vc-gray-200: #f0f0f0;
    --vc-gray-500: #010101;
    --vc-nav-item-active-bg: #010101;
    --vc-nav-hover-bg: #f0f0f0;
    --vc-rounded-full: initial;
    --vc-rounded: initial; // arrow
    --vc-day-content-hover-bg: rgba(1, 1, 1, 10%);
    --vc-focus-ring: none; // default: 0 0 0 2px rgba(150, 150, 150, 0.4);
}

.root :global(.vc-header.is-lg) {
    --vc-text-lg: #{rem(20)};

    margin-top: initial;
}

.root :global(.vc-weeks) {
    margin-top: rem(16);
}

.root :global(.vc-weekday) {
    text-transform: uppercase;
}

// Remove last row if all days are in the next month
.root :global(.vc-week:last-child:has(div.is-not-in-month:first-child):has(div.is-not-in-month:last-child)) {
    display: none;
}

// Month container
.root ~ :global(.vc-popover-content-wrapper .vc-popover-content) {
    padding: 12px;
}

// Remove some drag style when calendar has unique date selected and when calendar isn't hovering
.highlight {
    :global(.vc-weeks):not(:hover) & {
        &--in-between {
            background-color: initial !important;
        }

        &-content--in-between {
            font-weight: initial;
        }
    }

    .root--drag-direction-forward :global(.vc-weeks):not(:hover) & {
        &--end {
            background-color: initial !important;
        }

        &-content--end {
            color: initial;
            font-weight: initial;
        }
    }

    .root--drag-direction-backward :global(.vc-weeks):not(:hover) & {
        &--start {
            background-color: initial !important;
        }

        &-content--start {
            color: initial;
            font-weight: initial;
        }
    }
}

// Today style
.root :global(.vc-bars) {
    width: initial;
}

.root .today {
    width: 28px;
}
</style>
