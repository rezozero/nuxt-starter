<script setup lang="ts">
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

const { webResponse, item, error, headers, alternateLinks } = await useRoadizWebResponse<RoadizNodesSources>()

// I18N
const nuxtApp = useNuxtApp()
await callOnce(async () => {
    await nuxtApp.runWithContext(async () => {
        const locale = (webResponse.item as RoadizNodesSources)?.translation?.locale

        if (locale) {
            await nuxtApp.$i18n.setLocale(locale)
        }
        else {
            // get the locale from the route (prefix) or cookie ?
        }
    })

    useAlternateLinks(alternateLinks)
})

if (error) {
    showError(error)
}

await useRoadizSeoMeta(webResponse)
await useRoadizHead(webResponse, alternateLinks)

// Cache tags
useCacheTags(headers[useRuntimeConfig().public.cacheTags?.key])

// Cache control
useWebResponseCacheControl(webResponse)

const route = useRoute()

// Force redirect when web response URL is not matching current route path
if (item?.url && item.url !== route.path) {
    await navigateTo({ path: item?.url }, { redirectCode: 301 })
}

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
