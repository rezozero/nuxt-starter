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
        <NuxtStoryVariant title="Root sizes + Source sizes">
            <VPicture
                v-bind="imageProps"
                sizes="md:100vw lg:100vw"
            >
                <VPictureSource sizes="xs:50vw hd:50vw" />
            </VPicture>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style module lang="scss">
.image-wrapper {
    max-width: px-to-rem(600);
}
</style>
