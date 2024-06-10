import { joinURL } from 'ufo'

export function useJoinApiUrl(path: string) {
    const prefix = useRuntimeConfig().public.api?.endpointPrefix || '/'
    const prefixWithLeadingSlash = prefix && joinURL('/', prefix)
    const pathWithLeadingSlash = joinURL('/', path)
    const formattedPath =
        prefixWithLeadingSlash && pathWithLeadingSlash?.startsWith(prefixWithLeadingSlash)
            ? path.replace(prefixWithLeadingSlash, '')
            : path

    return joinURL(useApiUrl(), formattedPath)
}
