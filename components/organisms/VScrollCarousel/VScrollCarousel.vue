<script setup lang="ts">
import { getHtmlElement } from '~/utils/ref/get-html-element'
import { throttle } from 'throttle-debounce'

type ScrollToOptions = {
    scrollEndCallback?: () => void
}

export type Slide = {
    left: number
    snapLeft: number
    snapRight: number
    right: number
    el: HTMLElement
}

// DOM ref
const root = ref<HTMLElement | null>(null)
const firstSlide = ref<HTMLElement | null>(null)

const unwatchRootEl = watch(root, (el) => {
    const slideEl = (el?.children[0] as HTMLElement) || null
    if (!slideEl) return

    firstSlide.value = slideEl
    unwatchRootEl()
})

// Slider data
const SNAP_OFFSET = 50

const syncedIndex = defineModel<number>({ default: 0 }) // Update this value only when user stop interacting with slider
const slides = ref<Slide[]>([])
const scrollDirection = ref(1)
const isScrolling = ref(false)
const scrollLeft = ref(0)

const setScrollLeft = () => (scrollLeft.value = getHtmlElement(root)?.scrollLeft || 0)

watch(scrollLeft, (value, oldValue) => {
    if (value === oldValue) return

    scrollDirection.value = oldValue > value ? -1 : 1
})

function setSlidesInfos() {
    const element = getHtmlElement(root)

    if (!element) {
        slides.value = []
        return
    }

    const slideList = [...element.children] as HTMLElement[]
    const firstSlideOffset = slideList[0].getBoundingClientRect().left - element.getBoundingClientRect().left

    slides.value = slideList.map((child) => {
        const relativeLeft = child.getBoundingClientRect().left - element.getBoundingClientRect().left
        const start = relativeLeft - firstSlideOffset + element.scrollLeft
        const width = child.offsetWidth

        return {
            left: start,
            snapLeft: start + SNAP_OFFSET,
            right: start + width,
            snapRight: start + width - SNAP_OFFSET,
            el: child,
        }
    })
}

const currentIndex = computed(() => {
    return slides.value.findIndex((slide) => {
        return scrollLeft.value < slide[scrollDirection.value === 1 ? 'snapLeft' : 'snapRight']
    })
})

const visibleSlideLength = computed(() => {
    return slides.value.filter((slide) => {
        return (
            slide.left >= Math.ceil(scrollLeft.value) &&
            slide.left < scrollLeft.value + (getHtmlElement(root)?.clientWidth || 0)
        )
    }).length
})

const lastReachableIndex = computed(() => slides.value.length - visibleSlideLength.value)

// Slider utils
const { setStyle, hasScroll, isDragging } = useDraggableScroll(root)

const hasTransition = ref(false)
function scrollTo(index: number, options?: ScrollToOptions) {
    const element = getHtmlElement(root)
    const invalidIndex = syncedIndex.value < 0 || syncedIndex.value > lastReachableIndex.value
    const left = slides.value[index]?.left

    if (!element || invalidIndex || typeof left !== 'number' || hasTransition.value) {
        return
    }

    element.addEventListener(
        'scrollend',
        () => {
            options?.scrollEndCallback?.()

            hasTransition.value = false
            isScrolling.value = false

            // Update v-model only when scroll animation is ended
            syncedIndex.value = index
        },
        { once: true },
    )

    hasTransition.value = true

    element.scroll({
        left,
        behavior: 'smooth',
    })
}

// When slider is dragged
let scrollSnapTypeStored = ''
onMounted(() => {
    scrollSnapTypeStored = getHtmlElement(root)?.style['scrollSnapType'] || 'x mandatory'
})

watch(isDragging, () => {
    if (isDragging.value) {
        // When scroll-snap-type: x mandatory is set dragAmount is too small to allow snapping on the next div
        // https://www.reddit.com/r/webdev/comments/17pxznp/how_to_drag_scroll_with_snap_behaviour/
        if (root.value) root.value.style['scrollSnapType'] = 'none'
    }
})

function onDragTransitionEnd() {
    if (isDragging.value) return

    isDragging.value = false
    isScrolling.value = false

    const element = getHtmlElement(root)
    if (!element) return

    // Sometimes scrollSnapType is set before scroll transition is fully done
    // this cause a scroll jump
    element.style['scrollSnapType'] = scrollSnapTypeStored
}

// function onMouseUp() {
//     isDragging.value = false
//     scrollTo(currentIndex.value, { scrollEndCallback: onDragTransitionEnd })
// }

// Update slide index and slide direction
const onScrollCallback = throttle(100, setScrollLeft)

function onScroll() {
    isScrolling.value = true
    onScrollCallback()
}

function onScrollEnd() {
    if (isDragging.value || hasTransition.value) return

    isScrolling.value = false

    getHtmlElement(root)!.style['scrollSnapType'] = scrollSnapTypeStored

    // Update VModel on native scroll
    syncedIndex.value = currentIndex.value
}

watch(syncedIndex, (value) => {
    if (value === currentIndex.value || isScrolling.value || isDragging.value) return

    scrollTo(value)
})

// Wrapper and slide listener
function updateSlides() {
    setSlidesInfos()
    setStyle()
}

useMutationObserver(
    root,
    (mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') updateSlides()
        }
    },
    { childList: true, attributes: false },
)

useResizeObserver(firstSlide, updateSlides)
watch(hasScroll, () => {
    updateSlides()

    if (syncedIndex.value === currentIndex.value) return
    scrollTo(syncedIndex.value)
})

// Expose
defineExpose<{ slides: Ref<Slide[]> }>({ slides })
</script>

<template>
    <div ref="root" :class="$style.root" @scroll="onScroll" @scrollend="onScrollEnd">
        <slot :slide-class="$style.slide" />
    </div>
</template>

<style lang="scss" module>
.root {
    display: flex;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* for Firefox */
    touch-action: pan-x;
}

.slide {
    flex-shrink: 0;
    scroll-snap-align: var(--v-carousel-slide-scroll-snap-align, start);
}
</style>
