<script setup lang="ts">
import video from '~/assets/stories/fixtures/documents/video-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VVideoPlayer
                :src="video.relativePath"
                :width="video.imageWidth"
                :height="video.imageHeight"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With sources">
            <VVideoPlayer
                :src="video.relativePath"
                :width="video.imageWidth"
                :height="video.imageHeight"
                :alt-sources="video.altSources"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
