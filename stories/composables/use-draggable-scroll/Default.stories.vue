<script setup lang="ts">
const list = ref<HTMLElement | null>(null)

useDraggableScroll(list)
</script>

<template>
    <NuxtStory>
        <ul ref="list" :class="$style.list">
            <li v-for="i in 10" :key="i" :class="$style.item"></li>
        </ul>
    </NuxtStory>
</template>

<style module lang="scss">
.list {
    display: flex;
    width: 600px;
    overflow-x: auto;
    padding: 0;
    gap: 10px;
    justify-content: flex-start;
    border: 1px solid black;
}

.item {
    width: 300px;
    flex-shrink: 0;
    height: 200px;
    background-color: #ccc;
}
</style>
