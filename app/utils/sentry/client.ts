type SentrySdk = typeof import('~/utils/sentry/sdk')
type CaptureHint = Parameters<SentrySdk['captureException']>[1]

interface QueuedError {
    error: unknown
    hint?: CaptureHint
}

// Errors raised before the SDK is loaded, replayed once it is initialised.
const queue: QueuedError[] = []
let sdk: SentrySdk | undefined

/**
 * Reports an error to Sentry. Until the SDK is loaded (see `initSentry`), the error is queued.
 * Without a DSN the SDK is never loaded and the queue is never flushed: the Sentry plugin
 * does not forward anything in that case, and neither should the callers.
 */
export function captureError(error: unknown, hint?: CaptureHint) {
    if (import.meta.server) return

    if (sdk) sdk.captureException(error, hint)
    else queue.push({ error, hint })
}

/** Loads the SDK, initialises it, then reports the queued errors. */
export async function initSentry(options: { dsn: string, environment?: string }) {
    try {
        sdk = await import('~/utils/sentry/sdk')
        sdk.init(options)
    }
    catch {
        // Chunk blocked or unavailable: nothing to report with, don't keep the errors around.
        sdk = undefined
        queue.length = 0
        return
    }

    queue.splice(0).forEach(({ error, hint }) => sdk!.captureException(error, hint))
}
