<script setup lang="ts">
const slideIndex = ref(3)
</script>

<template>
    <NuxtStory>
        <template #aside>
            <button @click="() => (slideIndex = slideIndex - 1)">Prev slide</button>
            <label for="index">
                <input id="index" v-model="slideIndex" type="number" name="index" />
            </label>
            <button @click="() => (slideIndex = slideIndex + 1)">Next slide</button>
            {{ slideIndex }}
        </template>
        <VCarousel v-slot="{ itemClass }" v-model="slideIndex" :class="$style.root">
            <div v-for="item in 20" :key="item" :class="[$style.item, itemClass]">
                {{ item }}
            </div>
        </VCarousel>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    --gutter: #{rem(24)};

    width: 100%;
    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.item {
    display: flex;
    width: flex-grid(1, 4);
    height: rem(60);
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
