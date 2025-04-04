import type { RoadizWebResponse } from '@roadiz/types'
import { joinURL } from 'ufo'
import { getResponseAlternateLinks } from '~/utils/roadiz/get-response-alternate-links'

export async function useRoadizWebResponse<T>(path?: string) {
    path = joinURL('/', path || useRoute().path)

    // Create a unique key for preventing re-fetching data between server and client.
    const dataKey = `web-response-${path}`
    const { data, error } = await useAsyncData(dataKey, async () => {
        const fetch = useRoadizFetchFactory()
        const response = await fetch.raw<RoadizWebResponse>('/web_response_by_path', {
            method: 'GET',
            query: {
                path,
            },
        })
        const headersLink = response.headers.get('link')
        const alternateLinks = headersLink ? getResponseAlternateLinks(headersLink) : []

        return {
            webResponse: response._data,
            alternateLinks,
            headers: Object.fromEntries(response.headers), // headers to POJO format
        }
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key], // no re-fetch data if the key is already in the payload
        deep: false, // use shallowRef for optimization
    })
    const alternateLinks = computed(() => data.value?.alternateLinks)
    const headers = computed(() => data.value?.headers)
    const webResponse = computed(() => data.value?.webResponse)
    const item = computed(() => webResponse.value?.item as T | undefined)

    return {
        alternateLinks,
        webResponse,
        headers,
        item,
        error,
        dataKey,
    }
}
