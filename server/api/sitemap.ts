import type { HydraCollection, JsonLdObject, RoadizRequestParams, RoadizTranslation } from '@roadiz/types'
import { hydraCollectionFetch } from '~/utils/hydra-collection-fetch'
import { useApiUrl } from '~/composables/use-api-url'

type ReachableEntity = JsonLdObject & {
    url?: string
    node?: {
        updatedAt?: string
    }
}

const apiFetch = $fetch.create({
    method: 'GET',
    headers: {
        'accept-encoding': 'gzip, deflate',
        'Accept': 'application/ld+json',
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
        'reachable': true,
        'node.visible': true,
        'noIndex': false,
        'properties[0]': 'title',
        'properties[1]': 'url',
        'properties[node][]': 'updatedAt',
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
    }).then(response => response['hydra:member']!.map(({ locale }) => locale))

    const resourcesLocalized = locales.map(locale => fetchResourcesByLocale(locale as string)).flat()
    const resources = (await Promise.all(resourcesLocalized)).flat()

    return resources.filter(r => r?.url).map(resource => asSitemapUrl({
        loc: resource.url as string,
        lastmod: resource?.node?.updatedAt ? new Date(resource?.node?.updatedAt).toISOString() : undefined,
    }))
})
