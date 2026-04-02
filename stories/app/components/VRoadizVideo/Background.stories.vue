<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import document from '~/assets/stories/fixtures/documents/vimeo-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Background">
            <VRoadizVideo
                :document="(document as unknown as RoadizDocument)"
                :class="$style.video"
                background
            />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Background">
            <VRoadizVideo
                :document="(document as unknown as RoadizDocument)"
                width="500"
                height="1200"
                :class="$style.video"
                background
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.video {
    max-width: px-to-rem(600);
}
</style>
