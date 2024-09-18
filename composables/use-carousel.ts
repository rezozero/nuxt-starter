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
    observerOptions?: IntersectionObserverInit | undefined
}

export function useCarousel(options?: UseCarouselOptions) {
    const { lazy, observerOptions, element, asyncSlides, init } = options || {}
    const isVisible = ref(false)
    const numRegisteredSlides = ref(0)
    const initialized = ref(false)

    let observer: IntersectionObserver | null = null

    const registerSlide = (): number => {
        return numRegisteredSlides.value++
    }

    watch(isVisible, () => {
        if (isVisible) {
            disposeObserver()

            if (!initialized) initWhenPossible()
        }
    })

    const checkIfSlidesAreReady = async () => {
        if (numRegisteredSlides.value === element?.value?.children.length && !initialized.value) {
            initialized.value = true

            await nextTick(initCarousel)
        }
    }

    const initWhenPossible = async () => {
        if (asyncSlides) await checkIfSlidesAreReady()
        else {
            initialized.value = true
            init?.()
        }
    }

    const initCarousel = () => {}

    const createObserver = () => {
        if (!element?.value) return

        observer = new IntersectionObserver(onObserverChange, {
            rootMargin: '200px 0',
            ...observerOptions,
        })
        observer.observe(element.value)
    }

    const onObserverChange = ([entry]: IntersectionObserverEntry[]) => {
        return (isVisible.value = entry.isIntersecting)
    }

    const disposeObserver = () => {
        observer?.disconnect()
        observer = null
    }

    onMounted(() => {
        if (lazy) createObserver()
        else initWhenPossible()
    })

    onBeforeUnmount(() => {
        disposeObserver()
    })

    provide('registerSlide', registerSlide)

    return { numSlides: numRegisteredSlides, initialized, observer, isVisible }
}
