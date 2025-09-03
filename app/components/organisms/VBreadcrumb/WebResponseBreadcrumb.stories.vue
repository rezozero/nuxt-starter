<script lang="ts" setup>
import type { RoadizWebResponse } from '@roadiz/types'
import webResponse from '~/assets/stories/fixtures/web-responses/sub-page.json'

// root page logic
await useCommonContentFetch()

const currentPage = useCurrentPage()
currentPage.value = {
    webResponse: webResponse as RoadizWebResponse,
    title: 'page title',
}

// In wrapper component usage
const { items } = useRoadizBreadcrumb(currentPage.value.webResponse || null)
</script>

<template>
    <NuxtStory>
        <LazyVBreadcrumb
            v-if="items"
            :items="items"
        />
    </NuxtStory>
</template>
