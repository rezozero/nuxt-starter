import Vue from 'vue'
import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { AlternateLink } from '@roadiz/abstract-api-client/dist/types/roadiz-api'
import { Route } from 'vue-router'
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
import { createOrejimeConfig } from '~/tracking/orejime'
import getNodesSourcesTitle from '~/utils/roadiz/get-nodes-sources-title'

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
            pageData: {} as RoadizNodesSources,
            alternateLinks: [] as AlternateLink[],
        }
    },
    head() {
        const pageData = (this as any).pageData

        const orejimeConfigHid = 'orejimeConfig'
        const googleTagManagerHid = 'googleTagManager'
        const meta = [
            {
                hid: 'description',
                name: 'description',
                content: pageData.metaDescription,
            },
            ...createFacebookMeta((this as any).getFacebookMetaOptions()),
            ...createTwitterMeta((this as any).getTwitterMetaOptions()),
        ]
        const script = [] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]

        // Google analytics
        if (pageData.head?.googleAnalytics || pageData.head?.googleTagManager) {
            const id = pageData.head.googleTagManager || pageData.head?.googleAnalytics
            // const policyUrl = pageData.head.policyUrl || this.$store.state.homePagePath

            // if (!pageData.head.policyUrl) {
            //     console.warn('🍪 Orejime needs a policy url')
            // }

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
                    innerHTML: createOrejimeConfig(this.$i18n.locale, this.$t('policy_url').toString()),
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
            htmlAttrs: {
                lang: this.$i18n.locale,
            },
            title: getNodesSourcesTitle(pageData),
            script,
            meta,
            __dangerouslyDisableSanitizersByTagID: {
                [orejimeConfigHid]: ['script', 'innerHTML'],
                [googleTagManagerHid]: ['script', 'innerHTML'],
            },
        }
    },
    methods: {
        getMetaImage(): string | undefined {
            const image = this.pageData.head?.shareImage?.relativePath

            if (image) {
                return (this as any).$img(image, {
                    width: 1200,
                    quality: 70,
                })
            }
        },
        getTwitterMetaOptions(): TwitterMetaOptions {
            return {
                title: getNodesSourcesTitle(this.pageData),
                description: this.pageData.metaDescription,
                url: joinURL(this.$config.baseUrl, this.pageData.url || ''),
                image: this.getMetaImage(),
            }
        },
        getFacebookMetaOptions(): FacebookMetaOptions {
            return {
                title: getNodesSourcesTitle(this.pageData),
                description: this.pageData.metaDescription,
                url: joinURL(this.$config.baseUrl, this.pageData.url || ''),
                siteName: this.pageData.head?.siteName,
                image: this.getMetaImage(),
            }
        },
    },
})
