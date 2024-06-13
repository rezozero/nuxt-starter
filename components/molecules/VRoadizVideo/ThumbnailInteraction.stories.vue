<script setup lang="ts">
import document from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VRoadizVideo :document="document" :class="$style.video" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Thumb slot">
            <VRoadizVideo :document="{ ...document, thumbnail: undefined }" :class="$style.video">
                <VRoadizImage :document="document.thumbnail" />
            </VRoadizVideo>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Thumb slot with custom props">
            <VRoadizVideo :document="document" :class="$style.video">
                <VRoadizImage :document="document.thumbnail" width="600" height="600" sizes="600px" />
            </VRoadizVideo>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.video {
    width: rem(600);
}
</style>
