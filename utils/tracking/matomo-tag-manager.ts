/**
 * @see https://developer.matomo.org/guides/tagmanager/embedding
 * @param {string} id
 * @param {string} matomoTagManagerUrl
 */
export function createMatomoTagManagerScript(id: string, matomoTagManagerUrl: string): string {
    return `
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='${matomoTagManagerUrl}/js/container_${id}.js'; s.parentNode.insertBefore(g,s);
    `
}
