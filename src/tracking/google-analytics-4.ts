/**
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs
 * @param id
 */
export function createGoogleAnalytics4Script(id: string): string {
    return `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
    `
}
