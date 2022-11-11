<template>
    <div v-if="jwt" :class="$style.root">
        <div :class="$style.user">{{ $t('preview.previewing_as_username', { username: jwt.username }) }}</div>
        <div>{{ $t('preview.expired_at_expiry', { expiry: $d(remainingTime, 'time') }) }}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RoadizPreviewJwt } from '@roadiz/nuxt-module/dist/plugin'

export default Vue.extend({
    name: 'VPreview',
    computed: {
        jwt(): RoadizPreviewJwt | null {
            return this.$roadiz.getPreviewingJwt()
        },
        remainingTime(): Date {
            return new Date((this.jwt?.exp || 0) * 1000)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    left: 1em;
    display: block;
    padding: 1em 1.5em 0.75em;
    border: 1px solid #e59500;
    background: #ffa600;
    border-radius: 3px 3px 0 0;
    font-size: 10px;
    line-height: 16px;
    opacity: 0.25;
}

.user {
    font-weight: bold;
}
</style>
