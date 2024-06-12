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
        <VPicture
            v-bind="imageProps"
            preload
        >
            <VPictureSource
                :modifiers="{ crop: '400x600' }"
                media="(max-width: 1024px)"
            />
        </VPicture>
    </NuxtStory>
</template>
