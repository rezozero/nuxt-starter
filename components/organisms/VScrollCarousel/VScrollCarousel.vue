<script setup lang="ts">
import { throttle } from 'throttle-debounce'

export type Slide = {
    left: number
    right: number
    element: HTMLElement
}

defineProps<{
    direction?: 'x' | 'y' | 'both'
    cursor?: boolean
}>()

const root = ref<HTMLElement | null>(null)
// const scrollDirection = ref(1)
let animationFrameId = -1

// Active slide index
const activeIndex = defineModel<number>({ default: 0 })

watch(activeIndex, (newValue) => {
    if (isDragging.value || isTransitioning.value) return

    gotoSlide(newValue)
})

// Slides
const slides = ref<Slide[]>([])

function setSlides() {
    if (!root.value) {
        slides.value = []
        return
    }

    const slideElements = [...root.value.children] as HTMLElement[]
    const rootRect = root.value.getBoundingClientRect()

    slides.value = slideElements.map((element) => {
        const rect = element.getBoundingClientRect()
        const left = rect.left - rootRect.left

        return {
            left: left,
            right: left + rect.width,
            element,
        }
    })
}

// const visibleSlideLength = computed(() => {
//     return slides.value.filter((slide) => {
//         return (
//             slide.left >= Math.ceil(scrollLeft.value) &&
//             slide.left < scrollLeft.value + (getHtmlElement(root)?.clientWidth || 0)
//         )
//     }).length
// })
//
// const lastReachableIndex = computed(() => slides.value.length - visibleSlideLength.value)

useMutationObserver(
    root,
    (mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') update()
        }
    },
    { childList: true, attributes: false },
)

useResizeObserver(root, update)

// Drag
const { setStyle, isDragging } = useDraggableScroll(root)

let scrollSnapTypeStored = ''

onMounted(() => {
    scrollSnapTypeStored = root.value?.style['scrollSnapType'] || ''
})

watch(isDragging, () => {
    if (!root.value) return

    cancelTransition()

    if (isDragging.value) {
        // Disable scroll snap when dragging (scroll snap prevent manual scroll)
        root.value.style.scrollSnapType = 'none'
    } else {
        const currentX = root.value.scrollLeft

        // Restore scroll snap
        root.value.style.scrollSnapType = scrollSnapTypeStored

        // Chrome and Safari need help to smooth scroll to the right position (they jump directly to the end)
        animationFrameId = requestAnimationFrame(() => {
            if (!root.value) return

            // Safari need to force reflow to compute next scroll position
            root.value.style.display = 'none'
            root.value?.offsetHeight
            root.value.style.display = ''

            const destX = root.value.scrollLeft

            // Firefox has already the right scroll position
            if (destX === currentX) return

            // Disable scroll snap when dragging (scroll snap prevent manual scroll)
            root.value.style.scrollSnapType = 'none'

            root.value.scrollTo({ left: currentX })

            animationFrameId = requestAnimationFrame(() => {
                if (!root.value) return

                // Go to the right scroll position with smooth transition
                scrollTo({ left: destX })
            })
        })
    }
})

// Transition
const isTransitioning = ref(false)

function cancelTransition() {
    cancelAnimationFrame(animationFrameId)

    isTransitioning.value = false
}

function scrollTo(options: ScrollToOptions) {
    if (!root.value) return

    cancelTransition()

    root.value.style.scrollSnapType = 'none'

    isTransitioning.value = true

    // Go to the right scroll position with smooth transition
    root.value.scrollTo({ ...options, behavior: options.behavior ?? 'smooth' })
}

function onScrollEnd() {
    if (isDragging.value) return

    isTransitioning.value = false

    if (root.value) root.value.style.scrollSnapType = scrollSnapTypeStored
}

// Navigation
function gotoSlide(slideIndex: number) {
    const left = slides.value[slideIndex]?.left

    if (typeof left !== 'number') return

    scrollTo({ left })
}

function gotoNextSlide() {}

function gotoPreviousSlide() {}

// Update slide index and slide direction
const onScroll = throttle(100, computeActiveSlideIndex)

function computeActiveSlideIndex() {}

onMounted(() => {
    update()
    computeActiveSlideIndex()
    gotoSlide(activeIndex.value)
})

function update() {
    setSlides()
    setStyle()
}

// Expose
defineExpose({ gotoNextSlide, gotoPreviousSlide, gotoSlide, update })
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
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    touch-action: pan-x;
}

.slide {
    flex-shrink: 0;
    scroll-snap-align: var(--v-scroll-carousel-slide-scroll-snap-align, start);
}
</style>
