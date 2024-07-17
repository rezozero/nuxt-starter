<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { VSlider } from '#components'
import type { Slide } from '~/components/molecules/VSlider/VCarousel.vue'

const itemLength = ref(6)
const slideIndex = ref(0)

const vSliderInstance = ref<ComponentPublicInstance<typeof VSlider> | null>(null)
const slides = computed(() => vSliderInstance.value?.slides as Slide[])

function setSnapMarkers(slides: Slide[]) {
    slides.forEach((slide) => {
        const leftMarker = slide.el?.querySelector('.marker-left') as HTMLElement
        const rightMarker = slide.el?.querySelector('.marker-right') as HTMLElement

        if (leftMarker) {
            leftMarker.style.left = slide.snapLeft + 'px'
        }
        if (rightMarker) {
            rightMarker.style.left = slide.snapRight + 'px'
        }
    })
}

watch(slides, (value) => {
    if (value?.length) setSnapMarkers(value)
})
</script>

<template>
    <NuxtStory>
        <VSlider v-slot="{ itemClass }" ref="vSliderInstance" v-model="slideIndex" :class="$style.root">
            <div v-for="item in itemLength" :key="item" :class="[$style.item, itemClass]">
                <div class="marker marker-left"></div>
                {{ item }}
                <div class="marker marker-right"></div>
            </div>
        </VSlider>
    </NuxtStory>
</template>

<style>
.marker-right,
.marker-left {
    position: absolute;
    z-index: 2;
    left: 0;
    width: 2px;
    height: 100%;
    background-color: red;
}
</style>

<style lang="scss" module>
.root {
    --gutter: #{rem(24)};
    --v-slider-scroll-snap-align: center;

    position: relative;
    background-color: #d8d8d8;
    padding-block: rem(48);

    :global(.nuxt-story__main) {
        touch-action: pan-x;
    }
}

.item {
    display: flex;
    width: 60%;
    height: rem(260);
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
    margin-inline: 20%;

    &:nth-child(odd) :global(.marker) {
        width: 4px;
        background-color: blue;
    }
}
</style>
