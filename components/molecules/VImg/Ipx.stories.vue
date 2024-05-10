<script setup lang="ts">
const imgProps = {
    alt: 'Image description',
    src: '/images/share.jpg',
    width: '2400',
    height: '1600',
    provider: 'ipx',
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Img placeholder" :class="$style.variant">
            <VImg :placeholder="[2400, 1600, 25]" v-bind="imgProps" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Color placeholder">
            <VImg placeholder="red" v-bind="imgProps" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 60%;

    img {
        width: 100%;
    }
}
</style>
