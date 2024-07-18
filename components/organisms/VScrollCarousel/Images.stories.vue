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
        <VScrollCarousel v-slot="{ slideClass }" :class="$style.carousel">
            <VImg
                v-for="item in 20"
                :key="item"
                v-bind="imageProps"
                :class="[$style.slide, slideClass]"
                draggable="false"
            />
        </VScrollCarousel>
    </NuxtStory>
</template>

<style lang="scss" module>
.carousel {
    padding-block: rem(48);
    gap: rem(24);
    background-color: #d8d8d8;
}

.slide {
    width: 20%;
    height: 200px;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
