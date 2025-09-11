<script setup lang="ts">
const { disableBodyScroll, enableBodyScroll } = useBodyScrollLock()
</script>

<template>
    <NuxtStory :class="$style.root">
        <div :class="$style.button">
            <button @click="disableBodyScroll">
                Disable body scroll
            </button>
            <button @click="enableBodyScroll">
                Enable body scroll
            </button>
        </div>
        <div :class="$style.wrapper">
            <div :class="$style.item">
                Scrollable item
            </div>
        </div>
    </NuxtStory>
</template>

<style module lang="scss">
.root {
    height: 300vh;
    padding-top: 32px;

    .button {
        position: fixed;
        top: 16px;
    }
}

.wrapper {
    display: flex;
    width: 100%;
    height: 80vh;
    overflow-y: auto;
}

.item {
    width: 100%;
    height: 200vh;
    background-color: #ccc;
}
</style>
