/*
 * Decode base64 string to UTF-8 string on client-side and Node.js
 */
export function b64DecodeUnicode(str: string) {
    if (!import.meta.server) {
        return decodeURIComponent(
            Array.prototype.map
                .call(window.atob(str), function (c: string) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join(''),
        )
    }

    return decodeURIComponent(
        Array.prototype.map
            .call(Buffer.from(str, 'base64').toString('binary'), function (c: string) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
    )
}
