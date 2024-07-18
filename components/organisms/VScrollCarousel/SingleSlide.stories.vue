<template>
    <NuxtStory>
        <VScrollCarousel v-slot="{ slideClass }" :class="$style.root">
            <div :class="[$style.item, slideClass]">1</div>
        </VScrollCarousel>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    padding-block: rem(48);
    gap: rem(24);
    background-color: #d8d8d8;
}

.item {
    width: 20%;
    height: 200px;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;
}
</style>
