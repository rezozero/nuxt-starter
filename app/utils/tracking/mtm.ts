export interface TrackingEvent {
    category: string
    action: string
    name: string
    formId?: number | string
}

// Custom events read by the Matomo Tag Manager container (Custom Event triggers)
export const CONTENT_VIEW_EVENT = 'content_view'
export const NOT_FOUND_EVENT = 'page_not_found'
export const TRACKING_EVENT = 'tracking_event'

/*
 * Page title of a 404 view, grouped under `404` in the Matomo page titles report.
 * Same format as the one Matomo recommends for 404 pages, so a 404 reached by client navigation
 * and a 404 of a full load (titled by the container) are reported together.
 * @see https://matomo.org/faq/how-to/faq_60/
 */
export function getNotFoundPageTitle(url: string, from: string): string {
    return `404/URL = ${encodeURIComponent(url)}/From = ${encodeURIComponent(from)}`
}

/*
 * Pushes an event to the Matomo Tag Manager data layer, to be read by a Matomo Event tag
 * (category / action / name from DataLayer variables `event_category`, `event_action`, `event_name`).
 * Every key is always set, `form_id` included: MTM DataLayer variables keep their last value.
 */
export function pushTrackingEvent({ category, action, name, formId }: TrackingEvent): void {
    window._mtm?.push({
        event: TRACKING_EVENT,
        event_category: category,
        event_action: action,
        event_name: name,
        form_id: formId ?? '',
    })
}
