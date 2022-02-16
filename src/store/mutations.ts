import { MutationTree } from 'vuex'
import { NuxtError } from '@nuxt/types'
import { RoadizAlternateLink, RoadizNodesSources, RoadizWalker } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { RootState } from '~/types/store'
import { PageResponse } from '~/types/api'
import MutationType from '~/constants/mutation-type'

export default {
    [MutationType.WINDOW_WIDTH]: (state, value: number) => (state.windowWidth = value),
    [MutationType.WINDOW_HEIGHT]: (state, value: number) => (state.windowHeight = value),
    [MutationType.ALTERNATE_LINKS]: (state, value: RoadizAlternateLink[]) => (state.alternateLinks = value),
    [MutationType.FIRST_PAGE_DATA]: (state, value: PageResponse) => (state.firstPageData = value),
    [MutationType.FIRST_PAGE_ERROR]: (state, value: NuxtError) => (state.firstPageError = value),
    [MutationType.NEXT_PAGE_DATA]: (state, value: PageResponse) => (state.nextPageData = value),
    [MutationType.PREVIOUS_PAGE_DATA]: (state, value: PageResponse) => (state.previousPageData = value),
    [MutationType.MAIN_MENU_DATA]: (state, value: RoadizWalker) => (state.mainMenuData = value),
    [MutationType.HOME_DATA]: (state, value: RoadizNodesSources) => (state.homeData = value),
    [MutationType.PREFERS_REDUCED_MOTION]: (state, value: boolean) => (state.prefersReducedMotion = value),
    [MutationType.SCROLL_IS_DISABLED]: (state, value: boolean) => (state.scrollIsDisabled = value),
} as MutationTree<RootState>
