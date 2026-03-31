import { joinURL } from 'ufo'

export function useApiUrl() {
    const runtimeConfig = useRuntimeConfig()

    return joinURL(
        useApiBaseUrl(),
        (runtimeConfig.public.api?.endpointPrefix || '') as string,
    )
}
