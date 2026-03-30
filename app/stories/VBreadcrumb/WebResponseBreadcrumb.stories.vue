<script lang="ts" setup>
import type { RoadizWebResponse } from '@roadiz/types'
import webResponse from '~/assets/stories/fixtures/web-responses/sub-page.json'

const route = useRoute()

// root page logic
await useCommonContentFetch()

const currentPage = useCurrentPage()
currentPage.value = {
    webResponse: {
        ...webResponse,
        item: {
            ...webResponse.item,
            title: 'Current page mocked',
            url: route.path,
        },
    } as RoadizWebResponse,
    title: 'Page title',
}

// In wrapper component usage
const { items, allItems } = useRoadizBreadcrumb(currentPage.value.webResponse || null)
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Items: Roadiz breadcrumb items">
            <LazyVBreadcrumb
                v-if="items.length"
                :items="items"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="AllItems: Home + Roadiz breadcrumb items + current page">
            <LazyVBreadcrumb
                v-if="allItems.length"
                :items="allItems"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
