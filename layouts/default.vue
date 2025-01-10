<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import VFooter from '~/components/organisms/VFooter/VFooter.vue'

// init Roadiz page data (i.e. dynamic page)
await callOnce(async () => {
    const route = useRoute()

    // if the route is not a dynamic page, return
    if (route.name !== 'slug') return

    const { webResponse, alternateLinks } = await useRoadizWebResponse()

    // init page data for components outside page
    useCurrentPage({ webResponse, alternateLinks })
    useAlternateLinks(alternateLinks)

    // i18n
    const webResponseLocale = (webResponse?.item as RoadizNodesSources)?.translation?.locale

    if (webResponseLocale) {
        const { $i18n } = useNuxtApp()

        await useRoadizDetectBrowserLanguage({ locale: webResponseLocale, alternateLinks })

        if (webResponseLocale !== $i18n.locale.value && $i18n.locales.value.find(availableLocale => availableLocale.code === webResponseLocale)) {
            await $i18n.setLocale(webResponseLocale)
        }
    }
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
