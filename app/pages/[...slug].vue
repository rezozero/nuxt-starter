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

// WebResponse head meta title is constructed through the API (node title + siteName || node metaTitle)
// Let the front-end handle the title construction to be able to include additional information
// (e.g. search params label) and ensure the siteName is always included in the title for a11y purpose.
const nodeTitle = computed(() => {
    return item.value?.metaTitle || item.value?.title || (item as { name?: string })?.name || ''
})

usePage({
    webResponse: webResponse.value,
    alternateLinks: alternateLinks.value,
    title: nodeTitle.value,
})

const { searchParamsLabel, canonicalUrl } = useCurrentPageSearchParams()

const siteName = webResponse.value?.head?.siteName || useRuntimeConfig().public?.site?.name
const pageTitle = computed(() => {
    if (!nodeTitle.value) {
        return webResponse.value?.head?.metaTitle || siteName
    }

    const additionalTitle = searchParamsLabel.value ? `, ${searchParamsLabel.value}` : ''
    if (nodeTitle.value === siteName) {
        return `${nodeTitle.value}${additionalTitle}`
    }
    else {
        return `${nodeTitle.value}${additionalTitle} — ${siteName}`
    }
})

useHead({
    title: pageTitle.value,
    link: [
        {
            rel: 'canonical',
            href: canonicalUrl.value,
        },
    ],
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
