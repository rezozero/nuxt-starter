import { joinURL, withQuery } from 'ufo'
import type { LocationQuery } from '#vue-router'
import SearchParams from '~/constants/search-params'

type QueryValue = LocationQuery[keyof LocationQuery]

const ALLOWED_SEARCH_PARAMS = [SearchParams.PAGE]

export function useCanonicalUrl(url: string, validKeys: string[] = []) {
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()

    function isAllowedSearchParam(key: string, value: QueryValue) {
        if (key === SearchParams.PAGE && Number(value) < 2) return false

        return [...ALLOWED_SEARCH_PARAMS, ...validKeys].includes(key) && value
    }

    const filteredQuery = Object.entries(route.query).reduce((acc, entry) => {
        if (isAllowedSearchParam(...entry)) {
            Object.assign(acc, entry)
        }
        return acc
    }, {})

    const baseUrl = joinURL(runtimeConfig.public.site.url, url)
    return withQuery(baseUrl, filteredQuery)
}
