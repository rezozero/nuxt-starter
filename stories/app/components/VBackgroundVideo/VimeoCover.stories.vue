<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <VBackgroundVideo
            :embed-id="video.embedId"
            :embed-platform="video.embedPlatform"
            :width="video.imageWidth"
            :height="video.imageHeight"
            fit="cover"
        />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100svh;
}
</style>
