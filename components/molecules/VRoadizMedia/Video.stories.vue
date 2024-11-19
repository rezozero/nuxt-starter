<script setup lang="ts">
import mp4Video from '~/assets/stories/fixtures/documents/video-01.json'
import vimeoVideo from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Mp4">
            <VRoadizMedia
                :document="mp4Video"
                :class="$style.media"
            />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Vimeo with img props">
            <VRoadizMedia
                :document="vimeoVideo"
                :class="$style.media"
                :image="{ width: 800, height: 200, sizes: '800px', a: 'c' }"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

.media {
    width: rem(800);
    max-width: 60%;
}
</style>
