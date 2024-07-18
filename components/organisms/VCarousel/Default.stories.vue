<script setup lang="ts">
const slideIndex = ref(0)
const numSlides = 10
const snapGridLength = ref(numSlides)
</script>

<template>
    <NuxtStory layout="fullscreen" class="grid" :class="$style.root">
        <VCarousel
            v-slot="{ slideClass }"
            v-model="slideIndex"
            :class="$style.carousel"
            @snap-grid-length-change="snapGridLength = $event"
        >
            <div v-for="i in numSlides" :key="i" :class="[...slideClass, $style.slide]">Slide {{ i }}</div>
        </VCarousel>
        <VCarouselControls v-model:index="slideIndex" :length="snapGridLength" :class="$style.controls" />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    overflow: hidden;
}

.carousel,
.controls {
    grid-column: 1 / -1;
}

.carousel {
    border: 1px solid red;
}

.slide {
    --v-carousel-slide-width: #{rem(400)};
    --v-carousel-slide-margin-right: #{rem(20)};

    height: rem(200);
    border: 1px solid green;
    background-color: lightgray;
}
</style>
