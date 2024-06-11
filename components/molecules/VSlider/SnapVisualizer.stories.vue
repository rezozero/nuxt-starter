<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { VSlider } from '#components'
import type { Slide } from '~/components/molecules/VSlider/VSlider.vue'

const itemLength = ref(18)
const value = ref(25)
const slideIndex = ref(0)

const vSliderInstance = ref<ComponentPublicInstance<typeof VSlider> | null>(null)
const slides = computed(() => vSliderInstance.value?.slides as Slide[])

function setSnapMarkers(slides: Slide[]) {
    slides.forEach((slide) => {
        const leftMarker = slide.el?.querySelector('.marker-left') as HTMLElement
        const rightMarker = slide.el?.querySelector('.marker-right') as HTMLElement

        if (leftMarker) leftMarker.style.left = slide.snapLeft + 'px'
        if (rightMarker) rightMarker.style.left = slide.snapRight + 'px'
    })
}

watch(slides, (value) => {
    if (value?.length) setSnapMarkers(value)
})
</script>

<template>
    <NuxtStory>
        <template #aside>
            <h4>Slide Index: {{ slideIndex }}</h4>
            <h4>Slide Length: {{ itemLength }}</h4>
            <button @click="() => (itemLength = itemLength - 1)">Remove slide</button>
            <button @click="() => (itemLength = itemLength + 1)">Add slide</button>
            <hr />
            <h4>Slide width: {{ value }} %</h4>
            <label for="item-width">
                <input id="item-width" v-model="value" type="range" name="item-width" min="10" step="5" max="100" />
            </label>
        </template>
        <VSlider v-slot="{ itemClass }" ref="vSliderInstance" v-model="slideIndex" :class="$style.root">
            <div v-for="item in itemLength" :key="item" :class="[$style.item, itemClass]">
                <div class="marker marker-left"></div>
                {{ item }}
                <div class="marker marker-right"></div>
            </div>
        </VSlider>

        <div>
            <button @click="() => (slideIndex = slideIndex - 1)">Prev</button>
            <button @click="() => (slideIndex = slideIndex + 1)">Next</button>
        </div>
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

    position: relative;
    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);

    :global(.nuxt-story__main) {
        touch-action: pan-x;
    }
}

.item {
    display: flex;
    width: calc(((100% - 99 * var(--gutter)) / 100) * v-bind(value) + ((v-bind(value) - 1) * var(--gutter)));
    height: rem(260);
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;

    &:nth-child(odd) :global(.marker) {
        width: 4px;
        background-color: blue;
    }
}
</style>
