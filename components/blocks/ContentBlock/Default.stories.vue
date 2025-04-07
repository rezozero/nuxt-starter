<script lang="ts" setup>
import type { RoadizWalker } from '@roadiz/types'

const walker: RoadizWalker = {
    item: {
        title: 'Hello world',
    },
}
</script>

<template>
    <NuxtStory>
        <ContentBlock
            :walker="walker"
            :index="0"
        />
    </NuxtStory>
</template>
