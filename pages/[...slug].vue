<script setup lang="ts">
// definePageMeta({
//     pageTransition: defaultPageTransition,
// })

import type { RoadizNodesSources } from '@roadiz/types'

const { item, error } = await useRoadizWebResponse<RoadizNodesSources>()

if (error) {
    showError(error)
}

const route = useRoute()
// Force redirect when web response URL is not matching current route path
if (item?.url && item.url !== route.path) {
    await navigateTo({ path: item?.url }, { redirectCode: 301 })
}
</script>

<template>
    <div>Hello world</div>
</template>

<style module lang="scss"></style>
