<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'

// init Roadiz page data (i.e. dynamic page)
const route = useRoute()

// if the route is a dynamic page (i.e. [...slug].vue page)
if (route.name === 'slug') {
    const { webResponse, alternateLinks } = await useRoadizWebResponse()

    // init page data for components outside page
    const currentPage = useCurrentPage()

    currentPage.value = {
        webResponse: webResponse.value,
        alternateLinks: alternateLinks.value,
    }

    useAlternateLinks(alternateLinks.value)

    // i18n
    const webResponseLocale = (webResponse.value?.item as RoadizNodesSources)?.translation?.locale

    if (webResponseLocale) {
        const { locale, locales, setLocale } = useI18n()

        // trying to redirect to the preferred locale
        await useRoadizDetectBrowserLanguage({
            locale: webResponseLocale,
            alternateLinks: alternateLinks.value,
        })

        if (
            webResponseLocale !== locale.value
            && locales.value.find(availableLocale => availableLocale.code === webResponseLocale)
        ) {
            // @ts-expect-error we expect the web response locale is a valid locale
            await setLocale(webResponseLocale)
        }
    }
}

// Populate Roadiz common content after locale is set
await useCommonContentFetch()

const { getPageTitle } = useRoadizPageTitle()

useHead({
    titleTemplate: getPageTitle,
})

const { isActive: previewIsActive } = useRoadizPreview()
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
            <VRoadizAlertsContainer />
            <VLoadingIndicator />
            <NuxtRouteAnnouncer />
        </ClientOnly>
        <!-- Using this layout in the error page requires to use an extra <div> -->
        <div id="main">
            <slot>
                <NuxtPage />
            </slot>
        </div>
        <VFooter id="footer" />
        <LazyVRoadizPreview v-if="previewIsActive" />
    </div>
</template>

<style module lang="scss">
.skip-to-nav {
    z-index: 10000;
}
</style>
