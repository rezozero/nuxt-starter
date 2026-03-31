<script lang="ts" setup>
import type { PageEntityProps } from '~~/types/app'
import type { NSPage } from '~~/types/roadiz'
import { getBlockCollection } from '~/utils/roadiz/block'

const { webResponse } = defineProps<PageEntityProps>()

const page = computed(() => webResponse?.item as NSPage)
const blocks = computed(() => (webResponse?.blocks && getBlockCollection(webResponse.blocks)) || [])
</script>

<template>
    <div>
        <h1>{{ page?.title || 'VDefaultPage' }}</h1>
        <VRoadizBlockFactory
            v-if="blocks.length"
            :blocks="blocks"
        />
    </div>
</template>
