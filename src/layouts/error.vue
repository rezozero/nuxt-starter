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
import { setLocaleFromPath } from '~/utils/i18n/set-locale-from-path'

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
        await setLocaleFromPath(this.$i18n, this.$route.path)
    },
})
</script>
