<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import image from '~stories/assets/fixtures/documents/image-01.json'

// Hotspot area starting at the left / top edges (0): the image is cropped to the area ratio.
const imageWithHotspotArea = {
    ...image,
    hotspot: { x: 0.25, y: 0.5, areaStartX: 0, areaStartY: 0, areaEndX: 0.5, areaEndY: 1 },
} as unknown as RoadizDocument
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
        <NuxtStoryVariant title="Hotspot area">
            <VRoadizImage :document="imageWithHotspotArea" />
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
