<script lang="ts" setup>
import type { NSContentBlock } from '~~/types/roadiz'
import type { UseRoadizBlockProps } from '~~/types/app'

const props = defineProps<UseRoadizBlockProps>()
const { item } = useRoadizBlock<NSContentBlock>({ props })
</script>

<template>
    <VBlock :item="item">
        <h2>{{ item.title }}</h2>
        <VMarkdown v-if="item.content" :content="item.content" />
    </VBlock>
</template>
