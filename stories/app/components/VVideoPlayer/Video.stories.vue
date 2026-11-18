<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/video-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VVideoPlayer
                :src="video.relativePath"
                :width="video.imageWidth"
                :height="video.imageHeight"
                :class="$style.player"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With sources">
            <VVideoPlayer
                :src="video.relativePath"
                :width="video.imageWidth"
                :height="video.imageHeight"
                :alt-sources="video.altSources"
                :class="$style.player"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.player {
    max-width: 500px;
}
</style>
