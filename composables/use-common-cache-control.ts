// dunno why but I can't extends the CacheControlOptions type from the nuxt-cache-control module

interface UseCacheControlOptions {
    maxAge?: number
    sMaxAge?: number
    staleWhileRevalidate?: number
    public?: boolean
}

interface UseCommonCacheControlsOptions extends UseCacheControlOptions {
    rawHeader?: string
}

function isValidAge(age: unknown) {
    return (typeof age === 'number' && age < 0) || typeof age !== 'number'
}

function getAgeValue(
    options: UseCommonCacheControlsOptions | undefined,
    rawKey: string,
    key: string,
) {
    const regexp = new RegExp(`${rawKey}=(\\d+)`)
    const rawValue = options?.rawHeader?.match(regexp)?.[1]

    if (rawValue) return Number(rawValue)

    const value = options?.[key as keyof UseCommonCacheControlsOptions]

    if (isValidAge(value)) return value as number

    const cacheControlConfig = useRuntimeConfig().public.cacheControl
    const configValue = cacheControlConfig?.[key as keyof typeof cacheControlConfig]

    if (isValidAge(configValue)) return configValue as number
}

export function useCommonCacheControl(options?: UseCommonCacheControlsOptions) {
    const cacheControlConfig = useRuntimeConfig().public.cacheControl
    const { isActive: previewIsActive } = useRoadizPreview()

    useCacheControl({
        maxAge: getAgeValue(options, 'max-age', 'maxAge'),
        sMaxAge: getAgeValue(options, 's-maxage', 'sMaxAge'),
        staleWhileRevalidate: getAgeValue(options, 'stale-while-revalidate', 'staleWhileRevalidate'),
        public: previewIsActive.value ? false : cacheControlConfig?.public ?? true,
    })
}
