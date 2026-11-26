<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/video-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <div :class="$style.wrapper">
            <VVideoPlayer
                :sources="[{ src: video.relativePath, type: video.mimeType }]"
                fit="cover"
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
    --v-video-player-height: 100%;
    --v-video-player-object-fit: cover;

    position: absolute;
    height: 100svh;
    inset: 0;
}
</style>
