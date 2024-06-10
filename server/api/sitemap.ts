import type { HydraCollection, JsonLdObject, RoadizRequestParams, RoadizTranslation } from '@roadiz/types'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { hydraCollectionFetch } from '~/utils/hydra-collection-fetch'
import { useApiUrl } from '~/composables/use-api-url'

type ReachableEntity = JsonLdObject & { url?: string }

const apiFetch = $fetch.create({
    method: 'GET',
    headers: {
        'accept-encoding': 'gzip, deflate',
        Accept: 'application/ld+json',
    },
    baseURL: useApiUrl(), // Auto imports within the server folder aren't supported
})

function fetchAllByLocale(path: string, _locale = 'fr', params: RoadizRequestParams = {}): Promise<ReachableEntity[]> {
    return hydraCollectionFetch<ReachableEntity>(
        path,
        {
            params: {
                properties: ['url'],
                _locale,
                ...params,
            },
        },
        apiFetch,
    )
}

function fetchResourcesByLocale(locale: string) {
    const nodes = fetchAllByLocale('/nodes_sources', locale, {
        'node.nodeType.reachable': true,
        'node.visible': true,
        noIndex: false,
    })

    // const today = new Date()
    // today.setFullYear(today.getFullYear() - 2)
    // const events = fetchAllByLocale('/events', locale, {
    //     'sortingDateTime[after]': today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
    // })
    //
    // const peoples = fetchAllByLocale('/people', locale, {
    //     'exists[description]': true,
    //     'order[familyName]': 'asc',
    // })

    return [nodes]
}

export default defineSitemapEventHandler(async () => {
    const locales = await apiFetch<HydraCollection<RoadizTranslation>>('/translations', {
        params: { available: true },
    }).then((response) => response['hydra:member'].map(({ locale }) => locale))

    const resourcesLocalized = locales.map((locale) => fetchResourcesByLocale(locale)).flat()
    const resources = (await Promise.all(resourcesLocalized)).flat()

    return resources.filter((r) => r?.url).map((resource) => asSitemapUrl(resource.url as string))
})
