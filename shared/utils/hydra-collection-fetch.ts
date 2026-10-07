import type { HydraCollection } from '@roadiz/types'
import type { FetchOptions } from 'ofetch'

// Fetch hydra collection recursively
export async function hydraCollectionFetch<T>(url: string, request?: FetchOptions, fetch = $fetch) {
    const result = [] as Array<T>
    let page = request?.params?.page || 1
    // It is used into a do-while loop to fetch the collection until there are no more pages to fetch
    // eslint-disable-next-line no-useless-assignment
    let active = true

    do {
        const response = await fetch<HydraCollection<T>>(url, {
            ...request,
            method: 'GET',
            params: {
                ...request?.params,
                page,
            },
        })

        if (response?.['hydra:member']) {
            result.push(...response['hydra:member'])

            active = !!response?.['hydra:view']?.['hydra:next']
            page++
        }
        else {
            active = false
        }
    } while (active)

    return result
}
