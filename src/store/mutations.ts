import type { MutationTree } from 'vuex'
import { NuxtError } from '@nuxt/types'
import { RootState } from '~/types/store'
import { CommonContent, PageResponse } from '~/types/api'
import MutationType from '~/constants/mutation-type'

export default {
    [MutationType.WINDOW_WIDTH]: (state, value: number) => (state.windowWidth = value),
    [MutationType.WINDOW_HEIGHT]: (state, value: number) => (state.windowHeight = value),
    [MutationType.CURRENT_PAGE_DATA]: (state, value: PageResponse) => (state.currentPageData = value),
    [MutationType.FIRST_PAGE_DATA]: (state, value: PageResponse) => (state.firstPageData = value),
    [MutationType.FIRST_PAGE_ERROR]: (state, value: NuxtError) => (state.firstPageError = value),
    [MutationType.NEXT_PAGE_DATA]: (state, value: PageResponse) => (state.nextPageData = value),
    [MutationType.PREVIOUS_PAGE_DATA]: (state, value: PageResponse) => (state.previousPageData = value),
    [MutationType.COMMON_CONTENT]: (state, value: CommonContent) => (state.commonContent = value),
    [MutationType.PREFERS_REDUCED_MOTION]: (state, value: boolean) => (state.prefersReducedMotion = value),
    [MutationType.SCROLL_IS_DISABLED]: (state, value: boolean) => (state.scrollIsDisabled = value),
} as MutationTree<RootState>
