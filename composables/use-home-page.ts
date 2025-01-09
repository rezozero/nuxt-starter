import { joinURL } from 'ufo'

export async function useHomePage() {
    const { homeItem } = await useCommonContent()
    const route = useRoute()

    const isHomePage = computed(() => {
        const url = homeItem.value?.url
        const currentPage = useCurrentPage()

        if (url) return currentPage.value.alternateLinks?.[0]?.url === url

        // If there is an error then maybe the API could not be reached.
        // Therefore, the common content will be empty.
        // We have to check manually if the current route is the home route.
        const { $i18n } = useNuxtApp()
        const locales: string[] = $i18n?.localeCodes?.value || []

        // test `/` or `/{locale}` depending on the current locale and the i18n route strategy from Nuxt i18n or Roadiz
        return currentPage.value.alternateLinks?.[0]?.url === '/' || locales.map(locale => joinURL('/', locale)).includes(joinURL('/', route.path))
    })

    const homePagePath = computed(() => {
        const url = homeItem.value?.url

        if (url) return url

        // TODO: use Nuxt i18n strategy? It could not matched the Roadiz strategy (route prefix or not).
        return '/'
    })

    return { isHomePage, homePagePath }
}
