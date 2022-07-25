<template>
    <div>
        <h1>{{ pageData.item.title }}</h1>
        <block-factory :blocks="pageData.blocks"></block-factory>
    </div>
</template>

<script lang="ts">
import { Context, NuxtError } from '@nuxt/types'
import { AxiosError } from 'axios'
import { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/abstract-api-client/dist/types/roadiz'
import mixins from 'vue-typed-mixins'
import MutationType from '~/constants/mutation-type'
import { PageResponse } from '~/types/api'
import BlockFactory from '~/components/organisms/BlockFactory.vue'
import Page from '~/mixins/Page'
import httpCache from '~/middleware/httpCache'

interface AsyncData {
    pageData: RoadizWebResponse
    alternateLinks?: RoadizAlternateLink[]
}

export default mixins(Page).extend({
    name: 'DefaultPage',
    nuxtI18n: false,
    components: { BlockFactory },
    middleware: httpCache(),
    async asyncData(context: Context): Promise<AsyncData> {
        const data = {} as AsyncData
        const { store, error, $sentry } = context

        if (process.server) {
            // during server rendering the page data has been already loaded by the nuxtServerInit action
            // on static mode each page is server renderer
            // but not with dev or preview mode
            if (store.state.firstPageData) {
                data.pageData = store.state.firstPageData?.page
                data.alternateLinks = store.state.firstPageData?.alternateLinks

                if (data.pageData.item.url && context.route.path && data.pageData.item.url !== context.route.path) {
                    context.redirect(301, data.pageData.item.url)
                }

                store.dispatch('updatePageData', store.state.firstPageData)
            } else if (store.state.firstPageError) {
                error(store.state.firstPageError)
            }
        } else {
            await store
                .dispatch('fetchPage', context)
                .then((response: PageResponse) => {
                    data.pageData = response.page
                    data.alternateLinks = response.alternateLinks

                    if (data.pageData.item.url && context.route.path && data.pageData.item.url !== context.route.path) {
                        context.redirect(301, data.pageData.item.url)
                    }
                })
                .catch((requestError: AxiosError) => {
                    $sentry.captureException(requestError)

                    error({
                        statusCode: requestError.response?.status,
                        message: requestError.message,
                    } as NuxtError)
                })
        }

        store.commit(MutationType.NEXT_PAGE_DATA, {
            page: data.pageData,
            alternateLinks: data.alternateLinks,
        } as PageResponse)

        return data
    },
    // created() {
    //     // set the locale for first render on the client side (without asyncData)
    //     if (this.pageData && this.alternateLinks) {
    //         const locale = this.alternateLinks.find((link) => link.url === this.pageData.item.url)?.locale
    //
    //         if (locale) this.$i18n.locale = locale
    //     }
    // },
})
</script>
