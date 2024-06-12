<script lang="ts" setup>
import type { RoadizNodesSources, RoadizWalker } from '@roadiz/types'

defineProps<{
    blocks: RoadizWalker[]
    entity: RoadizNodesSources
}>()
</script>

<template>
    <div :class="$style.root">
        {{ entity.title || 'VDefaultPage' }}
    </div>
</template>

<style lang="scss" module>
.root {
}
</style>
