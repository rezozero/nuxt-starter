/**
 * Lightweight pinch (2-finger) gesture handler.
 * Inspired by https://use-gesture.netlify.app/docs/state/
 */

export interface PinchGestureState {
    distance: number
    origin: [number, number]
    scale: number // ratio: current distance / start distance
    active: boolean
}

type Options = {
    preventDefault?: boolean
    onStart?: (state: PinchGestureState) => void
    onMove?: (state: PinchGestureState) => void
    onEnd?: (state: PinchGestureState) => void
}

/**
 * PinchGesture class to handle pinch zoom gestures on a given element
 */
export class PinchGesture {
    private isActive = false
    private startDistance = 0
    private shouldPreventDefault: boolean
    private onStartCallback?: (state: PinchGestureState) => void
    private onMoveCallback?: (state: PinchGestureState) => void
    private onEndCallback?: (state: PinchGestureState) => void
    private cleanups: Array<() => void> = []

    // -------------------------------------- INIT

    /**
     * Constructor
     * Will bind the necessary event listeners
     */
    constructor(element: HTMLElement, options: Options = {}) {
        this.shouldPreventDefault = options.preventDefault ?? true
        this.onStartCallback = options.onStart
        this.onMoveCallback = options.onMove
        this.onEndCallback = options.onEnd

        const passive = !this.shouldPreventDefault

        this.on(element, 'touchstart', (e: Event) => {
            const te = e as TouchEvent
            if (te.touches.length < 2) return
            if (this.shouldPreventDefault) te.preventDefault()

            this.startDistance = this.getDistance(te.touches)
            this.isActive = true

            this.onStartCallback?.({
                distance: this.startDistance,
                origin: this.getOrigin(te.touches),
                scale: 1,
                active: true,
            })
        }, { passive })

        this.on(element, 'touchmove', (e: Event) => {
            const te = e as TouchEvent
            if (!this.isActive || te.touches.length < 2) return
            if (this.shouldPreventDefault) te.preventDefault()

            const distance = this.getDistance(te.touches)

            this.onMoveCallback?.({
                distance,
                origin: this.getOrigin(te.touches),
                scale: distance / this.startDistance,
                active: true,
            })
        }, { passive })

        this.on(window, 'touchend', (e: Event) => {
            const te = e as TouchEvent
            if (!this.isActive || te.touches.length >= 2) return
            this.isActive = false

            this.onEndCallback?.({
                distance: 0,
                origin: [0, 0],
                scale: 1,
                active: false,
            })
        }, { passive: true })
    }

    /**
     * Destroy the gesture instance
     */
    destroy(): void {
        this.cleanups.forEach(fn => fn())
        this.cleanups = []
        this.isActive = false
    }

    // --------------------------------------- Private methods

    /**
     * Calculate the distance between two touch points
     */
    private getDistance(touches: TouchList): number {
        const t0 = touches[0]
        const t1 = touches[1]
        if (!t0 || !t1) return 0
        return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY)
    }

    /**
     * Calculate the origin point between two touch points
     */
    private getOrigin(touches: TouchList): [number, number] {
        const t0 = touches[0]
        const t1 = touches[1]
        if (!t0 || !t1) return [0, 0]
        return [(t0.clientX + t1.clientX) / 2, (t0.clientY + t1.clientY) / 2]
    }

    // -------------------------------------- UTILS

    /**
     * Add event listeners and track their cleanup functions
     */
    private on(target: EventTarget, event: string, handler: EventListener, opts?: AddEventListenerOptions): void {
        target.addEventListener(event, handler, opts)
        this.cleanups.push(() => target.removeEventListener(event, handler, opts))
    }
}
