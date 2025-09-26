import type { RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import { getArrayFromCollection } from '~/utils/roadiz/get-array-from-collection'

export interface BreadcrumbItem {
    label?: string
    url?: string
}

type AnyObject = Record<string, unknown>

const POSSIBLE_TITLE_KEY = ['altTitle', 'name', 'title']

function getItemTitle(item: AnyObject | undefined) {
    if (!item || typeof item !== 'object') return undefined

    const objKey = POSSIBLE_TITLE_KEY.find((key) => {
        return key in item && typeof item[key] === 'string' && !!item[key]
    })

    return objKey && typeof item[objKey] === 'string' ? item[objKey] : undefined
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

    const breadcrumbItems = computed(() => {
        const items = toValue(webResponse)?.breadcrumbs?.items
        const list = items && getArrayFromCollection<RoadizNodesSources>(items) as (RoadizNodesSources & AnyObject)[]

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
            label: getItemTitle(pageItem as AnyObject),
            url: pageItem?.url,
        }
    })

    const allItems = computed(() => {
        return [homeItem.value, ...breadcrumbItems.value, currentPageItem.value]
            .filter(item => item?.label || item?.url)
    })

    return { allItems, breadcrumbItems }
}
