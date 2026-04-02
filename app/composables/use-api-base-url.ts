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
export const useApiBaseUrl = (): string => {
    const runtimeConfig = useRuntimeConfig()

    if (import.meta.server && runtimeConfig.serverApiUrl) {
        return runtimeConfig.serverApiUrl as string
    }

    return (runtimeConfig.public.api?.url || runtimeConfig.public.site?.url || '') as string
}
