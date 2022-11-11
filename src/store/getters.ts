import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'

export const getters: GetterTree<RootState, RootState> = {
    homePagePath: (state: RootState) => {
        return state.homeData?.url || '/'
    },
}

export default getters
