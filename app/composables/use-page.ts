import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import EventType from '~/constants/event-type'

export interface Page {
    title?: string
    webResponse?: RoadizWebResponse
    alternateLinks?: RoadizAlternateLink[]
}

type UsePageOptions = Page

export function usePage(options?: UsePageOptions) {
    const nextPage = useNextPage()
    const currentPage = useCurrentPage()

    nextPage.value = {
        title: options?.title,
        webResponse: options?.webResponse,
        alternateLinks: options?.alternateLinks,
    }

    function onPageTransitionAfterLeave() {
        currentPage.value = { ...nextPage.value }
    }

    usePageTransitionEvent(EventType.PAGE_TRANSITION_AFTER_LEAVE, onPageTransitionAfterLeave)
}
