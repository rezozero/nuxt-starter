import type { Ref } from 'vue'
import { getHtmlElement } from '~/utils/ref/get-html-element'
import { DragGesture } from '~/utils/events/drag-gesture'

interface UseNativeCarouselDragOptions {
    element: Ref<HTMLElement | null> | HTMLElement
    enableDrag?: Ref<boolean>
}

/**
 * use native carousel drag composable
 * Add a drag event to a "mouse" pointer (for desktop purposes)
 * (Mobile will use the native scroll with touch)
 */
export function useNativeCarouselDrag(options: UseNativeCarouselDragOptions) {
    const isDragging = ref(false)
    const hasOverflow = ref(false)

    let listen = false
    let wasTap = true
    let dragAllowed = false
    let gesture: DragGesture | null = null
    let resizeObserver: ResizeObserver | null = null

    function checkAvailability(direction = 'x') {
        const el = getHtmlElement(options.element)
        if (!el) return false

        const lastChildren = el.children[el.children.length - 1] as HTMLElement
        const boundingKey = direction === 'x' ? 'right' : 'bottom'

        return el.getBoundingClientRect()[boundingKey] < lastChildren.getBoundingClientRect()[boundingKey]
    }

    function onClick(event: MouseEvent) {
        if (!wasTap) {
            event.preventDefault()
            event.stopImmediatePropagation()
        }
    }

    function createResizeObserver() {
        const element = toValue(options.element)
        if (!element) return

        resizeObserver = new ResizeObserver(function () {
            hasOverflow.value = checkAvailability('x') || checkAvailability('y')
            setStyle()
        })

        resizeObserver.observe(element)
    }

    function disposeResizeObserver() {
        resizeObserver?.disconnect()
        resizeObserver = null
    }

    function setStyle(isGrabbing?: boolean) {
        const element = toValue(options.element)
        if (!element) return

        const hasScroll = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
        element.style.cursor = hasScroll ? (isGrabbing ? 'grabbing' : 'grab') : ''
        element.style.userSelect = isGrabbing ? 'none' : ''
    }

    function init() {
        const element = toValue(options.element)
        if (!element) return

        createResizeObserver()
        setStyle()

        gesture = new DragGesture(element, {
            axis: 'x',
            // Only for mouse pointer, touch will use native scroll
            pointerTypes: ['mouse'],
            onStart: () => {
                dragAllowed = !options.enableDrag || options.enableDrag.value
                if (!dragAllowed) return
                isDragging.value = true
                setStyle(true)
            },
            onMove: (state) => {
                if (!dragAllowed) return
                // Touch uses native scroll
                if (state.type === 'mouse') {
                    element.scrollLeft -= state.delta[0]
                    element.scrollTop -= state.delta[1]
                }
            },
            onEnd: (state) => {
                if (!dragAllowed) return
                isDragging.value = false
                setStyle(false)
                wasTap = state.tap
                dragAllowed = false
            },
        })

        element.addEventListener('click', onClick, true)
        listen = true
    }

    function destroy(el?: UseNativeCarouselDragOptions['element']) {
        const element = toValue(options.element) || toValue(el)
        if (!element) return

        disposeResizeObserver()
        gesture?.destroy()
        gesture = null

        element.removeEventListener('click', onClick, true)
        listen = false
    }

    watch(options.element, (el, prevEl) => {
        if (el && !listen) init()
        else if (!el && listen) destroy(prevEl)
    })

    onMounted(init)
    onUnmounted(destroy)

    return { isDragging, hasOverflow }
}
