<template>
  <div>
    <block-factory :blocks="pageData.blocks"></block-factory>
  </div>
</template>

<script lang="ts">
import {Context, NuxtError} from '@nuxt/types'
import {AxiosError} from 'axios'
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'
import {RoadizNodesSources} from "@roadiz/abstract-api-client/dist/types/roadiz";
import {AlternateLink} from "@roadiz/abstract-api-client/dist/types/roadiz-api";
import {PageResponse} from "~/types/api";

interface AsyncData {
  pageData: RoadizNodesSources
  alternateUrls?: AlternateLink[]
}

export default Vue.extend({
  name: 'DefaultPage',
  async asyncData(context: Context): Promise<AsyncData> {
    const data = {} as AsyncData
    const {store, error} = context

    if (process.server) {
      // during server rendering the page data has been already loaded by the nuxtServerInit action
      // on static mode each page is server renderer
      // but not with dev or preview mode
      if (store.state.firstPageData) {
        data.pageData = store.state.firstPageData?.page
        data.alternateUrls = store.state.firstPageData?.alternateUrls

        if (data.pageData.url && context.route.path && data.pageData.url !== context.route.path) {
          context.redirect(301, data.pageData.url)
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
            data.alternateUrls = response.alternateUrls

            if (data.pageData.url && context.route.path && data.pageData.url !== context.route.path) {
              context.redirect(301, data.pageData.url)
            }
          })
          .catch((requestError: AxiosError) => {
            // $sentry.captureException(requestError)

            error({
              statusCode: requestError.response?.status,
              message: requestError.message,
            } as NuxtError)
          })
    }

    store.commit(MutationType.NEXT_PAGE_DATA, {
      page: data.pageData,
      alternateUrls: data.alternateUrls,
    } as PageResponse)

    return data
  },
  data() {
    return {
      pageData: {} as RoadizNodesSources,
      alternateUrls: [] as AlternateLink[],
    }
  },
  // created() {
  //   // set the locale for first render on the client side (without asyncData)
  //   if (this.pageData && this.pageData.translation) this.$i18n.locale = this.pageData.translation.locale
  // },
})
</script>
