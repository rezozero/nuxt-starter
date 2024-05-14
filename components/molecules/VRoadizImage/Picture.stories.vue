<script setup lang="ts">
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Picture tag">
            <VRoadizImage :document="image" tag="picture" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Source tags">
            <VRoadizImage :document="image">
                <VPictureSource
                    sizes="xs:50vw"
                    media="(max-width: 1280px)"
                    :modifiers="{ crop: '400x600', align: 't' }"
                />
                <VPictureSource sizes="xl:100vw hd:100vw" :modifiers="{ crop: '500x500', align: 't' }" />
            </VRoadizImage>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module="">
.root {
    --v-img-max-width: #{rem(600)};
}
</style>
