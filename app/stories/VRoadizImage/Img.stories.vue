<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Default">
            <VRoadizImage :document="(image as unknown as RoadizDocument)" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Sizes">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                sizes="md:100vw lg:100vw"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Crop">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                crop="200x400"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Loading / eager">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                loading="eager"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Blur">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                blur="50"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    img {
        max-width: px-to-rem(600);
    }
}
</style>
