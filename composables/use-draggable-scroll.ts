import { getHtmlElement, type TemplateElementRef } from '~/utils/ref/get-html-element'

interface Point {
    x: number
    y: number
}

interface UseDraggableScrollOptions {
    element: TemplateElementRef
    onMouseUp?: () => void
    onMouseDown?: () => void
}

// Amount of pixels for detecting if the element is being dragged or just clicked.
const MIN_DRAG_AMOUNT = 6

export function useDraggableScroll(options: UseDraggableScrollOptions) {
    const isDragging = ref(false)
    const hasOverflow = ref(false)

    let isListening = false
    let dragged = false
    let dragAmount: Point = { x: 0, y: 0 }
    let resizeObserver: ResizeObserver | null = null

    function checkAvailability(direction = 'x') {
        const el = getHtmlElement(options.element)
        if (!el) return false

        const lastChildren = el.children[el.children.length - 1] as HTMLElement
        const boundingKey = direction === 'x' ? 'right' : 'bottom'

        return el.getBoundingClientRect()[boundingKey] < lastChildren.getBoundingClientRect()[boundingKey]
    }

    function onMouseDown() {
        removeListeners()

        isDragging.value = true

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)

        options.onMouseDown?.()
    }

    function onMouseUp() {
        removeListeners()

        isDragging.value = false

        dragged = dragAmount.x > MIN_DRAG_AMOUNT || dragAmount.y > MIN_DRAG_AMOUNT
        dragAmount = { x: 0, y: 0 }

        options.onMouseUp?.()
    }

    function onMouseMove(event: MouseEvent) {
        const element = getHtmlElement(options.element)

        if (!element) return

        event.preventDefault()

        const oldScrollTop = element.scrollTop
        const oldScrollLeft = element.scrollLeft

        element.scrollTop -= event.movementY
        element.scrollLeft -= event.movementX

        dragAmount = {
            x: dragAmount.x + Math.abs(oldScrollLeft - element.scrollLeft),
            y: dragAmount.y + Math.abs(oldScrollTop - element.scrollTop),
        }
    }

    function onClick(event: MouseEvent) {
        if (dragged) {
            event.preventDefault()
            event.stopImmediatePropagation()
        }
    }

    function removeListeners() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    function createResizeObserver() {
        const element = getHtmlElement(options.element)

        if (!element) return

        resizeObserver = new ResizeObserver(function () {
            hasOverflow.value = checkAvailability('x') || checkAvailability('y')
            setStyle()
        })

        resizeObserver.observe(toValue(element))
    }

    function disposeResizeObserver() {
        resizeObserver?.disconnect()
        resizeObserver = null
    }

    function setStyle(isGrabbing?: boolean) {
        const element = getHtmlElement(options.element)

        if (!element) return

        const hasScroll = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight

        element.style.cursor = hasScroll ? (isGrabbing ? 'grabbing' : 'grab') : ''
        element.style.userSelect = isGrabbing ? 'none' : ''
    }

    function listen() {
        const element = getHtmlElement(options.element)

        if (!element) return
        console.log('listen', element)
        createResizeObserver()
        setStyle()

        element.addEventListener('mousedown', onMouseDown)
        element.addEventListener('click', onClick, true)
        isListening = true
    }

    function destroy(el?: UseDraggableScrollOptions['element']) {
        const element = getHtmlElement(options.element) || (el && getHtmlElement(el))

        if (!element) return
        console.log('destroy', element)

        disposeResizeObserver()
        removeListeners()

        element.removeEventListener('mousedown', onMouseDown)
        element.removeEventListener('click', onClick, true)
        isListening = false
    }

    // Stop listening if element ref become nullish
    if (isRef(options.element)) {
        watch(options.element, (el, prevEl) => {
            if (el && !isListening) listen()
            else if (!el && isListening) destroy(prevEl)
        })
    }

    onMounted(listen)
    onUnmounted(destroy)

    return { isDragging, hasOverflow }
}
