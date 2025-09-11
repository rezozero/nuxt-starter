<script lang="ts" setup>
import type { RoadizWebResponse } from '@roadiz/types'
import eventWebResponse from '~/assets/stories/fixtures/web-responses/event.json'
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
const { breadcrumbItems, allItems } = useRoadizBreadcrumb(currentPage.value.webResponse || null)
const { allItems: eventBreadcrumbsItems } = useRoadizBreadcrumb(eventWebResponse)
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Roadiz breadcrumb items">
            <LazyVBreadcrumb
                v-if="breadcrumbItems.length"
                :items="breadcrumbItems"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Breadcrumb + home and current page">
            <LazyVBreadcrumb
                v-if="allItems.length"
                :items="allItems"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Event breadcrumb">
            <LazyVBreadcrumb
                v-if="eventBreadcrumbsItems.length"
                :items="eventBreadcrumbsItems"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
