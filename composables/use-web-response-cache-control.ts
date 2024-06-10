import type { RoadizWebResponse } from '@roadiz/types'

export function useWebResponseCacheControl(webResponse?: RoadizWebResponse) {
    const maxAge = webResponse?.maxAge
    const cacheControlConfig = useRuntimeConfig().cacheControl

    useCacheControl({
        maxAge:
            (typeof maxAge === 'number' && maxAge < 0) || typeof maxAge !== 'number'
                ? cacheControlConfig?.maxAge ?? 60 * 60
                : maxAge,
        staleWhileRevalidate: cacheControlConfig?.staleWhileRevalidate ?? 60 * 2,
        public: cacheControlConfig?.public ?? true,
    })
}
