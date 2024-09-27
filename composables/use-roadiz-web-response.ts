import type { RoadizWebResponse } from '@roadiz/types'
import { joinURL } from 'ufo'
import { getResponseAlternateLinks } from '~/utils/roadiz/get-response-alternate-links'

export async function useRoadizWebResponse<T>(path?: string) {
    path = joinURL('/', path || useRoute().path)

    // Create a unique key for preventing refetching data between server and client.
    const autoKey = `/web_response_by_path--${path}`

    const { data } = await useAsyncData(autoKey, async () => {
        try {
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
        }
        catch (error) {
            // @ts-expect-error cannot know the error type
            return { error: createError(error) }
        }
    })
    const webResponse = data.value?.webResponse

    return {
        alternateLinks: data.value?.alternateLinks || [],
        webResponse,
        headers: data.value?.headers,
        item: webResponse?.item as T | undefined,
        error: data.value?.error,
    }
}
