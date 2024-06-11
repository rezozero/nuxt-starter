<script setup lang="ts">
const slideIndex = ref(3)
</script>

<template>
    <NuxtStory :class="$style.root">
        <template #aside>
            <h4>Controls</h4>
            <button @click="() => (slideIndex = slideIndex - 1)">Prev</button>
            <label for="index">
                <input id="index" v-model="slideIndex" type="number" name="index" />
            </label>
            <button @click="() => (slideIndex = slideIndex + 1)">Next</button>
        </template>
        <VSlider v-slot="{ itemClass }" v-model="slideIndex" :class="$style.slider">
            <div v-for="item in 20" :key="item" :class="[$style.item, itemClass]">
                {{ item }}
            </div>
        </VSlider>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    :global(.nuxt-story__main) {
        display: grid;
        align-items: flex-start;
    }
}

.slider {
    --gutter: #{rem(24)};

    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.item {
    width: flex-grid(2, 4);
    height: rem(60);
    border: 1px solid black;
    background-color: #ffd6d6;

    @include media('>=lg') {
        width: flex-grid(1, 4);
    }
}
</style>
