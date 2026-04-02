import { joinURL } from 'ufo'

export function useRoadizDocumentUrl(path?: string) {
    const runtimeConfig = useRuntimeConfig()

    // Always uses the public URL — this value is rendered in HTML (e.g. <img src>)
    // and must be identical on server and client to avoid hydration mismatches.
    return joinURL(
        (runtimeConfig.public.api?.url || runtimeConfig.public.site?.url || '') as string,
        runtimeConfig.public.api?.documentPath || '',
        path || '',
    )
}
