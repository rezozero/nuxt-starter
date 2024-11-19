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
        <NuxtStoryVariant title="Root sizes">
            <VPicture
                v-bind="imageProps"
                sizes="xs:100vw xl:50vw hd:50vw"
                format="webp"
            >
                <VPictureSource />
            </VPicture>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style module lang="scss">
@use "assets/scss/functions/rem" as *;

.image-wrapper {
    max-width: rem(600);
}
</style>
