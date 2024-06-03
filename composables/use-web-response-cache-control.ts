import type { RoadizWebResponse } from '@roadiz/types'

export function useWebResponseCacheControl(webResponse?: RoadizWebResponse) {
    const maxAge = webResponse?.maxAge
    const config = useRuntimeConfig().cacheControl

    useCacheControl({
        maxAge:
            (typeof maxAge === 'number' && maxAge < 0) || typeof maxAge !== 'number'
                ? config?.maxAge ?? 60 * 60
                : maxAge,
        staleWhileRevalidate: config?.staleWhileRevalidate ?? 60 * 2,
        public: config?.public ?? true,
    })
}
