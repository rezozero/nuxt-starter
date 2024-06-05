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
        <NuxtStoryVariant title="Root sizes">
            <VPicture v-bind="imageProps" sizes="xs:100vw xl:50vw hd:100vw">
                <VPictureSource :modifiers="{ crop: '400x600' }" media="(max-width: 1024px)" />
            </VPicture>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Source sizes">
            <VPicture v-bind="imageProps">
                <VPictureSource :modifiers="{ crop: '400x600' }" media="(max-width: 1024px)" sizes="xs:50vw hd:50vw" />
            </VPicture>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Root sizes + Source sizes">
            <VPicture v-bind="imageProps" sizes="md:100vw lg:100vw">
                <VPictureSource :modifiers="{ crop: '400x600' }" media="(max-width: 1024px)" sizes="xs:50vw hd:50vw" />
            </VPicture>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style module lang="scss">
.image-wrapper {
    max-width: rem(600);
}
</style>
