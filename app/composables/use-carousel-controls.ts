import type { ModelRef } from 'vue'

export interface VCarouselControlsOptions {
    displayNumbers?: boolean
    snapLength: MaybeRefOrGetter<number>
    index: ModelRef<number>
}

function formatValue(n: number) {
    return String(n + 1).padStart(2, '0')
}

export function useCarouselControls(options: VCarouselControlsOptions) {
    const { t } = useI18n()

    const numbersOutput = computed(() => {
        if (!options.displayNumbers) return

        const index = toValue(options.index)
        const length = toValue(options.snapLength)

        return `${formatValue(index)} / ${formatValue(length - 1)}`
    })

    function onButtonClicked(event: Event) {
        const el = event.currentTarget as HTMLButtonElement
        const index = toValue(options.index)
        if (el.name === 'next') {
            options.index.value = Math.min(index + 1, toValue(options.snapLength) - 1)
        }
        else if (el.name === 'previous') {
            options.index.value = Math.max(index - 1, 0)
        }
    }

    const isCarouselDraggable = computed(() => {
        const length = toValue(options.snapLength)
        return !!length && length > 1
    })

    const nextDisabled = computed(() => {
        const index = toValue(options.index)
        const length = toValue(options.snapLength)

        return index === length - 1 || !length
    })

    const nextButtonAttrs = computed(() => {
        return {
            'disabled': nextDisabled.value,
            'name': 'next',
            'iconName': 'arrow-right',
            'aria-label': t('carousel.next_slide_aria'),
            'onClick': onButtonClicked,
        }
    })

    const previousDisabled = computed(() => toValue(options.index) === 0)
    const prevButtonAttrs = computed(() => {
        return {
            'disabled': previousDisabled.value,
            'name': 'previous',
            'iconName': 'arrow-left',
            'aria-label': t('carousel.previous_slide_aria'),
            'onClick': onButtonClicked,
        }
    })

    return {
        numbersOutput,
        onButtonClicked,
        nextButtonAttrs,
        prevButtonAttrs,
        previousDisabled,
        nextDisabled,
        isCarouselDraggable,
    }
}
