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
})
</script>
