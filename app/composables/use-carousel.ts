import { nextTick, provide } from 'vue'
import type { Ref } from 'vue'

export interface Inject {
    registerSlide(): void
}

interface UseCarouselOptions {
    element?: Ref<HTMLElement | null>
    asyncSlides?: boolean
    lazy?: boolean
    init?: () => void
}

export function useCarousel(options?: UseCarouselOptions) {
    const { lazy, element, asyncSlides, init } = options || {}
    const isVisible = ref(false)
    const numRegisteredSlides = ref(0)
    const initialized = ref(false)
    const observer: IntersectionObserver | null = null

    // Resize observer
    const isOverflowing = ref(false)
    const { stop: stopResizeObserver } = useResizeObserver(element, () => {
        isOverflowing.value = !!isLastSlideOverflowing()
    })

    const lastChild = computed(() => {
        if (!element?.value) return

        const children = [...element.value.children] as HTMLElement[]
        return children[children.length - 1]
    })

    function isLastSlideOverflowing() {
        const wrapper = toValue(element)
        const slide = toValue(lastChild)

        if (!wrapper || !slide) return

        return slide.getBoundingClientRect().right > wrapper.getBoundingClientRect().right
    }

    watch(isOverflowing, (value) => {
        if (value && isVisible.value && !initialized.value) {
            stopResizeObserver()
            initWhenPossible()
        }
    })

    // Intersection observer
    const { stop: stopIntersectionObserver } = useIntersectionObserver(
        element,
        ([{ isIntersecting }]) => {
            isVisible.value = isIntersecting
        },
    )

    watch(isVisible, (value) => {
        if (value && isOverflowing.value && !initialized.value) {
            stopIntersectionObserver()
            initWhenPossible()
        }
    })

    const checkIfSlidesAreReady = async () => {
        if (numRegisteredSlides.value === element?.value?.children.length && !initialized.value) {
            initialized.value = true

            await nextTick(initCarousel)
        }
    }

    async function initWhenPossible() {
        if (asyncSlides) {
            await checkIfSlidesAreReady()
        }
        else {
            initialized.value = true
            init?.()
        }
    }

    const initCarousel = () => {}

    onMounted(() => {
        if (lazy) return

        stopResizeObserver()
        stopIntersectionObserver()
        initWhenPossible()
    })

    const registerSlide = (): number => {
        return numRegisteredSlides.value++
    }
    provide('registerSlide', registerSlide)

    return { numSlides: numRegisteredSlides, initialized, observer, isVisible }
}
