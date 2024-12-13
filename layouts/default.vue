<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import { isAvailableI18nLocale } from '~/utils/locale'

// init Roadiz page data (i.e. dynamic page)
await callOnce(async () => {
    const route = useRoute()

    if (route.name !== 'slug') return

    const { webResponse, alternateLinks } = await useRoadizWebResponse()

    // init page data for components outside page
    useCurrentPage({ webResponse, alternateLinks })

    const locale = (webResponse?.item as RoadizNodesSources)?.translation?.locale

    if (locale && isAvailableI18nLocale(locale)) {
        const { $i18n } = useNuxtApp()
        await $i18n.setLocale(locale)
    }

    useAlternateLinks(alternateLinks)
})
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>

<!-- <style module lang="scss"></style> -->
