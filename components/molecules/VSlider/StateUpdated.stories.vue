<script setup lang="ts">
const itemLength = ref(2)
const value = ref(25)
</script>

<template>
    <NuxtStory>
        <template #aside>
            <h4>Slide Length: {{ itemLength }}</h4>
            <button @click="() => (itemLength = itemLength - 1)">Remove slide</button>
            <button @click="() => (itemLength = itemLength + 1)">Add slide</button>
            <hr />
            <h4>Slide width: {{ value }} %</h4>
            <label for="item-width">
                <input id="item-width" v-model="value" type="range" name="item-width" min="10" step="5" max="100" />
            </label>
        </template>
        <VSlider v-slot="{ itemClass }" :class="$style.root">
            <div v-for="item in itemLength" :key="item" :class="[$style.item, itemClass]">
                {{ item }}
            </div>
        </VSlider>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    --gutter: #{rem(24)};

    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.item {
    position: relative;
    display: flex;
    width: calc(((100% - 99 * var(--gutter)) / 100) * v-bind(value) + ((v-bind(value) - 1) * var(--gutter)));
    height: rem(60);
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
