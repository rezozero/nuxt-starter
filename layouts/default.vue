<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'
import VFooter from '~/components/organisms/VFooter/VFooter.vue'
import { I18N_DETECT_BROWSER_LANGUAGE } from '~/constants/i18n'

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
    // const detectBrowserLanguage = I18N_DETECT_BROWSER_LANGUAGE
    // const isRootPath = alternateLinks.some(link => link.url === '/')

    // trying to redirect to the preferred locale for the root page (home page) only
    // if (webResponseLocale && detectBrowserLanguage && isRootPath) {
    //     const cookieLocale = useI18nCookie().value
    //
    //     if (!cookieLocale || !detectBrowserLanguage.useCookie || (detectBrowserLanguage.useCookie && cookieLocale && detectBrowserLanguage.alwaysRedirect)) {
    //         const browserLocale = useBrowserLocale()
    //         const preferredLocale = detectBrowserLanguage.useCookie ? (cookieLocale || browserLocale) : browserLocale
    //
    //         if (preferredLocale && preferredLocale !== webResponseLocale && $i18n.locales.value.find(availableLocale => availableLocale.code === preferredLocale)) {
    //             const alternateLink = alternateLinks.find(link => link.locale === preferredLocale)
    //
    //             if (alternateLink) await navigateTo(alternateLink.url, { replace: true, external: true })
    //         }
    //     }
    // }

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
