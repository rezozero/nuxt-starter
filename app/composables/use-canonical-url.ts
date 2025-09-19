import { joinURL, withQuery } from 'ufo'
import type { LocationQuery } from '#vue-router'
import ListingQuery from '~/constants/listing-query'

type QueryValue = LocationQuery[keyof LocationQuery]

const VALID_QUERY = [ListingQuery.PAGE]

export function useCanonicalUrl(url?: string, validKeys: string[] = []) {
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()

    function isValidQuery(key: string, value: QueryValue) {
        if (key === 'page' && Number(value) < 2) return false

        return [...VALID_QUERY, ...validKeys].includes(key) && value
    }

    const filteredQuery = Object.entries(route.query).reduce((acc, entry) => {
        if (isValidQuery(...entry)) {
            Object.assign(acc, entry)
        }
        return acc
    }, {})

    return withQuery(joinURL(runtimeConfig.public.site.url, url || route.path), filteredQuery)
}
