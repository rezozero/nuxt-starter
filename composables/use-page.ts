import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import EventType from '~/constants/event-type'

export interface Page {
    title?: string
    webResponse?: RoadizWebResponse
    alternateLinks?: RoadizAlternateLink[]
}

function pageHasMissingKey(page: Page) {
    return ['title', 'webResponse', 'alternateLinks'].some(key => !page[key as keyof Page])
}

interface UsePageOptions extends Page {}

export function usePage(options?: UsePageOptions) {
    const nextPage = useNextPage()
    const currentPage = useCurrentPage()

    nextPage.value = {
        title: options?.title,
        webResponse: options?.webResponse,
        alternateLinks: options?.alternateLinks,
    }

    watch(currentPage, (page) => {
        useHead({ title: page.title })
        useAlternateLinks(page.alternateLinks)
    })

    if (pageHasMissingKey(currentPage.value)) currentPage.value = { ...nextPage.value }

    function onPageTransitionAfterLeave() {
        currentPage.value = { ...nextPage.value }
    }

    usePageTransitionEvent(EventType.PAGE_TRANSITION_AFTER_LEAVE, onPageTransitionAfterLeave)
}
