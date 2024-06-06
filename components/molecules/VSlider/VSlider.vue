<script setup lang="ts">
import { getHtmlElement } from '~/utils/ref/get-html-element'
import { throttle } from 'throttle-debounce'

const activeIndex = defineModel<number>({ default: 0 })
const root = ref<HTMLElement | null>(null)
let scrollSnapTypeStored = ''

// Commons
function getRelativeChildrenBound() {
    const element = getHtmlElement(root)
    if (!element) return []

    const parentBoundLeft = element.getBoundingClientRect().left
    return [...element.children].map((child) => {
        const { left, width } = child.getBoundingClientRect()
        return { left: left - parentBoundLeft, width }
    })
}

function updateSlideIndex() {
    const element = getHtmlElement(root)
    if (!element) return

    const relativeChildrenBound = getRelativeChildrenBound()

    // TODO: change the way the item snaps based on the slide direction and how wide it is.
    // Right now, the item snaps when the center element touches the left wrapper.
    activeIndex.value = relativeChildrenBound.findIndex((bound) => {
        const snapOffset = bound.width / 2
        return bound.left + snapOffset > 0
    })
}

function scrollToIndex() {
    const element = getHtmlElement(root)
    if (!element || activeIndex.value < 0 || activeIndex.value > lastReachableIndex.value) {
        return
    }

    const relativeChildrenBound = getRelativeChildrenBound()
    const newScrollLeft = element.scrollLeft + relativeChildrenBound[activeIndex.value]?.left

    element.scroll({
        left: newScrollLeft,
        behavior: 'smooth',
    })
}

watch(activeIndex, (value) => {
    activeIndex.value = Math.max(Math.min(value, lastReachableIndex.value), 0)
    scrollToIndex()
})

// When wrapper is dragged
function onMouseDown() {
    const element = getHtmlElement(root)
    if (!element) return

    // When scroll-snap-type: x mandatory is set dragAmount is too small to allow snapping on the next div
    // https://www.reddit.com/r/webdev/comments/17pxznp/how_to_drag_scroll_with_snap_behaviour/
    scrollSnapTypeStored = element.style['scrollSnapType']
    element.style['scrollSnapType'] = 'none'
}

function onScrollEndAfterDragging() {
    const element = getHtmlElement(root)
    if (!element) return

    element.style['scrollSnapType'] = scrollSnapTypeStored
    element.removeEventListener('scrollend', onScrollEndAfterDragging)
    setVisibleSlideLength()
}

function onMouseUp() {
    updateSlideIndex()

    getHtmlElement(root)?.addEventListener('scrollend', onScrollEndAfterDragging)
    scrollToIndex()
}

const { setStyle, hasScroll } = useDraggableScroll({ element: root, onMouseUp, onMouseDown })

// Prevent to scroll more than visible slides
const visibleSlideLength = ref(1)
function setVisibleSlideLength() {
    const element = getHtmlElement(root)
    if (!element) return

    const relativeChildrenBound = getRelativeChildrenBound()
    visibleSlideLength.value = relativeChildrenBound.filter((childBound) => {
        return childBound.left > 0 && childBound.left <= Math.ceil(element.clientWidth)
    }).length
}
const lastReachableIndex = computed(() => getRelativeChildrenBound().length - visibleSlideLength.value)

const scrollCallback = throttle(200, updateSlideIndex)
watch(hasScroll, (value) => {
    if (value) {
        setVisibleSlideLength()
        scrollToIndex()
        getHtmlElement(root)?.addEventListener('scrollend', scrollCallback)
    } else {
        getHtmlElement(root)?.removeEventListener('scrollend', scrollCallback)
    }
})

// Init listeners
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
function initObservers() {
    const rootEl = getHtmlElement(root)
    const firstSlide = rootEl?.children[0]

    if (rootEl) {
        mutationObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') setStyle()
            }
        })
        mutationObserver.observe(rootEl, { childList: true, attributes: false })
    }

    if (firstSlide) {
        resizeObserver = new ResizeObserver(() => setStyle())
        resizeObserver.observe(firstSlide)
    }
}

function disposeObservers() {
    resizeObserver?.disconnect()
    resizeObserver = null

    mutationObserver?.disconnect()
    mutationObserver = null
}

onMounted(initObservers)
onBeforeUnmount(disposeObservers)
</script>

<template>
    <div ref="root" :class="$style.root">
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
