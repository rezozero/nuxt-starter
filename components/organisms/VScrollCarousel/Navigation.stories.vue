<script setup lang="ts">
const slideIndex = ref(3)
</script>

<template>
    <NuxtStory :class="$style.root">
        <VScrollCarousel v-slot="{ slideClass }" v-model="slideIndex" :class="$style.carousel">
            <div v-for="item in 20" :key="item" :class="[$style.slide, slideClass]">
                {{ item }}
            </div>
        </VScrollCarousel>
        <h4>Controls</h4>
        <button @click="() => (slideIndex = slideIndex - 1)">Prev</button>
        <button @click="() => (slideIndex = slideIndex + 1)">Next</button>
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
