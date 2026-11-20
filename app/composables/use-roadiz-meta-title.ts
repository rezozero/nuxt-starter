import type { RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import type { EventsApi } from '@events-api/javascript-sdk'
import type { MaybeRefOrGetter } from 'vue'

// The common content needs to be fetched before reading the title, for the site name fallback.
// Usable outside the page (e.g. layout, analytics) to get the same title as the page head.
export function useRoadizMetaTitle(webResponse?: MaybeRefOrGetter<RoadizWebResponse | undefined>) {
    const { getPageTitle } = useRoadizPageTitle()

    return computed(() => {
        // The API should always return a meta title.
        // The meta title is set in the Roadiz back office for each page. The logic is:
        // - a custom meta title is set in the back office for the page,
        // - or the API build a meta title from the page title and the site name.
        const metaTitle = toValue(webResponse)?.head?.metaTitle

        if (metaTitle) {
            return metaTitle
        }

        // In case it doesn't returned, we fallback to the page title or name (event).
        const item = toValue(webResponse)?.item
        const fallbackTitle = (item as RoadizNodesSources)?.title || (item as EventsApi.Event)?.name

        if (fallbackTitle) {
            return getPageTitle(fallbackTitle)
        }

        return ''
    })
}
