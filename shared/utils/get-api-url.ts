import { joinURL } from 'ufo'

export function getApiUrl() {
    const runtimeConfig = useRuntimeConfig()

    return joinURL(
        useApiBaseUrl(),
        (runtimeConfig.public.api?.endpointPrefix || '') as string,
    )
}
