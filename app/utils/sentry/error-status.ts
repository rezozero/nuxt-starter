/**
 * Reads the HTTP status of any error-like object (`NuxtError`, `FetchError`, plain object…).
 * A 404 can reach `app:error` as a plain object, so `isNuxtError()` is not enough.
 */
export function getErrorStatus(error: unknown): number | undefined {
    if (!error || typeof error !== 'object') return undefined

    const { status, statusCode } = error as { status?: unknown, statusCode?: unknown }
    const value = status ?? statusCode

    return typeof value === 'number' ? value : undefined
}

/** Redirects (3xx) and client errors (4xx), such as a 404 page, are not worth reporting. */
export function isIgnoredAppError(error: unknown): boolean {
    const status = getErrorStatus(error)

    return status !== undefined && status >= 300 && status < 500
}
