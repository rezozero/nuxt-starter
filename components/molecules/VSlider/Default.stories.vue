<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VSlider v-slot="{ itemClass }" :class="$style.root">
                <div v-for="item in 20" :key="item" :class="[$style.item, itemClass]">
                    {{ item }}
                </div>
            </VSlider>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With scroll bar">
            <VSlider v-slot="{ itemClass }" :class="[$style.root, $style['root--with-scroll-bar']]">
                <div v-for="item2 in 20" :key="item2 + '-2'" :class="[$style.item, itemClass]">
                    {{ item2 }}
                </div>
            </VSlider>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    --gutter: #{rem(24)};

    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);

    &--with-scroll-bar {
        scrollbar-width: thin;
    }
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
