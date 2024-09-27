<script setup lang="ts">
import document from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory>
        <div :class="$style.wrapper">
            <VRoadizVideo
                :document="document"
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
