export function trackPageView(title?: string, path?: string) {
    // Matomo: https://developer.matomo.org/guides/spa-tracking
    if (window._paq) {
        window._paq.push(['setCustomUrl', path || window.location.pathname])
        window._paq.push(['setDocumentTitle', title || window.document.title])
        // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
        window._paq.push(['deleteCustomVariables', 'page'])
        window._paq.push(['trackPageView'])
    }
    // Using Matomo Tag Manager: https://developer.matomo.org/guides/spa-tracking
    if (window._mtm) {
        window._mtm.push({ event: 'mtm.PageView' })
    }
    // Google Gtag4
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: title || window.document.title,
            page_path: path || window.location.pathname,
        })
    }
    // Google Analytics
    if (window.ga) {
        window.ga('send', 'pageview', path || window.location.pathname)
    }
}

export function trackEvent(
    category: string,
    action: string,
    label: string | null = null,
    value: string | number | null = null
) {
    // Matomo
    window._paq?.push(['trackEvent', category, action])
    // Google Gtag4
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        })
    } else {
        // Google Analytics
        window.ga?.('send', 'event', category, action)
    }
}
