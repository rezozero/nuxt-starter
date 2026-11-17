<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/vimeo-01.json'

const defaultProps = {
    embedId: video.embedId,
    embedPlatform: (video.embedPlatform as 'vimeo'),
    width: video.imageWidth,
    height: video.imageHeight,
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VVideoPlayer
                v-bind="defaultProps"
                :class="$style.player"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Autoplay">
            <VVideoPlayer
                v-bind="defaultProps"
                autoplay
                muted
                :controls="false"
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
