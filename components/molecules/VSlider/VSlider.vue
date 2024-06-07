<script setup lang="ts">
import { getHtmlElement } from '~/utils/ref/get-html-element'
// import { debounce, throttle } from 'throttle-debounce'

type ScrollToOptions = {
    scrollEndCallback?: () => void
}

export type Slide = {
    left: number
    snapLeft: number
    snapRight: number
    el: HTMLElement
}

const activeIndex = defineModel<number>({ default: 0 })

const root = ref<HTMLElement | null>(null)
let scrollSnapTypeStored = ''

// Slides
const slides = ref<Slide[]>([])
function setSlidesInfos() {
    const element = getHtmlElement(root)
    if (!element) {
        slides.value = []
        return
    }

    const slideList = [...element.children] as HTMLElement[]
    slides.value = slideList.map((child, i) => {
        const start = child.getBoundingClientRect().left - element.getBoundingClientRect().left + element.scrollLeft //child.offsetLeft
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

const visibleSlideLength = computed(() => {
    const element = getHtmlElement(root)
    if (!element) return 0

    return slides.value.filter((slide) => {
        return slide.left >= Math.ceil(element.scrollLeft) && slide.left < element.scrollLeft + element.clientWidth
    }).length
})

const lastReachableIndex = computed(() => slides.value.length - visibleSlideLength.value)

// Slider utils
const { setStyle, hasScroll, XDirection, isDragging } = useDraggableScroll({ element: root, onMouseUp, onMouseDown })

function getNewActiveIndex() {
    const scrollLeft = getHtmlElement(root)?.scrollLeft
    if (!scrollLeft) return 0

    return slides.value[XDirection.value === -1 ? 'findLastIndex' : 'findIndex']((slide) => {
        return scrollLeft > slide.snapLeft && scrollLeft < slide.snapRight
    })
}

function scrollTo(index: number, options?: ScrollToOptions) {
    const element = getHtmlElement(root)
    const invalidIndex = activeIndex.value < 0 || activeIndex.value > lastReachableIndex.value
    const activeItemLeft = slides.value[index]?.left

    if (!element || invalidIndex || typeof activeItemLeft !== 'number') {
        return
    }

    element.addEventListener(
        'scrollend',
        () => {
            console.log('scrollTo: onScrollEnd')
            activeIndex.value = index
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
function onMouseDown() {
    const element = getHtmlElement(root)
    if (!element) return

    // When scroll-snap-type: x mandatory is set dragAmount is too small to allow snapping on the next div
    // https://www.reddit.com/r/webdev/comments/17pxznp/how_to_drag_scroll_with_snap_behaviour/
    element.style['scrollSnapType'] = 'none'
}

function resetScrollSnapType() {
    const element = getHtmlElement(root)
    if (!element) return

    // Sometimes scrollSnapType is set before scroll transition is fully done
    // this cause a scroll jump
    window.setTimeout(() => (element.style['scrollSnapType'] = scrollSnapTypeStored), 300)
}

function onMouseUp() {
    scrollTo(getNewActiveIndex(), { scrollEndCallback: resetScrollSnapType })
}

// const scrollEndCallback = debounce(400, () => {
//     const newValue = getNewActiveIndex()
//
//     console.log(
//         `scrollEndCallback: isDragging ${isDragging.value} | activeIndex: ${activeIndex.value} | newValue: ${newValue}`,
//     )
//
//     if (!newValue || activeIndex.value === newValue || isDragging.value) return
//
//     activeIndex.value = newValue
// })

// Initialize and reset slides
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
function initObservers() {
    const rootEl = getHtmlElement(root)
    const firstSlide = rootEl?.children[0]

    if (rootEl) {
        mutationObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    setSlidesInfos()
                    setStyle()
                }
            }
        })
        mutationObserver.observe(rootEl, { childList: true, attributes: false })
    }

    if (firstSlide) {
        resizeObserver = new ResizeObserver(() => {
            setSlidesInfos()
            setStyle()
        })
        resizeObserver.observe(firstSlide)
    }
}

function disposeObservers() {
    resizeObserver?.disconnect()
    resizeObserver = null

    mutationObserver?.disconnect()
    mutationObserver = null
}

onMounted(() => {
    scrollSnapTypeStored = getHtmlElement(root)?.style['scrollSnapType'] || 'x mandatory'
    initObservers()
})
onBeforeUnmount(() => {
    disposeObservers()
})

watch(hasScroll, (value) => {
    if (!value) return

    setSlidesInfos()
    const index = activeIndex.value || getNewActiveIndex()
    scrollTo(index)
})

defineExpose<{ slides: Ref<Slide[]> }>({ slides })

// TODO: find a way to update activeIndex on native scroll
function test() {
    // TODO: getNewActiveIndex return wrong current index
    activeIndex.value = getNewActiveIndex()
}
</script>

<template>
    <div ref="root" :class="$style.root" @scroll="test">
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
