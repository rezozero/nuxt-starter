<script setup lang="ts">
import VStoryAsyncSlide from './VStoryAsyncSlide.vue'

const slideIndex = ref(0)
const numSlides = 10
const snapGridLength = ref(numSlides)
</script>

<template>
    <NuxtStory>
        <div
            style="width: 500px; max-width: 100vw; border: 1px solid #ccc; overflow: hidden"
        >
            <VCarousel
                v-slot="{ slideClass }"
                v-model="slideIndex"
                @snap-grid-length-change="snapGridLength = $event"
            >
                <VStoryAsyncSlide
                    v-for="i in numSlides"
                    :key="i"
                    :class="[...slideClass]"
                    :index="i"
                />
            </VCarousel>
            <VCarouselControls
                v-model:index="slideIndex"
                :length="snapGridLength"
            />
        </div>
    </NuxtStory>
</template>
