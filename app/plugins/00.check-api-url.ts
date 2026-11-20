// Without any API or site URL, `getApiUrl()` returns a relative `/api`, which SSR
// resolves against the Nuxt server itself: it falls through to the catch-all page,
// which fetches the same URL again, an unbounded loop ending in an out-of-memory crash.
export default defineNuxtPlugin({
    name: 'check-api-url',
    setup() {
        const runtimeConfig = useRuntimeConfig()
        const apiUrl = getApiUrl()
        const isInvalid = apiUrl === runtimeConfig.public.api?.endpointPrefix || apiUrl === ''

        if (isInvalid) {
            throw new Error('[check-api-url] NUXT_PUBLIC_API_URL is not set. '
                + 'Without it the app fetches itself in an infinite loop. Set it in your .env file.')
        }
    },
})
