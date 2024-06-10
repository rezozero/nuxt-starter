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
const syncedIndex = defineModel<number>({ default: 0 })
const slides = ref<Slide[]>([])
const scrollDirection = ref(1)
const isScrolling = ref(false)
const scrollLeft = ref(0)

const setScrollLeft = () => (scrollLeft.value = getHtmlElement(root)?.scrollLeft || 0)

watch(scrollLeft, (value, oldValue) => {
    if (value == oldValue || !scrollLeft.value) return

    scrollDirection.value = oldValue > value ? -1 : 1
})

function setSlidesInfos() {
    const element = getHtmlElement(root)

    if (!element) {
        slides.value = []
        return
    }

    const slideList = [...element.children] as HTMLElement[]
    slides.value = slideList.map((child) => {
        const start = child.getBoundingClientRect().left - element.getBoundingClientRect().left + element.scrollLeft
        const width = child.offsetWidth

        const snapOffset = width > element.clientWidth * 0.7 ? width : width / 2

        return {
            left: start,
            snapLeft: start - snapOffset,
            snapRight: start + width + snapOffset,
            el: child,
        }
    })
}

const currentIndex = computed(() => {
    return slides.value[scrollDirection.value ? 'findLastIndex' : 'findIndex']((slide) => {
        return scrollLeft.value > slide.snapLeft && scrollLeft.value < slide.snapRight
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
const isDragging = ref(false)
const { setStyle, hasScroll } = useDraggableScroll({ element: root, onMouseUp, onMouseDown })

function scrollTo(index: number, options?: ScrollToOptions) {
    const element = getHtmlElement(root)
    const invalidIndex = syncedIndex.value < 0 || syncedIndex.value > lastReachableIndex.value
    const activeItemLeft = slides.value[index]?.left

    if (!element || invalidIndex || typeof activeItemLeft !== 'number') {
        return
    }

    element.addEventListener(
        'scrollend',
        () => {
            syncedIndex.value = index
            options?.scrollEndCallback?.()
        },
        { once: true },
    )

    element.scroll({
        left: activeItemLeft,
        behavior: 'smooth',
    })
}

// When slider is dragged
let scrollSnapTypeStored = ''

onMounted(() => {
    scrollSnapTypeStored = getHtmlElement(root)?.style['scrollSnapType'] || 'x mandatory'
})

function onMouseDown() {
    isDragging.value = true
    const element = getHtmlElement(root)
    if (!element) return

    // When scroll-snap-type: x mandatory is set dragAmount is too small to allow snapping on the next div
    // https://www.reddit.com/r/webdev/comments/17pxznp/how_to_drag_scroll_with_snap_behaviour/
    element.style['scrollSnapType'] = 'none'
}

function onDragTransitionEnd() {
    isDragging.value = false
    console.log('onDragTransitionEnd')

    const element = getHtmlElement(root)
    if (!element) return

    // Sometimes scrollSnapType is set before scroll transition is fully done
    // this cause a scroll jump
    window.setTimeout(() => (element.style['scrollSnapType'] = scrollSnapTypeStored), 300)
}

function onMouseUp() {
    scrollTo(currentIndex.value, { scrollEndCallback: onDragTransitionEnd })
}

// Update slide index and slide direction
const onScrollCallback = throttle(150, setScrollLeft)

function onScroll() {
    isScrolling.value = true
    onScrollCallback()
}

function onScrollEnd() {
    if (isDragging.value) return
    isScrolling.value = false

    // Update v-model only when scroll animation is ended
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
        <slot :item-class="$style.item" />
    </div>
</template>

<style lang="scss" module>
.root {
    display: flex;
    max-width: 100%;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* for Firefox */

    &::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
    }
}

.item {
    flex-shrink: 0;
    scroll-snap-align: start;
}
</style>
