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
import {getNodesSourcesTitle} from "~/utils/roadiz";
import {createFacebookMeta} from "~/social/facebook";
import {createTwitterMeta} from "~/social/twitter";
import {createOrejimeConfig} from "~/tracking/orejime";
import {createGoogleTagManagerScript} from "~/tracking/google-tag-manager";

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
  head() {
    const pageData = (this as any).pageData

    const orejimeConfigHid = 'orejimeConfig'
    const googleTagManagerHid = 'googleTagManager'
    const script = []
    // const link = [
    //   { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
    //   { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
    //   { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
    //   { rel: 'manifest', href: '/favicon/site.webmanifest' },
    //   { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg' },
    //   { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
    // ]
    const meta = [
      // { name: 'msapplication-TileColor', content: pageData?.head?.mainColor || '' },
      // { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
      // { name: 'theme-color', content: pageData?.head?.mainColor || '' },
      {
        hid: 'description',
        name: 'description',
        content: pageData.metaDescription,
      },
      ...createFacebookMeta(pageData, this.$config, this.$img),
      ...createTwitterMeta(pageData, this.$config, this.$img),
    ]

    // Google analytics
    if (pageData.head?.googleAnalytics || pageData.head?.googleTagManager) {
      const id = pageData.head.googleTagManager || pageData.head?.googleAnalytics

      // gtag
      script.push(
          {
            once: true,
            hid: 'googletagmanager.com/gtag',
            async: true,
            defer: false,
            body: true,
            type: 'opt-in',
            src: '',
            'data-type': 'application/javascript',
            'data-name': 'google',
            'data-src': `https://www.googletagmanager.com/gtag/js?id=${id}`,
          },
          {
            once: true,
            hid: googleTagManagerHid,
            type: 'opt-in',
            'data-type': 'application/javascript',
            'data-name': 'google',
            innerHTML: createGoogleTagManagerScript(id),
          }
      )

      // orejime
      script.push(
          {
            once: true,
            hid: orejimeConfigHid,
            innerHTML: createOrejimeConfig(this.$i18n.locale, pageData.head.policyUrl || ''),
          },
          {
            once: true,
            hid: 'unpkg.com/orejime',
            async: true,
            body: true,
            defer: true,
            src: 'https://unpkg.com/orejime@1.2.4/dist/orejime.js',
          }
      )
    }

    return {
      // htmlAttrs: {
      //   lang: this.$i18n.locale,
      // },
      title: getNodesSourcesTitle(pageData),
      // link,
      script,
      meta,
      __dangerouslyDisableSanitizersByTagID: {
        [orejimeConfigHid]: ['script', 'innerHTML'],
        [googleTagManagerHid]: ['script', 'innerHTML'],
      },
    }
  },
  created() {
    // set the locale for first render on the client side (without asyncData)
    if (this.pageData && this.pageData.translation) this.$i18n.locale = this.pageData.translation.locale
  },
})
</script>
