<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import { isAvailableI18nLocale } from '~/utils/locale'
import VFooter from '~/components/organisms/VFooter/VFooter.vue'

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
        <ClientOnly>
            <VueSkipTo
                :class="$style['skip-to-nav']"
                :list-label="$t('skip_to.list_label').toString()"
                :to="[
                    { anchor: '#main', label: $t('skip_to.main_content') },
                    { anchor: '#footer', label: $t('skip_to.footer') },
                ]"
            />
        </ClientOnly>
        <NuxtPage id="main" />
        <VFooter />
    </div>
</template>

<style module lang="scss">
.skip-to-nav {
    z-index: 10000;
}
</style>
