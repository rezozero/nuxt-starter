import type { ActionTree, ActionContext } from 'vuex'
import { Context, NuxtError } from '@nuxt/types'
import { AxiosError } from 'axios'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import type { BodyScrollOptions } from 'body-scroll-lock'
import { joinURL } from 'ufo'
import { RootState } from '~/types/store'
import MutationType from '~/constants/mutation-type'
import { CommonContent, PageResponse } from '~/types/api'

const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit, dispatch }: ActionContext<RootState, RootState>, context: Context) {
        const { app, $roadiz, $sentry } = context

        // fetch page from Roadiz for dynamic route
        if (context.route.name === 'all') {
            await dispatch('fetchPage', context)
                .then((response: PageResponse) => {
                    commit(MutationType.FIRST_PAGE_DATA, response)

                    if (response.page && response.alternateLinks) {
                        const locale = response.alternateLinks.find(
                            (link) => link.url === response.page.item.url
                        )?.locale

                        if (locale) app.i18n.locale = locale
                    }
                })
                .catch((requestError: AxiosError) => {
                    $sentry.captureException(requestError)

                    commit(MutationType.FIRST_PAGE_ERROR, {
                        statusCode: requestError.response?.status,
                        message: requestError.message,
                    } as NuxtError)
                })
        }

        return $roadiz
            .get<CommonContent>('common_content', {
                params: {
                    _locale: app.i18n.locale,
                },
            })
            .then((response) => {
                const { mainMenuWalker, home } = response.data

                if (mainMenuWalker) commit(MutationType.MAIN_MENU_DATA, mainMenuWalker)
                if (home) commit(MutationType.HOME_DATA, mainMenuWalker)
            })
    },
    fetchPage(_actionContext: ActionContext<RootState, RootState>, context: Context): Promise<PageResponse> {
        const path = joinURL('/', context.params.pathMatch)

        return context.$roadiz.getWebResponseByPath(path).then((response) => {
            if (!response.data['@type']) {
                throw new Error('Fetched data is not typed.')
            }
            /*
             * TODO: Add custom data here according to response.data['@type']
             */
            switch (response.data['@type']) {
                default:
                    return {
                        page: response.data,
                        alternateLinks: context.$roadiz.getAlternateLinks(response),
                    }
            }
        })
    },
    updatePageData({ commit }: ActionContext<RootState, RootState>, data: PageResponse) {
        commit(MutationType.ALTERNATE_LINKS, data.alternateLinks || [])
    },
    updateNextPageData({ state, dispatch }: ActionContext<RootState, RootState>) {
        if (state.nextPageData) return dispatch('updatePageData', state.nextPageData)
    },
    disableScroll(
        { commit }: ActionContext<RootState, RootState>,
        { element, options }: { element: HTMLElement; options?: BodyScrollOptions }
    ) {
        disableBodyScroll(element, options)

        commit(MutationType.SCROLL_IS_DISABLED, true)
    },
    enableScroll({ commit }: ActionContext<RootState, RootState>, { element }: { element: HTMLElement }) {
        enableBodyScroll(element)

        commit(MutationType.SCROLL_IS_DISABLED, false)
    },
}

export default actions
