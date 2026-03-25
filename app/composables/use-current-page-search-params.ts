// import { joinURL, withQuery } from 'ufo'
import type { LocationQuery } from '#vue-router'
import SearchParam from '~/constants/search-param'
import { joinURL, withQuery } from 'ufo'
import { isListingEntity } from '~/utils/roadiz/entity'

type QueryValue = LocationQuery[keyof LocationQuery]

// Define common search params that should be included in the canonical URL for all pages
const COMMON_SEARCH_PARAMS: string[] = []

export function useCurrentPageSearchParams() {
    const route = useRoute()
    const { t } = useI18n()

    const baseUrl = useRuntimeConfig().public.site.url

    const currentPage = useCurrentPage()
    const pageItem = computed(() => currentPage.value?.webResponse?.item)

    const isListingPage = computed(() => {
        return pageItem.value && isListingEntity(pageItem.value)
    })

    function isAllowedSearchParam(key: string, values: QueryValue) {
        const value = Array.isArray(values) ? values[0] : values

        if (value === null || typeof value === 'undefined') {
            return false
        }

        if (isListingPage.value) {
            return key === SearchParam.PAGE && Number(value) >= 2
        }

        return COMMON_SEARCH_PARAMS.includes(key)
    }

    const filteredSearchParams = computed(() => {
        return Object.entries(route.query).reduce((acc, entry) => {
            if (isAllowedSearchParam(...entry)) {
                Object.assign(acc, { [entry[0]]: entry[1] })
            }
            return acc
        }, {} as Record<string, QueryValue>)
    })

    const canonicalUrl = computed(() => {
        const url = joinURL(baseUrl, pageItem.value?.url || route.path)
        return withQuery(url, filteredSearchParams.value)
    })

    const searchParamsLabel = computed(() => {
        const result: string[] = []

        Object.entries(filteredSearchParams.value).forEach(([key, value]) => {
            if (key === SearchParam.PAGE) {
                result.push(t('page', { page: value }))
            }
            else {
                result.push(`${value}`)
            }
        })

        return result.join(', ')
    })

    return { filteredSearchParams, searchParamsLabel, canonicalUrl }
}
