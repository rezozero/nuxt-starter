<template>
    <NuxtStory>
        <VScrollCarousel v-slot="{ slideClass }" :class="$style.root">
            <div v-for="item in 10" :key="item" :class="[$style.slide, slideClass]">
                {{ item }}
            </div>
        </VScrollCarousel>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    position: relative;
    background-color: #d8d8d8;
    gap: rem(24);
    padding-block: rem(48);
}

.slide {
    width: 20%;
    height: 200px;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: #ffd6d6;

    &:nth-child(odd) {
        width: 10%;
        background-color: blue;
    }

    &:nth-child(2n) {
        width: 40%;
    }

    &:nth-child(3n) {
        width: 5%;
    }
}
</style>
