<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/video-01.json'
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
    &--contain {
        --v-video-player-object-fit: contain;
    }

    &--cover {
        --v-video-player-object-fit: cover;
    }
}

.video {
    height: 200px;
}
</style>
