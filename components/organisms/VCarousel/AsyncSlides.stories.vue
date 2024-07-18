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
            <VCarouselNuxtStoryAsyncSlide v-for="i in numSlides" :key="i" :class="[...slideClass]" :index="i" />
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
</style>
