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
        <VImg
            v-bind="imageProps"
            preload
            sizes="xs:100vw md:100vw xl:100vw"
        />
    </NuxtStory>
</template>
