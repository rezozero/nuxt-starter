<script setup lang="ts">
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Figure with img slot">
            <VRoadizImage
                :document="image"
                copyright="Lorem ipsum"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Crop">
            <VRoadizImage
                :document="image"
                crop="400x400"
                copyright
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module="">
.root {
    --v-img-max-width: #{rem(600)};
}
</style>
