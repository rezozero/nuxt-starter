export function encodeUrlParams(params: object): string {
    return Object.entries(params)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&')
}

export function isHttpUrlScheme(url: string) {
    return url.startsWith('http://') || url.startsWith('https://')
}

export function isRelativeUrl(url: string) {
    return url.charAt(0) === '/'
}

export function isInternalURL(url: string, siteUrl?: string) {
    return isRelativeUrl(url) || (siteUrl && url.startsWith(siteUrl))
}

export function isExternalUrl(url: string, siteUrl?: string) {
    return isHttpUrlScheme(url) && !isInternalURL(url, siteUrl)
}
