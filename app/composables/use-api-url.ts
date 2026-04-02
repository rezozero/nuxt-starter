import { joinURL } from 'ufo'
import { useApiBaseUrl } from './use-api-base-url'

export function useApiUrl() {
    const runtimeConfig = useRuntimeConfig()

    return joinURL(
        useApiBaseUrl(),
        (runtimeConfig.public.api?.endpointPrefix || '') as string,
    )
}
