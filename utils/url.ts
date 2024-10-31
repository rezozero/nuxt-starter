export function encodeUrlParams(params: object): string {
    return Object.entries(params)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&')
}
