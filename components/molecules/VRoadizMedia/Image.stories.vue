<script setup lang="ts">
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="default: Roadiz image">
            <VRoadizMedia
                :document="image"
                :image="{ crop: '300x200' }"
                :class="$style.media"
            />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="With default slot">
            <VRoadizMedia
                :document="image"
                :class="$style.media"
            >
                <VPictureSource
                    sizes="xs:50vw"
                    media="(max-width: 1280px)"
                    :modifiers="{ crop: '600x200' }"
                />
                <VPictureSource
                    sizes="xl:100vw hd:100vw"
                    :modifiers="{ crop: '500x500' }"
                />
            </VRoadizMedia>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Copyright">
            <VRoadizMedia
                :document="image"
                :image="{ crop: '200x400', copyright: true, tag: 'picture' }"
                :class="$style.media"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.media {
    max-width: px-to-rem(600);
}
</style>
