<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'

export type VBlockProps = {
    item?: RoadizNodesSources
    tag?: string
}
defineProps<VBlockProps>()
</script>

<template>
    <component
        :is="tag || 'section'"
        :id="item?.slug"
    >
        <slot />
    </component>
</template>
