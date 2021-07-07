import { MutationTree } from 'vuex'
import { NuxtError } from '@nuxt/types'
import { RootState } from '~/types/store'
import {PageResponse} from '~/types/api'
import MutationType from '~/constants/mutation-type'
import {RoadizHead, RoadizWalker} from "@roadiz/abstract-api-client/dist/types/roadiz";

export default {
    [MutationType.WINDOW_WIDTH]: (state, value: number) => (state.windowWidth = value),
    [MutationType.WINDOW_HEIGHT]: (state, value: number) => (state.windowHeight = value),
    [MutationType.ALTERNATE_URLS]: (state, value: string) => (state.alternateUrls = value),
    [MutationType.FIRST_PAGE_DATA]: (state, value: PageResponse) => (state.firstPageData = value),
    [MutationType.FIRST_PAGE_ERROR]: (state, value: NuxtError) => (state.firstPageError = value),
    [MutationType.NEXT_PAGE_DATA]: (state, value: PageResponse) => (state.nextPageData = value),
    [MutationType.PREVIOUS_PAGE_DATA]: (state, value: PageResponse) => (state.previousPageData = value),
    [MutationType.MAIN_MENU_DATA]: (state, value: RoadizWalker) => (state.mainMenuData = value),
    [MutationType.HEAD_DATA]: (state, value: RoadizHead) => (state.headData = value),
} as MutationTree<RootState>
