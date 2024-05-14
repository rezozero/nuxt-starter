<script setup lang="ts">
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Default">
            <VRoadizImage :document="image" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Crop modifiers">
            <VRoadizImage :document="image" crop="200x400" />
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
