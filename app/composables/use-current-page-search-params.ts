// import { joinURL, withQuery } from 'ufo'
import type { LocationQuery } from '#vue-router'
import SearchParam from '~/constants/search-param'
import { joinURL, withQuery } from 'ufo'

type QueryValue = LocationQuery[keyof LocationQuery]

export function useCurrentPageSearchParams() {
    const route = useRoute()
    const page = useCurrentPage()
    const { t } = useI18n()

    function isAllowedSearchParam(key: string, values: QueryValue) {
        const value = Array.isArray(values) ? values[0] : values

        if (value !== null && value !== undefined) {
            return false
        }
        else if (page.value.webResponse?.item?.['@type'] === 'listing') {
            // Replace with a more generic way to determine if the current page is a listing page
            return key === SearchParam.PAGE && Number(value) >= 2
        }

        return false
    }

    const filteredQueryParams = computed(() => {
        return Object.entries(route.query).reduce((acc, entry) => {
            if (isAllowedSearchParam(...entry)) {
                Object.assign(acc, { [entry[0]]: entry[1] })
            }
            return acc
        }, {} as Record<string, QueryValue>)
    })

    const searchParamsLabel = computed(() => {
        const result: string[] = []

        Object.entries(filteredQueryParams.value).forEach(([key, value]) => {
            if (key === SearchParam.PAGE) {
                result.push(t('page', { page: value }))
            }
            else {
                result.push(`${value}`)
            }
        })

        return result.join(', ')
    })

    const canonicalUrl = computed(() => {
        const url = page.value?.webResponse?.item?.url || route.path
        const baseUrl = joinURL(useRuntimeConfig().public.site.url, url)
        return withQuery(baseUrl, filteredQueryParams.value)
    })

    return { filteredQueryParams, searchParamsLabel, canonicalUrl }
}
