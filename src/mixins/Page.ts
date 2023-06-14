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
import { createMatomoTagManagerScript } from '~/tracking/matomo-tag-manager'
import { EventsApi } from '~/types/event'

export default Vue.extend({
    // don't know if we should keep this navigation guard when we move from the main page (_.vue) to any other page
    // beforeRouteEnter(_to: Route, _from: Route, next: Function) {
    //     next((vm: Vue) => {
    //         vm.$store.dispatch('updateNextPageData')
    //     })
    // },
    // by default there is no transition
    transition: {
        mode: '', // the new page has to be directly there, do not wait from old page
        css: false,
        enter(_element: HTMLElement, done: Function) {
            // update global data
            window.$nuxt.$store.dispatch('updateNextPageData')
            done()
        },
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
        const link = []
        const meta = [
            {
                hid: 'description',
                name: 'description',
                content: this.getMetaDescription(),
            } as PageMetaPropertyName,
            ...createFacebookMeta(this.getFacebookMetaOptions()),
            ...createTwitterMeta(this.getTwitterMetaOptions()),
            { hid: 'version', name: 'version', content: this.$config.version || '' },
        ]
        const script = [] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]
        const __dangerouslyDisableSanitizersByTagID: Record<string, string[]> = {}

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
            const hid = 'matomoTagManager'

            script.push({
                once: true,
                hid,
                type: 'application/javascript',
                innerHTML: createGoogleTagManagerScript(this.pageData.head.googleTagManager),
            })

            __dangerouslyDisableSanitizersByTagID[hid] = ['script', 'innerHTML']
        }

        /*
         * Matomo Tag Manager must not be loaded by tarteaucitron, it must configure tarteaucitron itself.
         * Notice: by using MTM you must comply with GDPR and cookie consent or just use
         * tarteaucitron with GA4, Matomo or Plausible
         */
        const matomoTagManagerUrl = this.$config?.matomo?.url
        const matomoTagManagerId = this.$config?.matomo?.containerId
        if (matomoTagManagerId && matomoTagManagerUrl) {
            const hid = 'googleTagManager'

            script.push({
                once: true,
                hid,
                type: 'application/javascript',
                innerHTML: createMatomoTagManagerScript(matomoTagManagerId, matomoTagManagerUrl),
            })

            __dangerouslyDisableSanitizersByTagID[hid] = ['script', 'innerHTML']
        }

        // structured data
        if (
            this.pageData.item &&
            isEventEntity(this.pageData.item) &&
            (this.pageData.item as EventsApi.Event).datesCount // don't add structured data for festival (no event dates)
        ) {
            const structuredData = getStructuredData(this.pageData.item, this.$nuxt)

            if (structuredData) {
                const hid = 'structured-data'

                script.push({
                    hid,
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(structuredData),
                })

                __dangerouslyDisableSanitizersByTagID[hid] = ['script', 'innerHTML']
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
            __dangerouslyDisableSanitizersByTagID,
        }
    },
    methods: {
        getDefaultMetaTitle(): string {
            return (this.title ? this.title + ' – ' : '') + this.$store.state?.commonContent?.head?.siteName
        },
        getMetaImage(): string | undefined {
            const image =
                this.pageData.head?.shareImage?.relativePath ||
                this.$store.state?.commonContent?.head?.shareImage?.relativePath

            if (image) {
                return this.$img(image, {
                    width: 1200,
                    quality: 70,
                })
            } else {
                return joinURL(this.$config.baseURL, '/images/share.jpg')
            }
        },
        getMetaDescription(): string | undefined {
            return this.pageData?.head?.metaDescription || this.$store.state?.commonContent?.head?.metaDescription
        },
        getSocialMetaOptions(): Extract<TwitterMetaOptions, FacebookMetaOptions> {
            return {
                title: this.pageData?.head?.metaTitle || this.getDefaultMetaTitle(),
                description: this.getMetaDescription(),
                url: joinURL(this.$config.baseURL, this.pageData?.item?.url || ''),
                image: this.getMetaImage(),
            }
        },
        getTwitterMetaOptions(): TwitterMetaOptions {
            return this.getSocialMetaOptions()
        },
        getFacebookMetaOptions(): FacebookMetaOptions {
            return {
                ...this.getSocialMetaOptions(),
                siteName: this.pageData.head?.siteName || '',
            }
        },
    },
})
