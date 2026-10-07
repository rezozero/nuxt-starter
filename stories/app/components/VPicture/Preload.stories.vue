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
        />
    </NuxtStory>
</template>
