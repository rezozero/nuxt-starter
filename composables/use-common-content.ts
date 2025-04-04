import type { RoadizNodesSources, RoadizNodesSourcesHead, RoadizWalker } from '@roadiz/types'
import type { RoadizWalkerKnown } from '~/utils/roadiz/types'
import type { NSMenu, NSMenuLink } from '~/types/roadiz'

// add here all the available reachable types (NSPage, NSFooter, ...) from the Roadiz exported types
type MenuItem = NSMenuLink | NSMenu

export interface CommonContent {
    home?: RoadizNodesSources
    head?: RoadizNodesSourcesHead
    menus?: Record<
        typeof MENUS_KEYS[number],
        RoadizWalkerKnown<NSMenu, MenuItem>
    >
    errorPage?: RoadizWalker
    // footers?: Record<typeof FOOTER_MENUS_KEYS[number], RoadizWalkerKnown<NSFooter>>
    accessibility?: RoadizNodesSources
}

export const COMMON_CONTENT_KEY = 'commonContent'
export const MENUS_KEYS = ['mainMenuWalker'] as const
// export const FOOTER_MENUS_KEYS = ['footerWalker'] as const

export function useCommonContent() {
    const nuxtApp = useNuxtApp()
    // the useCommonContentFetch() function should be called before this function
    const data = computed(() => nuxtApp.payload.data[COMMON_CONTENT_KEY])

    return data
}
