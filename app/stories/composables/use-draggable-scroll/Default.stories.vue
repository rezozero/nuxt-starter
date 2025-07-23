<script setup lang="ts">
const root = ref<HTMLElement | null>(null)

useDraggableScroll({
    element: root,
})
</script>

<template>
    <NuxtStory>
        <div
            ref="root"
            :class="$style.root"
        >
            <div
                v-for="i in 10"
                :key="i"
                :class="$style.item"
            >
                {{ i }}
            </div>
        </div>
    </NuxtStory>
</template>

<style module lang="scss">
@use 'assets/scss/functions/rem' as *;

.root {
    display: flex;
    width: 100%;
    max-width: rem(400px);
    flex-wrap: nowrap;
    gap: rem(24);
    overflow-x: auto;
    white-space: nowrap;
}

.item {
    width: rem(200);
    flex-shrink: 0;
    aspect-ratio: 300/200;
    background-color: #ccc;
}
</style>
