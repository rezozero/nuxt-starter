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
        <NuxtStoryVariant title="Picture tag">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                tag="picture"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Loading / eager">
            <VRoadizImage
                :document="(image as unknown as RoadizDocument)"
                tag="picture"
                loading="eager"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Source tags">
            <VRoadizImage :document="(image as unknown as RoadizDocument)">
                <VPictureSource
                    sizes="md:100vw"
                    media="(max-width: 1280px)"
                    :modifiers="{ crop: '400x600', align: 't' }"
                />
                <VPictureSource
                    sizes="xl:100vw hd:100vw"
                    :modifiers="{ crop: '500x500', align: 't' }"
                />
            </VRoadizImage>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Hotspot area">
            <VRoadizImage
                :document="imageWithHotspotArea"
                tag="picture"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Hotspot area + source crop">
            <VRoadizImage :document="imageWithHotspotArea">
                <VPictureSource
                    media="(max-width: 1280px)"
                    :modifiers="{ crop: '1x1' }"
                />
                <VPictureSource />
            </VRoadizImage>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    --v-img-max-width: #{px-to-rem(600)};
}
</style>
