import { debounce } from '@antfu/utils'
import type { Ref } from 'vue'

interface Options {
    element?: Ref<HTMLElement | null>
}

export function usePaginatedList(options: Options) {
    const isScrollingToTop = ref(false)
    const route = useRoute()

    const page = computed(() => {
        return parseInt(route.query.page as string) || 1
    })

    onUnmounted(() => {
        removeScrollEndListener()
    })

    watch(page, () => {
        scrollToTop()
    })

    const scrollEndCallback = debounce(100, onScrollEnd)
    let scrollEndTimeout = -1

    function scrollToTop() {
        if (window.scrollY <= (options?.element?.value?.getBoundingClientRect()?.top || 0)) {
            return
        }

        isScrollingToTop.value = true
        scrollEndTimeout = window.setTimeout(onScrollEnd, 800)

        addScrollEndListener()

        if (options?.element?.value) {
            options.element.value.scrollIntoView({ behavior: 'smooth' })
        }
    }

    function addScrollEndListener() {
        window.addEventListener('scroll', scrollEndCallback)
    }

    function removeScrollEndListener() {
        window.removeEventListener('scroll', scrollEndCallback)
        window.clearTimeout(scrollEndTimeout)
    }

    function onScrollEnd() {
        isScrollingToTop.value = false

        removeScrollEndListener()
    }

    return { page, isScrollingToTop }
}
