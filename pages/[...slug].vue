<script setup lang="ts">
import type { RoadizNodesSources } from '@roadiz/types'
import { getBlockCollection } from '~/utils/roadiz/block'
import { isPageEntity } from '~/utils/roadiz/entity'
import { defaultPageTransition } from '~/transitions/default-page-transition'

definePageMeta({
    pageTransition: defaultPageTransition,
})

const { webResponse, item, error } = await useRoadizWebResponse<RoadizNodesSources>()

if (error) {
    showError(error)
}

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
    <LazyVDefaultPage v-if="defaultPageEntity" :blocks="blocks" :entity="defaultPageEntity" />
</template>

<style module lang="scss"></style>
