<script setup lang="ts">
const imageProps = {
    src: '01.jpg',
    width: 900,
    height: 600,
    alt: 'Image alt text',
    provider: 'interventionRequest',
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Single source">
            <VPicture v-bind="imageProps">
                <VPictureSource :modifiers="{ crop: '400x600' }" media="(max-width: 1024px)" />
            </VPicture>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Picture (root) modifier + source modifier">
            <VPicture v-bind="imageProps" :modifiers="{ greyscale: true }">
                <VPictureSource :modifiers="{ crop: '400x600' }" media="(max-width: 1024px)" />
            </VPicture>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style module lang="scss">
.image-wrapper {
    max-width: rem(600);
}
</style>
