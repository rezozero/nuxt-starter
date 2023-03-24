import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'

export const getters: GetterTree<RootState, RootState> = {
    homePagePath: (state: RootState) => {
        return state.commonContent?.home?.url || '/'
    },
    currentPageAlternateLinks(state: RootState) {
        return state.currentPageData?.alternateLinks || []
    },
}

export default getters
