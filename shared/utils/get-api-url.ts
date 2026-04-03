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

    if (import.meta.server && typeof runtimeConfig.serverApiUrl === 'string') {
        baseUrl = runtimeConfig.serverApiUrl
    }
    else if (typeof runtimeConfig.public.api?.url === 'string') {
        baseUrl = runtimeConfig.public.api?.url
    }
    else if (typeof runtimeConfig.public.site?.url === 'string') {
        baseUrl = runtimeConfig.public.site?.url
    }
    else {
        baseUrl = ''
    }

    return joinURL(
        baseUrl,
        typeof runtimeConfig.public.api?.endpointPrefix === 'string' ? runtimeConfig.public.api.endpointPrefix : '',
    )
}
