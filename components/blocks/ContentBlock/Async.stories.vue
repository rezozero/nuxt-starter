<script setup lang="ts">
import type { RoadizWalker } from '@roadiz/types'

const walker: RoadizWalker = {
    // @ts-expect-error - This is a mock object
    item: {
        title: 'Title',
    },
    children: [],
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <ContentBlock
            :walker="walker"
            :index="0"
            :class="$style.block"
        />
    </NuxtStory>
</template>

<style module lang="scss">
.root {
    padding-top: 200vh;
}

.block {
    border: 1px solid red;
}
</style>
