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
        <NuxtStoryVariant title="Format / webp">
            <VImg
                v-bind="imageProps"
                format="webp"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Format / avif">
            <VImg
                v-bind="imageProps"
                format="avif"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Densities">
            <VImg
                v-bind="imageProps"
                densities="x1 x2"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Sizes">
            <VImg
                v-bind="imageProps"
                sizes="xs:100vw md:100vw"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / crop">
            <VImg
                v-bind="imageProps"
                width="200"
                height="400"
                :modifiers="{ crop: '200x400' }"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / blur">
            <VImg
                v-bind="imageProps"
                :modifiers="{ blur: 10 }"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / default">
            <VImg
                v-bind="imageProps"
                placeholder
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / color">
            <VImg
                v-bind="imageProps"
                placeholder="#ccc"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Not found">
            <VImg
                v-bind="imageProps"
                src="wrong-url.jpg"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
