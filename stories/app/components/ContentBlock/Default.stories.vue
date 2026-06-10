<script lang="ts" setup>
import type { RoadizWalkerKnown } from '~/utils/roadiz/types';
import type { NSContentBlock } from '~~/types/roadiz'

const walker: RoadizWalkerKnown<NSContentBlock> = {
    item: {
        slug: 'content-block',
        title: 'Hello world',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    children: [],
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
