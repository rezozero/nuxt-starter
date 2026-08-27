import type { Ref } from 'vue'

/**
 * Checks if a carousel element is scrollable
 * by comparing its scrollWidth and clientWidth
 */
export const useNativeCarouselScrollable = (element: Ref<HTMLElement | null>): { isScrollable: Ref<boolean> } => {
    const isScrollable = ref(false)

    let observer: ResizeObserver | null = null

    watchEffect((onCleanup) => {
        if (!element.value) return
        observer?.disconnect()
        observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            entries.forEach((entry) => {
                const el = entry.target as HTMLElement
                isScrollable.value = el.scrollWidth > el.clientWidth
            })
        })
        observer.observe(element.value)
        onCleanup(() => observer?.disconnect())
    })

    onUnmounted(() => observer?.disconnect())

    return { isScrollable }
}
