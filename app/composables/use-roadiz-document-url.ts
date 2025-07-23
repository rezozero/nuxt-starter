import { joinURL } from 'ufo'

export function useRoadizDocumentUrl(path?: string) {
    const runtimeConfig = useRuntimeConfig()

    return joinURL(
        (runtimeConfig.public.api?.url || runtimeConfig.public.site?.url || '') as string,
        runtimeConfig.public.api?.documentPath || '',
        path || '',
    )
}
