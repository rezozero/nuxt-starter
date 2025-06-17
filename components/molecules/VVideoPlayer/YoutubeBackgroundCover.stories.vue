<script setup lang="ts">
import video from '~/assets/stories/fixtures/documents/youtube-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <VVideoPlayer
            :embed-id="video.embedId"
            :embed-platform="(video.embedPlatform as 'youtube')"
            fit="cover"
            background
            :class="$style.video"
        />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    position: relative;
    width: 100%;
    height: 100%;
}

.video {
    position: absolute;
    inset: 0;
}
</style>
