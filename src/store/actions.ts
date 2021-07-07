import { ActionTree, ActionContext } from 'vuex'
import { Context, NuxtError } from '@nuxt/types'
import { AxiosError } from 'axios'
import { RoadizApiNSParams } from '@roadiz/abstract-api-client/dist/types/roadiz-api'
import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { RootState } from '~/types/store'
import MutationType from '~/constants/mutation-type'
import { PageResponse } from '~/types/api'

const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit, dispatch }: ActionContext<RootState, RootState>, context: Context) {
        const { app, $api, $sentry } = context

        await dispatch('fetchPage', context)
            .then((response: RoadizNodesSources) => {
                commit(MutationType.FIRST_PAGE_DATA, response)

                if (response.translation) {
                    app.i18n.locale = response.translation.locale
                }
            })
            .catch((requestError: AxiosError) => {
                $sentry.captureException(requestError)

                commit(MutationType.FIRST_PAGE_ERROR, {
                    statusCode: requestError.response?.status,
                    message: requestError.message,
                } as NuxtError)
            })

        return $api
            .getCommonContent({
                _locale: app.i18n.locale,
                'node.visible': true,
            } as RoadizApiNSParams)
            .then((response) => {
                const { mainMenuWalker, head } = response.data

                if (head) commit(MutationType.HEAD_DATA, head)
                if (mainMenuWalker) commit(MutationType.MAIN_MENU_DATA, mainMenuWalker)
            })
    },
    fetchPage(actionContext: ActionContext<RootState, RootState>, context: Context): Promise<PageResponse> {
        return context.$api.getSingleNodesSourcesByPath(context.params.pathMatch).then((response) => {
            return {
                page: response.data,
                alternateUrls: context.$api.getAlternateLinks(response),
            }
        })
    },
    updatePageData({ commit }: ActionContext<RootState, RootState>, data: PageResponse) {
        commit(MutationType.ALTERNATE_URLS, data.alternateUrls || [])
    },
}

export default actions
