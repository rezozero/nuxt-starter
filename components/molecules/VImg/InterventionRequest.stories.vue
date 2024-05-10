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
        <NuxtStoryVariant title="Default">
            <VImg v-bind="imageProps" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / crop">
            <VImg v-bind="imageProps" :modifiers="{ crop: '200x400' }" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / blur">
            <VImg v-bind="imageProps" :modifiers="{ blur: 10 }" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / color">
            <VImg v-bind="imageProps" placeholder="#ccc" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
