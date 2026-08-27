import type { Ref } from 'vue'

/**
 * Provides carousel JS scroll state and controls
 * for a native scroll container using scroll-snap.
 */
export const useNativeCarouselScroll = (options: {
    element: Ref<HTMLElement | null>
    isDragging?: Ref<boolean>
}) => {
    const { element, isDragging } = options
    const canPrev = ref(false)
    const canNext = ref(false)
    const currentIndex = ref(0)
    const progress = ref(0)
    const slideCount = ref(0)
    const isSnapping = ref(false)

    let cachedOffsets: number[] = []

    const cacheLayout = (): void => {
        const el = element.value
        if (!el) return
        const children = Array.from(el.children) as HTMLElement[]
        const firstOffset = children[0]?.offsetLeft ?? 0
        cachedOffsets = children.map(c => c.offsetLeft - firstOffset)
        slideCount.value = children.length
    }

    /**
     * Update scroll states when the container scrolls
     */
    const onScroll = (): void => {
        const el = element.value
        if (!el) return

        const { scrollLeft, clientWidth, scrollWidth } = el

        // canPrev, canNext
        canPrev.value = scrollLeft > 1
        canNext.value = scrollLeft + clientWidth < scrollWidth - 1

        // progress
        const scrollable = scrollWidth - clientWidth
        progress.value = !canNext.value ? 1 : scrollable > 0 ? scrollLeft / scrollable : 0

        // Cap offsets at maxScroll so the last slide acts as a virtual snap point
        const maxScroll = scrollable
        let closest = 0
        let minDiff = Infinity
        for (let i = 0; i < cachedOffsets.length; i++) {
            const diff = Math.abs(Math.min(cachedOffsets[i] ?? 0, maxScroll) - scrollLeft)
            if (diff < minDiff) {
                minDiff = diff
                closest = i
            }
        }
        currentIndex.value = closest
    }

    /**
     * Scroll to a specific slide index
     */
    const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth'): void => {
        cacheLayout()
        const el = element.value
        if (!el) return
        const targetScroll = cachedOffsets[index]
        if (targetScroll == null) return
        if (behavior === 'smooth' && Math.abs(el.scrollLeft - targetScroll) < 1) return

        el.scrollTo({ left: targetScroll, behavior })

        if (behavior === 'smooth') {
            isSnapping.value = true
            let cleared = false
            const clear = (): void => {
                if (cleared) return
                cleared = true
                isSnapping.value = false
                el.removeEventListener('scrollend', clear)
            }
            el.addEventListener('scrollend', clear, { once: true })
            setTimeout(clear, 800)
        }
    }

    const triggerPrev = (): void => scrollToIndex(currentIndex.value - 1)
    const triggerNext = (): void => scrollToIndex(currentIndex.value + 1)

    // Snap to closest slide on drag release
    if (isDragging) {
        watch(isDragging, (dragging) => {
            if (!dragging) scrollToIndex(currentIndex.value)
        })
    }

    onMounted(() => {
        cacheLayout()
        onScroll()
    })

    useResizeObserver(element, () => {
        cacheLayout()
        onScroll()
    })

    return {
        canPrev,
        canNext,
        currentIndex,
        progress,
        slideCount,
        isSnapping,
        onScroll,
        scrollToIndex,
        triggerPrev,
        triggerNext,
    }
}
