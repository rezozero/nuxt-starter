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
            <VPicture v-bind="imageProps" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Format / avif + webp">
            <VPicture
                v-bind="imageProps"
                format="avif,webp"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Format / avif">
            <VPicture
                v-bind="imageProps"
                format="avif"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / crop">
            <VPicture
                v-bind="imageProps"
                :modifiers="{ crop: '200x400' }"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Modifiers / blur">
            <VPicture
                v-bind="imageProps"
                :modifiers="{ blur: 40 }"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / default">
            <VPicture
                v-bind="imageProps"
                placeholder
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Placeholder / color">
            <VPicture
                v-bind="imageProps"
                placeholder="#ccc"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Not found">
            <VPicture
                v-bind="imageProps"
                src="wrong-url.jpg"
                placeholder
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
