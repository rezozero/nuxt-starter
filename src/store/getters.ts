import { GetterTree } from 'vuex'
import { RootState } from '~/types/store'

export const getters: GetterTree<RootState, RootState> = {
    homePagePath: (state: RootState) => {
        return state.headData?.homePageUrl || '/'
    },
}

export default getters
