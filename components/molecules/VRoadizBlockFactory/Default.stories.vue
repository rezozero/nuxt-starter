<script setup lang="ts">
const blocks = [
    {
        '@id': 'walker-id',
        '@type': 'RoadizWalker',
        item: {
            '@id': 'item-id',
            '@type': 'ContentBlock',
        },
        children: [],
    },
]
</script>

<template>
    <NuxtStory>
        <VRoadizBlockFactory :blocks="blocks" />
    </NuxtStory>
</template>

<style lang="scss" module></style>
