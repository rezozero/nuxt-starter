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
        <NuxtStoryVariant title="Default" :class="$style.root">
            <VSlider v-slot="{ itemClass }" :class="$style.slider">
                <VImg v-for="item in 20" :key="item" v-bind="imageProps" :class="[$style.item, itemClass]" />
            </VSlider>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    :global(.nuxt-story-variant__main) {
        display: grid;
    }
}

.slider {
    --gutter: #{rem(24)};

    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.item {
    width: flex-grid(1, 4);
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
