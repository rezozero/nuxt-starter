import { joinURL } from 'ufo'

export function useApiUrl() {
    const runtimeConfig = useRuntimeConfig()

    return joinURL(
        (runtimeConfig.public.api?.url || runtimeConfig.public.site?.url || '') as string,
        (runtimeConfig.public.api?.endpointPrefix || '') as string,
    )
}
