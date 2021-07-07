export function trackPageView(title?: string, path?: string) {
    // Matomo
    window._paq?.push(['trackPageView'])
    // Google Gtag4
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: title || window.document.title,
            page_path: path || window.location.pathname,
        })
    } else {
        // Google Analytics
        window.ga?.('send', 'pageview', path || window.location.pathname)
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
