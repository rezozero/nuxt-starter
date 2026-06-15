import type { RoadizNodesSources, RoadizNodesSourcesHead, RoadizWalker } from '@roadiz/types'
import type { RoadizWalkerKnown } from '~/utils/roadiz/types'
import type { NSMenu, NSMenuLink } from '~~/types/roadiz'

// add here all the available reachable types (NSPage, NSFooter, ...) from the Roadiz exported types
type MenuItem = NSMenuLink | NSMenu

type CommonContentMenus = Record<typeof MENU_SLUGS[number], RoadizWalkerKnown<NSMenu, MenuItem>>
// TODO: replace RoadizNodesSources with NSFooter when the type will be exported from Roadiz
type CommonContentFooters = Record<typeof FOOTER_SLUGS[number], RoadizWalkerKnown<RoadizNodesSources>>

export interface CommonContent {
    home?: RoadizNodesSources
    head?: RoadizNodesSourcesHead
    menus?: Partial<CommonContentMenus>
    footers?: Partial<CommonContentFooters>
    errorPage?: RoadizWalker
    accessibility?: RoadizNodesSources
    urls?: Record<`${string}_url` | `${string}Url`, unknown>
}

export const COMMON_CONTENT_KEY = 'commonContent'
export const MENU_SLUGS = ['mainMenuWalker', 'footerMenuWalker'] as const
export const FOOTER_SLUGS = ['footerWalker'] as const

// the useCommonContentFetch() function should be called before this function
export function useCommonContent() {
    return useNuxtData<CommonContent>(COMMON_CONTENT_KEY)
}
