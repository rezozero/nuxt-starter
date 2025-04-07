import type { Ref } from 'vue'

export interface VCarouselControlsOptions {
    displayNumbers?: boolean
    snapLength: Ref<number>
    index: Ref<number>
}

function formatValue(n: number) {
    return (n < 9 ? '0' : '') + (n + 1)
}

export function useCarouselControls(options: VCarouselControlsOptions) {
    const { t } = useI18n()

    const numbersOutput = computed(() => {
        if (!options.displayNumbers) return

        return `${formatValue(toValue(options.index))} / ${formatValue(toValue(options.snapLength) - 1)}`
    })

    function onButtonClicked(event: Event) {
        const el = event.currentTarget as HTMLButtonElement

        if (el.name === 'next') options.index.value = toValue(options.index) + 1
        else if (el.name === 'previous') options.index.value = toValue(options.index) - 1
    }

    const isCarouselDraggable = computed(() => {
        const length = toValue(options.snapLength)
        return !!length && length > 1
    })

    const nextDisabled = computed(() => {
        return (toValue(options.index) === toValue(options.snapLength) - 1) || !toValue(options.snapLength)
    })

    const nextButtonAttrs = computed(() => {
        return {
            disabled: nextDisabled.value,
            name: 'next',
            iconName: 'arrow-right',
            ariaLabel: t('carousel.next_slide_aria'),
            onClick: onButtonClicked,
        }
    })

    const previousDisabled = computed(() => toValue(options.index) === 0)
    const prevButtonAttrs = computed(() => {
        return {
            disabled: previousDisabled.value,
            name: 'previous',
            iconName: 'arrow-left',
            ariaLabel: t('carousel.previous_slide_aria'),
            onClick: onButtonClicked,
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
