import { joinURL } from 'ufo'

export function useHomePage() {
    const commonContent = useCommonContent()

    const isHomePage = computed(() => {
        const homeUrl = commonContent.value?.home?.url
        const currentPageUrl = toValue(useCurrentPage().value?.webResponse)?.item?.url

        // This is the common use case, ie the common content is loaded and the current page is known.
        if (homeUrl && currentPageUrl) return currentPageUrl === homeUrl

        // If there is an error then maybe the API could not be reached.
        // Therefore, the common content will be empty and / or the current page..
        // We have to check manually if the current route is the home route.
        const url = currentPageUrl || useRoute().path

        if (url === '/') return true

        // Localized URLs
        const { $i18n } = useNuxtApp()
        const locales: string[] = $i18n?.localeCodes?.value || []
        const normalizedUrl = joinURL('/', url)

        // test `/{locale}` depending on the current locale and the i18n route strategy from Nuxt i18n or Roadiz
        return locales.map(locale => joinURL('/', locale)).includes(normalizedUrl)
    })

    const homePagePath = computed(() => {
        const url = commonContent.value?.home?.url

        if (url) return url

        // TODO: use Nuxt i18n strategy? It could not matched the Roadiz strategy (route prefix or not).
        return '/'
    })

    return { isHomePage, homePagePath }
}
