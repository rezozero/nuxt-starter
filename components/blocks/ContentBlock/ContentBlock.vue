<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import type { UseRoadizBlockProps } from '#imports'

const props = defineProps<UseRoadizBlockProps>()
const { item } = useRoadizBlock<RoadizNodesSources>({ props })
</script>

<template>
    <VBlock>
        <h1>{{ item.title }}</h1>
    </VBlock>
</template>
