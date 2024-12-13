<script lang="ts" setup>
import { getBlockCollection } from '~/utils/roadiz/block'
import { defaultPageTransition } from '~/transitions/default-page-transition'
import { useRoadizHead } from '~/composables/use-roadiz-head'
import { useRoadizSeoMeta } from '~/composables/use-roadiz-seo-meta'
import type { AppPageItem } from '~/types/app'

definePageMeta({
    pageTransition: defaultPageTransition,
})

// Roadiz handles the routing
defineI18nRoute(false)

const route = useRoute()
const { webResponse, item, error, headers, alternateLinks } = await useRoadizWebResponse<AppPageItem>(route.path)

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
const pageItem = computed(() => item && item as AppPageItem)
</script>

<template>
    <LazyVDefaultPage
        v-if="pageItem"
        :blocks="blocks"
        :item="pageItem"
    />
</template>

<!-- <style module lang="scss"></style> -->
