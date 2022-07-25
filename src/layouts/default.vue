<template>
    <div>
        <Nuxt />
    </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import MutationType from '../constants/mutation-type'
import { trackPageView } from '~/tracking/tracker'
import Resize from '~/mixins/Resize'

export default mixins(Resize).extend({
    watch: {
        $route() {
            // TODO: we have to track page view in another place if we want to have the page title
            trackPageView(undefined, this.$route.fullPath)
        },
    },
    mounted() {
        this.$store.commit(
            MutationType.PREFERS_REDUCED_MOTION,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
    },
})
</script>
