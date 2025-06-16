<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import document from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory>
        <div :class="$style.wrapper">
            <VRoadizVideo
                :document="(document as unknown as RoadizDocument)"
                fit="cover"
                :class="$style.video"
                background
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    position: relative;
}

.wrapper {
    --v-player-height: 100%;
    --v-player-video-object-fit: cover;

    position: absolute;
    height: 100svh;
    inset: 0;
}
</style>
