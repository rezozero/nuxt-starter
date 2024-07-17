<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <VCarousel v-slot="{ slideClass }" :class="$style.carousel">
            <div v-for="item in 20" :key="item" :class="[$style.slide, slideClass]">
                {{ item }}
            </div>
        </VCarousel>
    </NuxtStory>
</template>

<style lang="scss" module>
.carousel {
    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.slide {
    width: 300px;
    height: 200px;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
