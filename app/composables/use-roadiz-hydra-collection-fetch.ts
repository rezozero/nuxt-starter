import type { FetchOptions } from 'ofetch'
import { hydraCollectionFetch } from '../../shared/utils/hydra-collection-fetch'

export function useRoadizHydraCollectionFetch<T>(url: string, request?: FetchOptions) {
    const fetch = useRoadizFetchFactory()

    return hydraCollectionFetch<T>(url, request, fetch)
}
