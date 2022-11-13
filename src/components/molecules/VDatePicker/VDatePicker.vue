<template>
    <v-calendar-date-picker
        ref="datePicker"
        :value="value"
        :class="[$style.root, isDragging && $style['root--dragging']]"
        :attributes="attrsToday"
        :select-attribute="attrs"
        :drag-attribute="attrs"
        :locale="$i18n.locale"
        is-range
        :columns="numColumns"
        @input="onInput"
        @drag="onDrag"
        @dayclick="onDayClick"
    >
    </v-calendar-date-picker>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { endOfDay, startOfDay } from 'date-fns'
import { getBreakpointValue } from '~/utils/media'

export interface DateRange {
    start: Date
    end: Date
}

export interface Day {
    date: Date
    range: DateRange
}

interface DatePicker extends Vue {
    updateValue(value: Date | DateRange | null): void // not into the official public API
    move(value: string | number | object | Date): Promise<void>
}

export default Vue.extend({
    name: 'VDatePicker',
    components: {
        // @ts-ignore no declaration file
        VCalendarDatePicker: () => import('v-calendar/lib/components/date-picker.umd'),
    },
    props: {
        value: Object as PropType<DateRange | null>,
    },
    data() {
        return {
            isDragging: false,
            attrs: Object.freeze({
                highlight: {
                    start: {
                        class: this.$style.highlight,
                        contentClass: this.$style['highlight-content'],
                    },
                    base: {
                        class: this.$style.range,
                    },
                    end: {
                        class: [this.$style.highlight, this.$style['highlight--end']].join(' '),
                        contentClass: [this.$style['highlight-content'], this.$style['highlight-content--end']].join(
                            ' '
                        ),
                    },
                },
            }),
            attrsToday: Object.freeze([
                {
                    highlight: {
                        class: this.$style.today,
                        contentClass: this.$style['today-content'],
                    },
                    dates: new Date(),
                },
            ]),
        }
    },
    computed: {
        numColumns(): number {
            return this.$store.state.windowWidth >= getBreakpointValue('md') ? 2 : 1
        },
    },
    watch: {
        value() {
            ;(this.$refs.datePicker as DatePicker)?.move(this.value?.start || new Date())
        },
    },
    mounted() {
        document.addEventListener('click', this.onDocumentClick)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.onDocumentClick)
    },
    methods: {
        onInput(value: DateRange) {
            const userInteraction = this.isDragging
            const result = value && { start: startOfDay(value.start), end: endOfDay(value.end) }

            this.isDragging = false

            this.$emit('input', result, { userInteraction })
        },
        onDrag() {
            this.isDragging = true
        },
        onDayClick(day: Day) {
            if (!this.isDragging) return

            this.$emit('input', day.range, { userInteraction: true })
        },
        onDocumentClick(event: MouseEvent) {
            if (
                !event.target ||
                !this.$refs.datePicker ||
                (this.$refs.datePicker as Vue).$el.contains(event.target as Node)
            ) {
                return
            }

            if (this.isDragging) {
                this.$nextTick(() => {
                    ;(this.$refs.datePicker as DatePicker).updateValue(this.value)
                })
            }

            this.isDragging = false
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

/**
 * ⚠️ !important overrides DatePicker (vendor) style
 */

.root {
    width: 100% !important;
    max-width: 340px !important;
    border: none !important;

    &[columns='2'] {
        max-width: 660px !important;
    }
}

.root :global .vc-header {
    padding-bottom: rem(27) !important;
}

.root :global .vc-title {
    color: color(black);
    font-weight: normal !important;
}

.root :global .vc-arrow {
    color: color(black);
}

.root :global .vc-weekday {
    font-weight: normal !important;
}

.root :global .vc-day {
    padding: 1px;
}

.root :global .vc-day-content {
    width: 36px !important;
    height: 36px !important;
    font-weight: normal !important;

    &:focus {
        background-color: color(black) !important;
        color: #fff;
        font-weight: normal !important;
    }
}

.root :global .vc-pane {
    padding: 0 20px;
}

.today {
    width: 36px !important;
    height: 36px !important;
    background-color: rgba(color(black), 0.1);
}

.today-content {
    font-weight: bold;
}

.highlight {
    width: 36px !important;
    height: 36px !important;
    background-color: color(black);

    @media (hover: hover) {
        .root--dragging:not(:hover) & {
            visibility: hidden;
        }
    }
}

.highlight-content {
    color: #fff;

    @media (hover: hover) {
        .root--dragging:not(:hover) &:not(:focus) {
            color: inherit;
        }
    }
}

.range {
    height: 36px !important;
    background-color: rgba(color(black), 0.1);

    @media (hover: hover) {
        .root--dragging:not(:hover) & {
            visibility: hidden;
        }
    }
}
</style>
