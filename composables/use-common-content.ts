import type { CommonContent, CommonContentMenuKey } from '~/types/api'
import type { ValueOf } from '~/utils/types'

export const COMMON_CONTENT_KEY = 'commonContent'

export function useCommonContent() {
    const commonContent = useNuxtData<CommonContent>(COMMON_CONTENT_KEY).data
    const homeItem = computed(() => commonContent.value?.home)
    const head = computed(() => commonContent.value?.head)
    const errorWalker = computed(() => commonContent.value?.errorPage)

    function getMenu(key: CommonContentMenuKey): ValueOf<CommonContent['menus']> | undefined {
        return commonContent.value?.menus?.[key]
    }

    const mainMenuWalker = computed(() => getMenu('mainMenuWalker'))

    return {
        commonContent,
        head,
        homeItem,
        mainMenuWalker,
        errorWalker,
    }
}
