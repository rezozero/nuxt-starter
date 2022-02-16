import Vue from 'vue'
import { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { Route } from 'vue-router'
import { joinURL } from 'ufo'
import {
    ScriptPropertyJson,
    ScriptPropertySrc,
    ScriptPropertySrcCallback,
    ScriptPropertyText,
} from 'vue-meta/types/vue-meta'
import { MetaInfo } from 'vue-meta'
import { createFacebookMeta } from '~/utils/meta/facebook'
import { createTwitterMeta } from '~/utils/meta/twitter'
import { createGoogleTagManagerScript } from '~/tracking/google-tag-manager'
import { createOrejimeConfig } from '~/tracking/orejime'
import { FacebookMetaOptions, TwitterMetaOptions } from '~/types/meta'

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
        const orejimeConfigHid = 'orejimeConfig'
        const googleTagManagerHid = 'googleTagManager'
        const meta = [
            {
                hid: 'description',
                name: 'description',
                content: this.pageData.head.metaDescription,
            },
            ...createFacebookMeta(this.getFacebookMetaOptions()),
            ...createTwitterMeta(this.getTwitterMetaOptions()),
        ]
        const script = [] as (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]

        // Google analytics
        if (this.pageData.head?.googleAnalytics || this.pageData.head?.googleTagManager) {
            const id = this.pageData.head.googleTagManager || this.pageData.head?.googleAnalytics
            // const policyUrl = this.pageData.head.policyUrl || this.$store.state.homePagePath

            // if (!this.pageData.head.policyUrl) {
            //     console.warn('🍪 Orejime needs a policy url')
            // }

            if (id) {
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
            }

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
            title: this.pageData.head.metaTitle,
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
