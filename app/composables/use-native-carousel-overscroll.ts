import type { Ref } from 'vue'

/**
 * Provides an overscroll "rubber band" effect
 * For native scroll containers
 * we can detect when the user is trying to scroll past the start or end
 */
export const useNativeCarouselOverscroll = (options: {
    element: Ref<HTMLElement | null>
    isDragging: Ref<boolean>
    damping?: number
    reboundDuration?: number
} = {
    element: ref(null),
    isDragging: ref(false),
    damping: 0.3,
    reboundDuration: 300,
}) => {
    const { element, isDragging, damping, reboundDuration } = options
    let accumulated = 0

    const setTransform = (x: number): void => {
        const el = element.value
        if (el) el.style.transform = `translateX(${x}px)`
    }

    /**
     * Track mouse movements while dragging to apply a transform when overscrolling
     */
    const track = (e: MouseEvent): void => {
        const el = element.value
        if (!el) return
        const maxScroll = el.scrollWidth - el.clientWidth
        const atStart = el.scrollLeft <= 0
        const atEnd = el.scrollLeft >= maxScroll - 1

        if (atStart || atEnd) {
            accumulated += e.movementX * (damping ?? 0.3)!
            // Constrain direction: only pull right at start, only pull left at end
            if (atStart && !atEnd) accumulated = Math.max(0, accumulated)
            if (atEnd && !atStart) accumulated = Math.min(0, accumulated)
            setTransform(accumulated)
        }
        else {
            accumulated = 0
            setTransform(0)
        }
    }

    /**
     * Animate back to normal position with a "rubber band" effect
     */
    const rebound = (): void => {
        const el = element.value
        if (!el) return
        // Set transition, then animate to 0 on next frame so the browser
        // registers the current translateX value before changing it
        el.style.transition = `transform ${reboundDuration ?? 300}ms ease-out`
        requestAnimationFrame(() => {
            setTransform(0)
            setTimeout(() => {
                if (element.value) {
                    element.value.style.transition = ''
                    element.value.style.transform = ''
                }
            }, reboundDuration ?? 300)
        })
    }

    watch(isDragging, (dragging) => {
        if (dragging) {
            accumulated = 0
            const el = element.value
            if (el) el.style.transition = ''
            document.addEventListener('mousemove', track)
        }
        else {
            document.removeEventListener('mousemove', track)
            if (accumulated !== 0) rebound()
            accumulated = 0
        }
    })

    onUnmounted(() => {
        document.removeEventListener('mousemove', track)
    })
}
