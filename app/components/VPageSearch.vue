<script lang="ts" setup>
import type { PageEntityProps } from '~~/types/app'
import { getBlockCollection } from '~/utils/roadiz/block'
import type { NSSearchPage } from '~~/types/roadiz'

const { webResponse } = defineProps<PageEntityProps>()

const page = computed(() => webResponse?.item as NSSearchPage)
const blocks = computed(() => (webResponse?.blocks && getBlockCollection(webResponse.blocks)) || [])
</script>

<template>
    <div>
        <h1>{{ page?.title || 'Search page' }}</h1>
        <VRoadizBlockFactory
            v-if="blocks.length"
            :blocks="blocks"
        />
    </div>
</template>
