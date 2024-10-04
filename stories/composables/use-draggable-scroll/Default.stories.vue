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
.root {
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    width: 100%;
    max-width: rem(400px);
    gap: rem(24);
}

.item {
    width: rem(200);
    aspect-ratio: 300/200;
    background-color: #ccc;
    flex-shrink: 0;
}
</style>
