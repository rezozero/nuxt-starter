export type AxisType = 'x' | 'y' | 'xy'

export interface DragGestureState {
    xy: [number, number]
    delta: [number, number]
    initial: [number, number]
    distance: [number, number]
    tap: boolean
    active: boolean
    type: 'mouse' | 'touch' | 'pen'
}

type Options = {
    axis?: AxisType
    tapThreshold?: number
    /**
     * Filter which pointer types trigger the gesture.
     * Defaults to all types: ['mouse', 'touch', 'pen'].
     * Pass ['mouse'] to replicate the old pointer: 'mouse' behaviour (desktop-only drag).
     */
    pointerTypes?: Array<'mouse' | 'touch' | 'pen'>
    onStart?: (state: DragGestureState) => void
    onMove?: (state: DragGestureState) => void
    onEnd?: (state: DragGestureState) => void
}

/**
 * Lightweight drag gesture handler using the Pointer Events API.
 * Requires touch-action: none on the target element for scroll prevention
 * on iOS Safari — no preventDefault needed.
 * Inspired by https://use-gesture.netlify.app/docs/state/
 */
export class DragGesture {
    private isActive = false
    private startX = 0
    private startY = 0
    private lastX = 0
    private lastY = 0
    private currentType: DragGestureState['type'] = 'mouse'
    private capturedPointerId: number | null = null
    private axis: AxisType
    private tapThreshold: number
    private pointerTypes: Array<'mouse' | 'touch' | 'pen'>
    private onStartCallback?: (state: DragGestureState) => void
    private onMoveCallback?: (state: DragGestureState) => void
    private onEndCallback?: (state: DragGestureState) => void
    private cleanups: Array<() => void> = []

    constructor(element: HTMLElement, options: Options = {}) {
        this.axis = options.axis ?? 'xy'
        this.tapThreshold = options.tapThreshold ?? 5
        this.pointerTypes = options.pointerTypes ?? ['mouse', 'touch', 'pen']
        this.onStartCallback = options.onStart
        this.onMoveCallback = options.onMove
        this.onEndCallback = options.onEnd

        this.on(element, 'pointerdown', (event: Event) => {
            const e = event as PointerEvent
            if (e.button !== 0) return
            if (!this.pointerTypes.includes(e.pointerType as 'mouse' | 'touch' | 'pen')) return
            if (this.capturedPointerId !== null) return // already tracking a pointer
            this.capturedPointerId = e.pointerId
            this.onDown(e.clientX, e.clientY, e.pointerType as DragGestureState['type'])
        })

        this.on(element, 'pointermove', (event: Event) => {
            const e = event as PointerEvent
            if (e.pointerId !== this.capturedPointerId || !this.isActive) return

            // Lazy capture: setPointerCapture is deferred until movement exceeds tapThreshold.
            // Immediate capture suppresses the synthetic click event for taps — deferring
            // preserves it while still enabling reliable out-of-bounds tracking for real drags.
            if (!element.hasPointerCapture(e.pointerId)) {
                const dx = e.clientX - this.startX
                const dy = e.clientY - this.startY
                if (Math.hypot(dx, dy) < this.tapThreshold) return
                element.setPointerCapture(e.pointerId)
            }

            this.onMove(e.clientX, e.clientY)
        })

        this.on(element, 'pointerup', (event: Event) => {
            const e = event as PointerEvent
            if (e.pointerId !== this.capturedPointerId) return
            if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId)
            this.capturedPointerId = null
            if (this.isActive) this.onUp()
        })

        // pointercancel fires when the browser takes control (iOS system gesture, scroll
        // takeover). Treat it as a release to avoid a stuck active state.
        this.on(element, 'pointercancel', (event: Event) => {
            const e = event as PointerEvent
            if (e.pointerId !== this.capturedPointerId) return
            this.capturedPointerId = null
            if (this.isActive) this.onUp()
        })

        // For axis-locked gestures: non-passive touchmove to block native scroll
        // on the locked axis. touchmove fires before pointermove, so direction
        // is detected here first and preventDefault() is called when appropriate.
        if ((this.axis === 'x' || this.axis === 'y') && this.pointerTypes.includes('touch')) {
            const axis = this.axis
            let startX = 0
            let startY = 0
            let locked: 'x' | 'y' | null = null

            this.on(element, 'touchstart', (e: Event) => {
                const touch = (e as TouchEvent).touches[0]
                if (!touch) return
                startX = touch.clientX
                startY = touch.clientY
                locked = null
            })

            const onTouchMove = (e: Event) => {
                if (!locked) {
                    const touch = (e as TouchEvent).touches[0]
                    if (touch) {
                        const dx = touch.clientX - startX
                        const dy = touch.clientY - startY
                        if (Math.abs(dx) > this.tapThreshold || Math.abs(dy) > this.tapThreshold) {
                            locked = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x'
                        }
                    }
                }
                if (locked === axis) (e as TouchEvent).preventDefault()
            }
            element.addEventListener('touchmove', onTouchMove, { passive: false })
            this.cleanups.push(() => element.removeEventListener('touchmove', onTouchMove))
        }
    }

    destroy(): void {
        this.cleanups.forEach(fn => fn())
        this.cleanups = []
        this.isActive = false
        this.capturedPointerId = null
    }

    // -------------------------------------- HANDLERS

    private onDown = (x: number, y: number, type: DragGestureState['type']): void => {
        this.isActive = true
        this.currentType = type
        this.startX = this.lastX = x
        this.startY = this.lastY = y

        this.onStartCallback?.({
            xy: [x, y],
            delta: [0, 0],
            initial: [x, y],
            distance: [0, 0],
            tap: true,
            active: true,
            type,
        })
    }

    private onMove = (x: number, y: number): void => {
        if (!this.isActive) return

        let dx = x - this.lastX
        let dy = y - this.lastY
        let dsx = x - this.startX
        let dsy = y - this.startY

        if (this.axis === 'x') {
            dy = 0
            dsy = 0
        }
        else if (this.axis === 'y') {
            dx = 0
            dsx = 0
        }

        this.onMoveCallback?.({
            xy: [x, y],
            delta: [dx, dy],
            initial: [this.startX, this.startY],
            distance: [dsx, dsy],
            tap: Math.hypot(dsx, dsy) <= this.tapThreshold,
            active: true,
            type: this.currentType,
        })

        this.lastX = x
        this.lastY = y
    }

    private onUp = (): void => {
        if (!this.isActive) return
        this.isActive = false

        const dsx = this.lastX - this.startX
        const dsy = this.lastY - this.startY

        this.onEndCallback?.({
            xy: [this.lastX, this.lastY],
            delta: [0, 0],
            initial: [this.startX, this.startY],
            distance: [dsx, dsy],
            tap: Math.hypot(dsx, dsy) <= this.tapThreshold,
            active: false,
            type: this.currentType,
        })
    }

    private on(target: EventTarget, event: string, handler: EventListener): void {
        target.addEventListener(event, handler, { passive: true })
        this.cleanups.push(() => target.removeEventListener(event, handler))
    }
}
