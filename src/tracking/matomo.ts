/**
 * @see https://developer.matomo.org/guides/tracking-javascript-guide
 * @param {string} id
 * @param {string} matomoUrl
 */
export function createMatomoScript(id: string, matomoUrl: string): string {
    return `
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//${matomoUrl}/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '${id}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    `
}
