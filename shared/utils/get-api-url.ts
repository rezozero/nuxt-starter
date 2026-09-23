import { joinURL } from 'ufo'

/**
 * Returns the correct API base URL depending on the execution context.
 *
 * - SSR (Node):   prefers runtimeConfig.serverApiUrl (NUXT_SERVER_API_URL)
 *                 falls back to runtimeConfig.public.api.url
 * - Browser:      always uses runtimeConfig.public.api.url
 *
 * WARNING: use this only for data-fetching (e.g. useFetch, $fetch).
 * Never use it to build URLs that are rendered in HTML (attributes, text nodes, etc.):
 * server and client would produce different values, causing Vue hydration mismatches.
 * For rendered URLs, always use runtimeConfig.public.api.url directly.
 */
export function getApiUrl() {
    const runtimeConfig = useRuntimeConfig()
    let baseUrl: string

    if (import.meta.server && runtimeConfig.serverApiUrl) {
        baseUrl = runtimeConfig.serverApiUrl
    }
    else if (runtimeConfig.public.api?.url) {
        baseUrl = runtimeConfig.public.api.url
    }
    else if (runtimeConfig.public.site?.url) {
        baseUrl = runtimeConfig.public.site.url
    }
    else {
        baseUrl = ''
    }

    // With no base URL, `joinURL('', '/api')` resolves to the relative path
    // `/api`: on the server this is resolved against the Nuxt server itself,
    // which has no such route and silently falls through to the catch-all
    // page, which fetches the same URL again — an unbounded SSR loop that
    // eventually crashes with an out-of-memory error. Fail fast instead.
    if (!baseUrl && import.meta.server) {
        throw createError({
            statusCode: 500,
            message: '[getApiUrl] No API base URL is configured '
                + '(NUXT_SERVER_API_URL, NUXT_PUBLIC_API_URL and NUXT_PUBLIC_SITE_URL are all empty). '
                + 'Set one of these in your .env file.',
        })
    }

    return joinURL(
        baseUrl,
        runtimeConfig.public.api?.endpointPrefix || '',
    )
}
