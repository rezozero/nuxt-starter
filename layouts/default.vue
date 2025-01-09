<script setup lang="ts">
import type { RoadizNodesSources } from '@roadiz/types'

// init Roadiz page data (i.e. dynamic page)
await callOnce(async () => {
    const route = useRoute()

    // check if it's a dynamic page
    if (route.name !== 'slug') return

    const { webResponse, alternateLinks } = await useRoadizWebResponse()

    // fill page data
    useCurrentPage({ webResponse, alternateLinks })

    // init I18N
    const nuxtApp = useNuxtApp()
    const locale = (webResponse?.item as RoadizNodesSources)?.translation?.locale

    if (locale) {
        // set the current global locale
        await nuxtApp.$i18n.setLocale(locale)
    }
    else {
        // get the locale from the route (prefix) or cookie ?
    }

    // init alternate links
    useAlternateLinks(alternateLinks)
})
</script>

<template>
    <div>
        <ClientOnly>
            <VueSkipTo
                :class="$style['skip-to-nav']"
                :list-label="$t('skip_to.list_label').toString()"
                :to="[
                    { anchor: '#content', label: $t('skip_to.main_content') },
                    { anchor: '#footer', label: $t('skip_to.footer') },
                ]"
            />
        </ClientOnly>
        <NuxtPage />
    </div>
</template>

<style module lang="scss">
.skip-to-nav {
    z-index: 10000;
}
</style>
