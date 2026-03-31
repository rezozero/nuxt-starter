<script setup lang="ts">
import video from '~/assets/stories/fixtures/documents/video-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            title="Contain"
            :class="[$style.wrapper, $style['wrapper--contain']]"
        >
            <VVideoPlayer
                :src="video.relativePath"
                background
                :class="$style.video"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant
            title="Cover"
            :class="[$style.wrapper, $style['wrapper--cover']]"
        >
            <VVideoPlayer
                :src="video.relativePath"
                background
                :class="$style.video"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.wrapper {
    --v-player-video-position: absolute;
    --v-player-video-width: 100%;
    --v-player-video-height: 100%;
    --v-player-height: 200px;

    width: 100%;

    &--contain {
        --v-player-video-object-fit: contain;
    }

    &--cover {
        --v-player-video-object-fit: cover;
    }
}
</style>
