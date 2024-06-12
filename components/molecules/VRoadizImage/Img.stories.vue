<script setup lang="ts">
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Default">
            <VRoadizImage :document="image" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Sizes">
            <VRoadizImage
                :document="image"
                sizes="md:100vw lg:100vw"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Crop">
            <VRoadizImage
                :document="image"
                crop="200x400"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Loading / eager">
            <VRoadizImage
                :document="image"
                loading="eager"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Blur">
            <VRoadizImage
                :document="image"
                blur="50"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    img {
        max-width: rem(600);
    }
}
</style>
