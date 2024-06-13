<script setup lang="ts">
import document from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Background">
            <VRoadizVideo :document="document" :class="$style.video" background />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Background">
            <VRoadizVideo :document="document" width="500" height="1200" :class="$style.video" background />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.video {
    max-width: rem(600);
}
</style>
