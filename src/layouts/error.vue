<template>
    <section>
        <h1>{{ title }}</h1>
        <a :href="linkHref">{{ $t('back_home') }}</a>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropType } from 'vue/types/options'
import { NuxtError } from '@nuxt/types'

export default Vue.extend({
    layout: 'error',
    props: {
        error: Object as PropType<NuxtError>,
    },
    computed: {
        title(): string {
            return this.$t(this.error.statusCode === 404 ? 'page_not_found' : 'page_error')
        },
        linkHref(): string {
            return this.$store.state.headData?.homePageUrl || '/'
        },
    },
})
</script>
