<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import video from '~stories/assets/fixtures/documents/video-01.json'
import { getVideoSources } from '~/utils/roadiz/document'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VVideoPlayer
                :sources="[{ src: video.relativePath, type: video.mimeType }]"
                :width="video.imageWidth"
                :height="video.imageHeight"
                :class="$style.player"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With sources">
            <VVideoPlayer
                :sources="getVideoSources(video as RoadizDocument)"
                :width="video.imageWidth"
                :height="video.imageHeight"
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
