<template>
    <section>
        <h1>{{ $t(error.statusCode === 404 ? 'page_not_found' : 'page_error') }}</h1>
        <a :href="linkHref">{{ $t('back_home') }}</a>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropType } from 'vue/types/options'
import { NuxtError } from '@nuxt/types'
import type { LocaleObject } from 'nuxt-i18n'

export default Vue.extend({
    layout: 'error',
    props: {
        error: Object as PropType<NuxtError>,
    },
    computed: {
        linkHref(): string {
            return this.$store.state.headData?.homePageUrl || '/'
        },
    },
    async created() {
        // The page couldn't load, therefore try to get the locale from URL
        // It assumes the i18n strategy is `prefix`.
        const locale = this.$route.path.split('/')[1]
        const availableLocales = (this.$i18n.locales || []) as (string | LocaleObject)[]

        if (
            availableLocales.find(
                (i18nLocale: string | LocaleObject) =>
                    i18nLocale === locale || (typeof i18nLocale !== 'string' && i18nLocale.code === locale)
            )
        ) {
            await this.$i18n.setLocale(locale)
        }
    },
})
</script>
