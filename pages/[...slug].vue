<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import { getBlockCollection } from '~/utils/roadiz/block'
import { isPageEntity } from '~/utils/roadiz/entity'
import { defaultPageTransition } from '~/transitions/default-page-transition'
import { useRoadizHead } from '~/composables/use-roadiz-head'
import { useRoadizSeoMeta } from '~/composables/use-roadiz-seo-meta'

definePageMeta({
    pageTransition: defaultPageTransition,
})

// Roadiz handles the routing
defineI18nRoute(false)

const route = useRoute()
const { webResponse, item, error, headers, alternateLinks } = await useRoadizWebResponse<RoadizNodesSources>(route.path)

if (error) {
    showError(error)
}

if (import.meta.server) {
    await useRoadizSeoMeta(webResponse)
    useRoadizHead(webResponse, alternateLinks)
}

// Cache tags
useCacheTags(headers?.[useRuntimeConfig().public.cacheTags?.key])

// Cache control
useWebResponseCacheControl(webResponse)

// Force redirect when web response URL is not matching current route path
if (item?.url && item.url !== route.path) {
    await navigateTo({ path: item?.url }, { redirectCode: 301 })
}

const nodeTitle = computed(() => {
    return webResponse?.head.metaTitle || (item as { name?: string })?.name || item?.title
})

usePage({
    webResponse,
    alternateLinks,
    title: nodeTitle.value,
})

useHead({
    title: nodeTitle.value,
})

// Get blocks from web response
const blocks = computed(() => (webResponse?.blocks && getBlockCollection(webResponse.blocks)) || [])

// Get default page entity
const defaultPageEntity = computed(() => item && isPageEntity(item) && item)
</script>

<template>
    <LazyVDefaultPage
        v-if="defaultPageEntity"
        :blocks="blocks"
        :entity="defaultPageEntity"
    />
</template>

<!-- <style module lang="scss"></style> -->
