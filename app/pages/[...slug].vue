<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import { isPageEntity, isSearchPageEntity } from '~/utils/roadiz/entity'
import { defaultPageTransition } from '~/transitions/default-page-transition'

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

// Force redirect when web response URL is not matching current route path
if (item.value?.url && item.value.url !== route.path) {
    await navigateTo({ path: item.value?.url }, { redirectCode: 301 })
}

// ----------------- Cache strategy ----------------
if (import.meta.server) {
    // Cache tags
    useCacheTags(headers.value?.[useRuntimeConfig().public.cacheTags?.key])

    // Cache control
    useCommonCacheControl({
        maxAge: webResponse?.value?.maxAge,
        rawHeader: headers.value?.['cache-control'],
    })
}

// ---------------- Currently displayed page entity ----------------
const pageEntity = computed(() => item.value && isPageEntity(item.value) && item.value)
// Search page entity
const searchPageEntity = computed(() => item.value && isSearchPageEntity(item.value) && item.value)

// ----------------- Update meta data ----------------
// Update on server AND during client side navigation.
// The client side update is required for the share on iOS Safari feature
// to have the correct meta data when sharing.
const roadizMeta = await useRoadizMeta(webResponse, alternateLinks)
const {
    head: pageMetaHead,
    image: pageMetaImage,
    title: pageMetaTitle,
    truncatedDescription: pageMetaDescription,
} = usePageMeta(roadizMeta)
useHead(pageMetaHead)

// Schema.org structured data
useSchemaOrg(computed(() => [
    defineWebPage({
        '@type': searchPageEntity.value ? 'SearchResultsPage' : 'WebPage',
        'name': pageMetaTitle.value,
        'primaryImageOfPage': pageMetaImage.value,
        'description': pageMetaDescription.value,
    }),
]))

// ------------------ Provide page data to components ----------------
usePage({
    webResponse: webResponse.value,
    alternateLinks: alternateLinks.value,
    title: pageMetaTitle.value,
})
</script>

<template>
    <LazyVPageDefault
        v-if="pageEntity"
        :web-response="webResponse"
    />
    <LazyVPageSearch
        v-else-if="searchPageEntity"
        :web-response="webResponse"
    />
</template>

<!-- <style module lang="scss"></style> -->
