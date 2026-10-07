import type { RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import { getArrayFromCollection } from '~/utils/roadiz/get-array-from-collection'

export interface BreadcrumbItem {
    label?: string
    url?: string
}

// Extends to EventsApi entity
type ExtendedNodesSources = RoadizNodesSources & {
    altTitle?: string
    name?: string
}

function getItemTitle(item: ExtendedNodesSources) {
    if (!item) return undefined

    return item.altTitle || item.title || item.name
}

export function useRoadizBreadcrumb(webResponse: MaybeRefOrGetter<RoadizWebResponse | null>) {
    const { t, te } = useI18n()

    const { data } = useCommonContent()

    const homeItem = computed(() => {
        const home = data.value?.home
        return {
            label: te('breadcrumb.home_label') ? t('breadcrumb.home_label') : home?.title,
            url: home?.url,
        }
    })

    const items = computed(() => {
        const items = toValue(webResponse)?.breadcrumbs?.items
        const list = items && getArrayFromCollection<RoadizNodesSources>(items)

        if (!list?.length) return []

        return list.map((item) => {
            return {
                label: getItemTitle(item),
                url: item.url,
            }
        })
    })

    const currentPageItem = computed(() => {
        const pageItem = toValue(webResponse)?.item
        if (!pageItem || pageItem?.url === homeItem.value?.url) return {}

        return {
            label: getItemTitle(pageItem),
            url: pageItem?.url,
        }
    })

    const allItems = computed(() => {
        return [homeItem.value, ...items.value, currentPageItem.value]
            .filter(item => item?.label || item?.url)
    })

    return { allItems, items }
}
