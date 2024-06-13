<script setup lang="ts">
import video from '~/assets/stories/fixtures/documents/vimeo-01.json'

const defaultProps = {
    embedId: video.embedId,
    embedPlatform: video.embedPlatform,
    width: video.imageWidth,
    height: video.imageHeight,
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VVideoPlayer v-bind="defaultProps" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Autoplay">
            <VVideoPlayer
                v-bind="defaultProps"
                autoplay
                :controls="false"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
