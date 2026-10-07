<script setup lang="ts">
const slideIndex = ref(0)
const numSlides = 10
const snapGridLength = ref(numSlides)
</script>

<template>
    <NuxtStory>
        <div
            :class="$style.root"
        >
            <VCarousel
                v-slot="{ slideClass }"
                v-model:index="slideIndex"
                v-model:snap-length="snapGridLength"
            >
                <li
                    v-for="i in numSlides"
                    :key="i"
                    :class="[...slideClass, $style.slide]"
                >
                    Slide {{ i }}
                </li>
            </VCarousel>
            <VCarouselControls
                v-model="slideIndex"
                :snap-length="snapGridLength"
                display-numbers
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    overflow: hidden;
    width: 100%;
    border: 1px solid #ccc;
}

.slide {
    --v-carousel-slide-width: 400px;
    --v-carousel-slide-margin-right: 20px;
    --v-carousel-slide-height: 200px;

    background-color: lightgray;
}
</style>
