<script setup lang="ts">
import video from '~/assets/stories/fixtures/documents/video-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <div :class="$style.wrapper">
            <VVideoPlayer
                :src="video.relativePath"
                fit="cover"
                background
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module="">
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
