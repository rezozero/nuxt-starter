import type { ComponentPublicInstance, ModelRef } from 'vue'
import type { UseFloatingOptions } from '@floating-ui/vue'

export function usePopoverPosition({ button, popover, open, floatingOptions }: {
    button: Ref<HTMLElement | ComponentPublicInstance | null>
    popover: Ref<HTMLElement | ComponentPublicInstance | null>
    open: ModelRef<boolean | undefined>
    floatingOptions?: UseFloatingOptions
}) {
    const isPositioned = ref(false)
    const style: Ref<Record<string, unknown>> = ref({})
    const floatingIsLoading = ref(false)
    const floatingLoaded = ref(false)

    // position disabled on small screen
    const { width } = useWindowSize()
    const positioningDisabled = computed(() => {
        return width.value === Infinity || isNaN(width.value) || width.value < getBreakpointValue('md')
    })

    // load the Floating UI lib on open change
    watch(open, async (newValue) => {
        if (!newValue || positioningDisabled.value) return

        loadFloating()
    }, { immediate: true })

    onMounted(() => {
        // load the Floating UI lib on mouse enter
        const removeMouseEnterListener = useEventListener(unrefElement(button), 'mouseenter', () => {
            if (positioningDisabled.value) return

            removeMouseEnterListener()
            loadFloating()
        })
    })

    // load the Floating UI lib
    async function loadFloating() {
        if (floatingIsLoading.value || floatingLoaded.value) return

        floatingIsLoading.value = true

        const { useFloating, autoUpdate, offset } = await import('@floating-ui/vue')

        floatingIsLoading.value = false
        floatingLoaded.value = true

        const { floatingStyles, isPositioned: floatingIsPositioned, update } = useFloating(button, popover, {
            placement: 'bottom-start',
            whileElementsMounted: autoUpdate,
            open,
            middleware: [offset(20)],
            ...floatingOptions,
        })

        // perform the initial update if needed (i.e. when the popover is already open)
        if (open.value) update()

        // bind the Floating UI values to the local refs
        watch(floatingIsPositioned, value => isPositioned.value = value)
        watch(floatingStyles, value => style.value = value)
    }

    // Move the scroll position if needed
    // https://floating-ui.com/docs/vue#effects
    watch(isPositioned, (isPositioned) => {
        if (isPositioned) {
            nextTick(() => {
                // unrefElement(popover)?.scrollIntoView?.({ block: 'nearest' })
            })
        }
    })

    return { style, positioningDisabled, isPositioned }
}
