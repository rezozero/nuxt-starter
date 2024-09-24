import type { CommonContent, CommonContentMenuKey } from '~/types/api'
import type { ValueOf } from '~/utils/types'

export const COMMON_CONTENT_KEY = 'commonContent'

export async function useCommonContent() {
    const { data } = await useAsyncData<CommonContent>(COMMON_CONTENT_KEY, () => {
        const fetch = useRoadizFetchFactory()

        return fetch('/common_content')
    })
    const homeItem = computed(() => data.value?.home)
    const head = computed(() => data.value?.head)
    const errorWalker = computed(() => data.value?.errorPage)

    function getMenu(key: CommonContentMenuKey): ValueOf<CommonContent['menus']> | undefined {
        return data.value?.menus?.[key]
    }

    const mainMenuWalker = computed(() => getMenu('mainMenuWalker'))

    return {
        data,
        head,
        homeItem,
        mainMenuWalker,
        errorWalker,
    }
}
