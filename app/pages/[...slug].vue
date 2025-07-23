<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
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
const {
    webResponse,
    item,
    error,
    headers,
    alternateLinks,
} = await useRoadizWebResponse<RoadizNodesSources>(route.path)

if (error.value) {
    showError(error.value)
}

// Meta data
if (import.meta.server) {
    useRoadizSeoMeta(webResponse.value)
    useRoadizHead(webResponse.value, alternateLinks.value)

    // Cache tags
    useCacheTags(headers.value?.[useRuntimeConfig().public.cacheTags?.key])

    // Cache control
    useCommonCacheControl({
        maxAge: webResponse?.value?.maxAge,
        rawHeader: headers.value?.['cache-control'],
    })
}

// Force redirect when web response URL is not matching current route path
if (item.value?.url && item.value.url !== route.path) {
    await navigateTo({ path: item.value?.url }, { redirectCode: 301 })
}

const nodeTitle = computed(() => {
    return webResponse.value?.head?.metaTitle || (item as { name?: string })?.name || item.value?.title
})

usePage({
    webResponse: webResponse.value,
    alternateLinks: alternateLinks.value,
    title: nodeTitle.value,
})

useHead({
    title: nodeTitle.value,
})

// Current entity
const pageEntity = computed(() => item.value && isPageEntity(item.value) && item.value)
</script>

<template>
    <LazyVDefaultPage
        v-if="pageEntity"
        :web-response="webResponse"
    />
</template>

<!-- <style module lang="scss"></style> -->
