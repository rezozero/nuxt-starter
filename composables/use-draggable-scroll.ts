import { getHtmlElement, type TemplateElementRef } from '~/utils/ref/get-html-element'

interface Point {
    x: number
    y: number
}

interface UseDraggableScrollOptions {
    minDragAmount?: number
}

// Amount of pixels for detecting if the element is being dragged or just clicked.
const MIN_DRAG_AMOUNT = 6

export function useDraggableScroll(target: TemplateElementRef, options?: UseDraggableScrollOptions) {
    const isDragging = ref(false)
    const hasScroll = ref(false)
    const xDirection = ref(1)
    const minDragAmount = options?.minDragAmount || MIN_DRAG_AMOUNT

    let isListening = false
    let dragged = false
    let dragAmount: Point = { x: 0, y: 0 }
    let resizeObserver: ResizeObserver | null = null
    let oldX = 0

    function setDragDirection(e: MouseEvent) {
        if (!isDragging.value || e.pageX == oldX) return
        xDirection.value = e.pageX < oldX ? -1 : 1
        oldX = e.pageX
    }

    function onMouseDown() {
        removeListeners()

        isDragging.value = true

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    function onMouseUp() {
        removeListeners()

        isDragging.value = false

        dragged = dragAmount.x > minDragAmount || dragAmount.y > minDragAmount
        dragAmount = { x: 0, y: 0 }
    }

    function onMouseMove(event: MouseEvent) {
        const element = getHtmlElement(target)

        if (!element) return

        event.preventDefault()

        setDragDirection(event)

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
        const element = getHtmlElement(target)

        if (!element) return

        resizeObserver = new ResizeObserver(function () {
            setStyle()
        })
        resizeObserver.observe(element)
    }

    function disposeResizeObserver() {
        resizeObserver?.disconnect()
        resizeObserver = null
    }

    watch(isDragging, setStyle)
    function setStyle(isGrabbing?: boolean) {
        const element = getHtmlElement(target)

        if (!element) return

        hasScroll.value = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight

        element.style.cursor = hasScroll.value ? (isGrabbing ? 'grabbing' : 'grab') : ''
        element.style.userSelect = isGrabbing ? 'none' : ''
    }

    function listen() {
        const element = getHtmlElement(target)

        if (!element) return

        createResizeObserver()
        setStyle()

        element.addEventListener('mousedown', onMouseDown)
        element.addEventListener('click', onClick, true)
        isListening = true
    }

    function destroy(el?: typeof target) {
        const element = getHtmlElement(target) || (el && getHtmlElement(el))

        if (!element) return

        disposeResizeObserver()
        removeListeners()

        element.removeEventListener('mousedown', onMouseDown)
        element.removeEventListener('click', onClick, true)
        isListening = false
    }

    // Stop listening if element ref become nullish
    if (isRef(target)) {
        watch(target, (el, prevEl) => {
            if (el && !isListening) listen()
            else if (!el && isListening) destroy(prevEl)
        })
    }

    onMounted(listen)
    onUnmounted(destroy)

    return { isDragging, hasScroll, setStyle, xDirection }
}
