export interface DataObserverOptions {
    interval?: number
    startDelay?: number
    timeoutId?: number
    isPolling?: boolean
    isWaitingCallback?: boolean
    backgroundInterval?: number
}

export default class DataObserver {
    callback: ((showError: boolean) => Promise<void>) | null = null
    interval = 4000
    startDelay = -1
    backgroundInterval = 30000
    timeoutId = -1
    isPolling = false
    pollCallback = this.poll.bind(this)
    visibilityChangeCallback = this.onVisibilityChange.bind(this)
    isWaitingCallback = false

    constructor(callback: (showError: boolean) => Promise<void>, options?: DataObserverOptions) {
        this.callback = callback

        if (options) Object.assign(this, options)

        document.addEventListener('visibilitychange', this.visibilityChangeCallback)
    }

    disconnect() {
        this.unobserve()

        document.removeEventListener('visibilitychange', this.visibilityChangeCallback)
    }

    observe() {
        this.startPolling(this.startDelay)
    }

    unobserve() {
        this.stopPolling()
    }

    startPolling(delay = -1) {
        if (this.isPolling) return

        this.isPolling = true

        if (!this.isWaitingCallback) {
            const timeout = delay !== -1 ? delay : this.interval

            this.timeoutId = window.setTimeout(this.pollCallback, timeout)
        }
    }

    async poll() {
        this.isWaitingCallback = true

        if (this.callback) {
            await this.callback(false)
        }

        this.isWaitingCallback = false

        if (!this.isPolling) return

        const timeout = document.visibilityState === 'hidden' ? this.backgroundInterval : this.interval

        this.timeoutId = window.setTimeout(this.pollCallback, timeout)
    }

    stopPolling() {
        if (!this.isPolling) return

        this.isPolling = false

        clearTimeout(this.timeoutId)
    }

    onVisibilityChange() {
        if (!this.isPolling) return

        const delay = document.visibilityState === 'hidden' ? this.backgroundInterval : 0

        this.stopPolling()
        this.startPolling(delay)
    }
}
