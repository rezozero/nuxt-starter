<script setup lang="ts">
const imageProps = {
    src: 'http://localhost:8080/images/01.jpg',
    width: 900,
    height: 600,
    alt: 'Image alt text',
    provider: 'ipx',
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VImg v-bind="imageProps" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / crop">
            <VImg v-bind="imageProps" width="200" height="400" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / blur">
            <VImg v-bind="imageProps" :modifiers="{ blur: 10 }" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / default">
            <VImg v-bind="imageProps" placeholder />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / color">
            <VImg v-bind="imageProps" placeholder="#ccc" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Not found">
            <VImg v-bind="imageProps" src="wrong-url.jpg" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
