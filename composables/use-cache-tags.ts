import { useSSRContext } from 'vue'

export function useCacheTags(cacheTags?: string) {
    if (process.client || !cacheTags) {
        return
    }

    // Prevent logging warnings when not in Nuxt context.
    if (!tryUseNuxtApp()) {
        return
    }
    // console.log('useCacheTags 2')
    const ssrContext = useSSRContext()

    if (ssrContext && ssrContext.event) {
        // console.log('cacheTags', cacheTags)
        // Inject the cache control options into the SSR context
        ssrContext.event.context.cacheTags = [ssrContext.event.context.cacheTags, cacheTags]
            .filter((value) => typeof value === 'string')
            .join(',')
    }
}
