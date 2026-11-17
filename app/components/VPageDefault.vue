<script lang="ts" setup>
import type { PageEntityProps } from '~~/types/app'
import type { NSPage } from '~~/types/roadiz'
import { getBlockCollection } from '~/utils/roadiz/block'
import type { RoadizBlockFactoryLazyHydration } from '~/components/VRoadizBlockFactory'

const { webResponse } = defineProps<PageEntityProps>()

const page = computed(() => webResponse?.item as NSPage)
const blocks = computed(() => (webResponse?.blocks && getBlockCollection(webResponse.blocks)) || [])
// The first block is likely above the fold (hero, LCP), so it hydrates with the app
const blocksLazyHydration: RoadizBlockFactoryLazyHydration = { exclude: ({ index }) => index === 0 }
</script>

<template>
    <div>
        <h1>{{ page?.title || 'Default page' }}</h1>
        <VRoadizBlockFactory
            v-if="blocks.length"
            :blocks="blocks"
            :lazy-hydration="blocksLazyHydration"
        />
    </div>
</template>
