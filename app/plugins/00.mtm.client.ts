import { CONTENT_VIEW_EVENT, getNotFoundPageTitle, NOT_FOUND_EVENT, pushTrackingEvent } from '~/utils/tracking/mtm'

interface MatomoTagManagerApi {
    _mtm?: Record<string, unknown>[]
}

declare global {
    interface Window extends MatomoTagManagerApi {}
}

// In ms, once the page has loaded
const CONTAINER_IDLE_TIMEOUT = 1000

/*
 * Matomo Tag Manager (MTM)
 * Inactive while `runtimeConfig.public.matomoTagManager.src` (NUXT_PUBLIC_MATOMO_TAG_MANAGER_SRC) is empty.
 *
 * Events pushed to the `_mtm` data layer, to be handled by the container:
 * - `content_view`: page viewed by client navigation (`page_url`, `page_title`). The first page view
 *   is left to the native `Pageview` trigger of the container.
 * - `page_not_found`: 404 reached by client navigation (`page_url`, `page_title` as `404/URL = …/From = …`).
 *   On a full load, the error page sets `data-status-code` on `<html>` for the container to read.
 * - `tracking_event`: custom event (`event_category`, `event_action`, `event_name`, `form_id`), pushed
 *   with `pushTrackingEvent()` or on click on an element carrying `data-mtm-category`, `data-mtm-action`
 *   and `data-mtm-name` attributes.
 */
export default defineNuxtPlugin({
    name: 'mtm',
    parallel: true,
    setup() {
        const config = useRuntimeConfig().public.matomoTagManager

        if (!config?.src) return

        // The container (and the consent manager it may bring) is only loaded after the page load,
        // otherwise it shares the bandwidth of the LCP resources. Created now, the queue keeps
        // the events pushed meanwhile, and the snippet reuses it.
        window._mtm ||= []

        const headEntry = useHead({})
        const injectSnippet = () => requestIdleCallback(() => headEntry.patch({
            script: [
                {
                    innerHTML: `var _mtm = window._mtm = window._mtm || [];_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});(function() {var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.async=true; g.src=${JSON.stringify(config.src)}; s.parentNode.insertBefore(g,s);})();`,
                    type: 'text/javascript',
                },
            ],
        }), { timeout: CONTAINER_IDLE_TIMEOUT })

        if (document.readyState === 'complete') injectSnippet()
        else window.addEventListener('load', injectSnippet, { once: true })

        // Page views by client navigation. On hydration, the current page is set with the same URL: no push.
        // The error page empties the current page: no push either.
        const currentPage = useCurrentPage()

        watch(currentPage, (newValue, oldValue) => {
            const newUrl = toValue(newValue?.webResponse)?.item?.url
            const oldUrl = toValue(oldValue?.webResponse)?.item?.url

            if (!newUrl || newUrl === oldUrl) return

            window._mtm?.push({
                event: CONTENT_VIEW_EVENT,
                page_url: newUrl,
                page_title: newValue?.title,
            })
        })

        // A 404 reached by client navigation (the error of a full load is in the payload: no change)
        const error = useError()

        watch(error, (newError) => {
            if (newError?.statusCode !== 404) return

            const url = window.location.pathname + window.location.search
            // `document.referrer` keeps the entry page in SPA: the previous page is in the router state
            const previousPath = window.history.state?.back
            const from = typeof previousPath === 'string' ? new URL(previousPath, window.location.origin).href : ''

            window._mtm?.push({
                event: NOT_FOUND_EVENT,
                page_url: url,
                page_title: getNotFoundPageTitle(url, from),
            })
        })

        // Elements carrying `data-mtm-*` attributes push their own event. Capture phase,
        // so the push happens before any listener prevents the navigation (router links).
        document.addEventListener('click', (event) => {
            const element = (event.target as Element | null)?.closest?.<HTMLElement>('[data-mtm-name]')
            const { mtmCategory, mtmAction, mtmName } = element?.dataset || {}

            if (!mtmCategory || !mtmAction || !mtmName) return

            pushTrackingEvent({ category: mtmCategory, action: mtmAction, name: mtmName })
        }, { capture: true })
    },
})
