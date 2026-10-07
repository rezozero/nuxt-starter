import { joinURL } from 'ufo'

export function useRoadizDocumentUrl(path?: string) {
    const runtimeConfig = useRuntimeConfig()
    const pathValue = path || ''

    // Use noProcessBaseUrl if the external object storage file needs a proxy (roadiz or intervention request)
    const noProcessBaseUrl = runtimeConfig.public.interventionRequest?.noProcessBaseUrl
    if (noProcessBaseUrl) return joinURL(noProcessBaseUrl, pathValue)

    // Always uses the public URL — this value is rendered in HTML (e.g. <img src>)
    // and must be identical on server and client to avoid hydration mismatches.
    return joinURL(
        runtimeConfig.public.api?.url || runtimeConfig.public.site?.url || '',
        runtimeConfig.public.api?.documentPath || '',
        pathValue,
    )
}
