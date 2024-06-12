export function encodeUrlParams(params: object): string {
    return Object.entries(params)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&')
}

export function isInternalUrl(url: string | undefined | null, siteUrl?: string) {
    if (!url) return false

    return url.charAt(0) === '/' || url.charAt(0) === '#' || (siteUrl && url.startsWith(siteUrl))
}
