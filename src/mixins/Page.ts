import Vue from 'vue'
import { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/abstract-api-client/dist/types/roadiz'
import type { Route } from 'vue-router'
import { joinURL } from 'ufo'
import {
    ScriptPropertyJson,
    ScriptPropertySrc,
    ScriptPropertySrcCallback,
    ScriptPropertyText,
} from 'vue-meta/types/vue-meta'
import type { MetaInfo } from 'vue-meta'
import { createFacebookMeta } from '~/utils/meta/facebook'
import { createTwitterMeta } from '~/utils/meta/twitter'
import { createGoogleTagManagerScript } from '~/tracking/google-tag-manager'
import { FacebookMetaOptions, PageMetaPropertyName, TwitterMetaOptions } from '~/types/meta'
import { createTarteaucitronConfig, TarteaucitronConfigOptions } from '~/tracking/tarteaucitron'

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
            pageData: {} as RoadizWebResponse,
            alternateLinks: [] as RoadizAlternateLink[],
        }
    },
    head(): MetaInfo {
        const tarteaucitronConfigHid = 'tarteaucitronConfig'
        const googleTagManagerHid = 'googleTagManager'
        const link =
            this.$config.baseURL &&
            this.$store.getters.alternateLinks?.map((alternateLink: RoadizAlternateLink) => {
                return {
                    hid: `alternate-${alternateLink.locale}`,
                    rel: 'alternate',
                    hreflang: alternateLink.locale,
                    href: this.$config.baseURL + alternateLink.url,
                }
            })
        const meta = [
            {
                hid: 'description',
                name: 'description',
                content: this.pageData.head.metaDescription,
            } as PageMetaPropertyName,
            ...createFacebookMeta(this.getFacebookMetaOptions()),
            ...createTwitterMeta(this.getTwitterMetaOptions()),
        ]
        const script = [] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]

        if (this.pageData.head?.googleAnalytics || this.pageData.head?.matomoSiteId) {
            const policyUrl = this.pageData.head.policyUrl || this.$store.state.homePagePath

            script.push({
                hid: 'tarteaucitron',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/tarteaucitronjs/1.9.6/tarteaucitron.js',
                once: true,
            })
            script.push({
                hid: tarteaucitronConfigHid,
                innerHTML: createTarteaucitronConfig({
                    policyUrl,
                    googleAnalytics: this.pageData.head?.googleAnalytics,
                    matomoSiteId: this.pageData.head?.matomoSiteId,
                    matomoUrl: this.pageData.head?.matomoUrl || 'matomo.org',
                } as TarteaucitronConfigOptions),
                once: true,
            })
        }
        /*
         * Google Tag Manager must not be loaded by tarteaucitron, it must configure tarteaucitron itself.
         * Notice: by using GTM you must comply with GDPR and cookie consent or just use
         * tarteaucitron with GA4, Matomo or Plausible
         */
        if (this.pageData.head?.googleTagManager) {
            const id = this.pageData.head?.googleTagManager
            // gtm
            script.push({
                once: true,
                hid: googleTagManagerHid,
                type: 'application/javascript',
                innerHTML: createGoogleTagManagerScript(id),
            })
        }

        return {
            htmlAttrs: {
                lang: this.$i18n.locale,
            },
            title: this.pageData.head.metaTitle,
            link,
            script,
            meta,
            __dangerouslyDisableSanitizersByTagID: {
                [tarteaucitronConfigHid]: ['script', 'innerHTML'],
                [googleTagManagerHid]: ['script', 'innerHTML'],
            },
        }
    },
    methods: {
        getMetaImage(): string | undefined {
            const image = this.pageData.head?.shareImage?.relativePath

            if (image) {
                return this.$img(image, {
                    width: 1200,
                    quality: 70,
                })
            }
        },
        getTwitterMetaOptions(): TwitterMetaOptions {
            return {
                title: this.pageData.head.metaTitle,
                description: this.pageData.head.metaDescription,
                url: joinURL(this.$config.baseURL, this.pageData.item.url || ''),
                image: this.getMetaImage(),
            }
        },
        getFacebookMetaOptions(): FacebookMetaOptions {
            return {
                title: this.pageData.head.metaTitle,
                description: this.pageData.head.metaDescription,
                url: joinURL(this.$config.baseURL, this.pageData.item.url || ''),
                siteName: this.pageData.head?.siteName,
                image: this.getMetaImage(),
            }
        },
    },
})
