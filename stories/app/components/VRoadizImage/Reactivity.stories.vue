<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import image from '~stories/assets/fixtures/documents/image-01.json'
import imagePortrait from '~stories/assets/fixtures/documents/image-portrait.json'

const documents = [image, imagePortrait] as unknown as RoadizDocument[]
const index = ref(0)
const document = computed(() => documents[index.value])

function toggle() {
    index.value = (index.value + 1) % documents.length
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <template #aside>
            <button @click="toggle">
                Switch document ({{ document?.relativePath }})
            </button>
        </template>
        <NuxtStoryVariant title="Img">
            <VRoadizImage :document="document" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Picture">
            <VRoadizImage
                :document="document"
                tag="picture"
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
