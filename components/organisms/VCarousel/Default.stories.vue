<script setup lang="ts">
const slideIndex = ref(0)
const numSlides = 10
const snapGridLength = ref(numSlides)
</script>

<template>
    <NuxtStory>
        <div
            style="overflow: hidden;width: 500px; max-width: 100vw; border: 1px solid #ccc"
        >
            <VCarousel
                v-slot="{ slideClass }"
                v-model:index="slideIndex"
            >
                <div
                    v-for="i in numSlides"
                    :key="i"
                    :class="[...slideClass, $style.slide]"
                >
                    Slide {{ i }}
                </div>
            </VCarousel>
            <VCarouselControls
                v-model="slideIndex"
                :length="snapGridLength"
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.slide {
    --v-carousel-slide-width: #{rem(400)};
    --v-carousel-slide-margin-right: #{rem(20)};

    height: rem(200);
    background-color: lightgray;
}
</style>
