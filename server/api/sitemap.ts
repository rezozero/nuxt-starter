import type { HydraCollection, JsonLdObject, RoadizRequestParams, RoadizTranslation } from '@roadiz/types'
import { hydraCollectionFetch } from '~/utils/hydra-collection-fetch'
import { useApiUrl } from '~/composables/use-api-url'

type ReachableEntity = JsonLdObject & {
    url?: string
    // The `updatedAt` field can be on the root or inside a `node` object
    updatedAt?: string
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
        'properties[0]': 'url',
        'properties[node][]': 'updatedAt',
        'itemsPerPage': 50,
    })

    // const today = new Date()
    // today.setFullYear(today.getFullYear() - 3)
    // const events = fetchAllByLocale('/events', locale, {
    //     'properties[0]': 'url',
    //     'properties[1]': 'updatedAt',
    //     'sortingDateTime[after]': today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
    //     'itemsPerPage': 50,
    // })
    //
    // const peoples = fetchAllByLocale('/people', locale, {
    //     'properties[0]': 'url',
    //     'properties[1]': 'updatedAt',
    //     'exists[description]': true,
    //     'order[familyName]': 'asc',
    //     'itemsPerPage': 50,
    // })
    //
    // return [nodes, events, peoples]
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
        lastmod: (resource?.updatedAt)
            ? (new Date(resource?.updatedAt).toISOString())
            : (resource?.node?.updatedAt ? new Date(resource?.node?.updatedAt).toISOString() : undefined),
    }))
})
