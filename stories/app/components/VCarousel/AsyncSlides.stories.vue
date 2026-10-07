<script setup lang="ts">
import VStoryAsyncSlide from './VStoryAsyncSlide.vue'

const slideIndex = ref(0)
const numSlides = 10
const snapGridLength = ref(numSlides)
</script>

<template>
    <NuxtStory>
        <div :class="$style.root">
            <VCarousel
                v-slot="{ slideClass }"
                v-model:index="slideIndex"
            >
                <VStoryAsyncSlide
                    v-for="i in numSlides"
                    :key="i"
                    :class="[...slideClass]"
                    :index="i"
                />
            </VCarousel>
            <VCarouselControls
                v-model="slideIndex"
                :snap-length="snapGridLength"
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    overflow: hidden;
    width: 500px;
    max-width: 100vw;
    border: 1px solid #ccc;
}
</style>
