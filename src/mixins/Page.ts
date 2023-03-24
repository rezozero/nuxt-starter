import type { Route } from 'vue-router'
import type { MetaInfo } from 'vue-meta'
import Vue from 'vue'
import { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { joinURL } from 'ufo'
import {
    ScriptPropertyJson,
    ScriptPropertySrc,
    ScriptPropertySrcCallback,
    ScriptPropertyText,
} from 'vue-meta/types/vue-meta'
import { createFacebookMeta } from '~/utils/meta/facebook'
import { createTwitterMeta } from '~/utils/meta/twitter'
import { createGoogleTagManagerScript } from '~/tracking/google-tag-manager'
import { FacebookMetaOptions, PageMetaPropertyName, TwitterMetaOptions } from '~/types/meta'
import { createTarteaucitronConfig, TarteaucitronConfigOptions } from '~/tracking/tarteaucitron'
import { getStructuredData } from '~/utils/seo/get-structured-data'
import { isEventEntity } from '~/utils/roadiz/entity'

export default Vue.extend({
    beforeRouteEnter(_to: Route, _from: Route, next: Function) {
        next((vm: Vue) => {
            vm.$store.dispatch('updateNextPageData')
        })
    },
    beforeRouteUpdate(_to: Route, _from: Route, next: Function) {
        this.$store.dispatch('updateNextPageData')

        next()
    },
    data() {
        return {
            title: '', // Fallback title for static pages meta-title
            pageData: {} as RoadizWebResponse,
            alternateLinks: [] as RoadizAlternateLink[],
        }
    },
    head(): MetaInfo {
        const tarteaucitronConfigHid = 'tarteaucitronConfig'
        const googleTagManagerHid = 'googleTagManager'
        const link = []
        const meta = [
            {
                hid: 'description',
                name: 'description',
                content: this.pageData.head?.metaDescription || this.$store.state?.headData?.metaDescription,
            } as PageMetaPropertyName,
            ...createFacebookMeta(this.getFacebookMetaOptions()),
            ...createTwitterMeta(this.getTwitterMetaOptions()),
            { hid: 'version', name: 'version', content: this.$config.version || '' },
        ]
        const script = [] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]

        // alternate links
        const alternateLinks =
            this.$config.baseURL &&
            this.$store.getters.currentPageAlternateLinks?.map((alternateLink: RoadizAlternateLink) => {
                return {
                    hid: `alternate-${alternateLink.locale}`,
                    rel: 'alternate',
                    hreflang: alternateLink.locale,
                    href: joinURL(this.$config.baseURL, alternateLink.url),
                }
            })
        if (alternateLinks) link.push(...alternateLinks)

        // the page could be potentially  not indexed by robots
        if (this.pageData.head?.noIndex) {
            meta.push({ hid: 'robots', name: 'robots', content: 'noindex' })
        }

        if (this.pageData.head?.googleAnalytics || this.pageData.head?.matomoSiteId) {
            const policyUrl = this.pageData.head.policyUrl || this.$store.state.homePagePath

            script.push(
                {
                    hid: 'tarteaucitron',
                    src: 'https://cdnjs.cloudflare.com/ajax/libs/tarteaucitronjs/1.9.6/tarteaucitron.js',
                    once: true,
                },
                {
                    hid: tarteaucitronConfigHid,
                    innerHTML: createTarteaucitronConfig({
                        policyUrl,
                        googleAnalytics: this.pageData.head.googleAnalytics,
                        matomoSiteId: this.pageData.head.matomoSiteId,
                        matomoUrl: this.pageData.head.matomoUrl || 'matomo.org',
                    } as TarteaucitronConfigOptions),
                    once: true,
                }
            )
        }

        /*
         * Google Tag Manager must not be loaded by tarteaucitron, it must configure tarteaucitron itself.
         * Notice: by using GTM you must comply with GDPR and cookie consent or just use
         * tarteaucitron with GA4, Matomo or Plausible
         */
        if (this.pageData.head?.googleTagManager) {
            script.push({
                once: true,
                hid: googleTagManagerHid,
                type: 'application/javascript',
                innerHTML: createGoogleTagManagerScript(this.pageData.head.googleTagManager),
            })
        }

        // structured data
        if (isEventEntity(this.pageData.item)) {
            const structuredData = getStructuredData(this.pageData.item, this.$nuxt)

            if (structuredData) {
                script.push({
                    hid: 'structured-data',
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(structuredData),
                })
            }
        }

        return {
            htmlAttrs: {
                lang: this.$i18n.locale,
            },
            title: this.pageData?.head?.metaTitle || this.getDefaultMetaTitle(),
            script,
            link,
            meta,
            __dangerouslyDisableSanitizersByTagID: {
                [googleTagManagerHid]: ['script', 'innerHTML'],
            },
        }
    },
    methods: {
        getDefaultMetaTitle(): string {
            return (this.title ? this.title + ' – ' : '') + this.$store.state?.headData?.siteName
        },
        getMetaImage(): string | undefined {
            const image =
                this.pageData.head?.shareImage?.relativePath || this.$store.state?.headData?.shareImage?.relativePath

            if (image) {
                return this.$img(image, {
                    width: 1200,
                    quality: 70,
                })
            } else {
                return joinURL(this.$config.baseURL, '/images/share.jpg')
            }
        },
        getTwitterMetaOptions(): TwitterMetaOptions {
            return {
                title: this.pageData?.head?.metaTitle || this.getDefaultMetaTitle(),
                description: this.pageData?.head?.metaDescription || this.$store.state?.headData?.metaDescription,
                url: joinURL(this.$config.baseURL, this.pageData?.item?.url || ''),
                image: this.getMetaImage(),
            }
        },
        getFacebookMetaOptions(): FacebookMetaOptions {
            return {
                title: this.pageData?.head?.metaTitle || this.getDefaultMetaTitle(),
                description: this.pageData.head?.metaDescription || this.$store.state?.headData?.metaDescription,
                url: joinURL(this.$config.baseURL, this.pageData?.item?.url || ''),
                siteName: this.pageData.head?.siteName || '',
                image: this.getMetaImage(),
            }
        },
    },
})
