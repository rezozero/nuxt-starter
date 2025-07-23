import { COMMON_CONTENT_KEY, type CommonContent } from '~/composables/use-common-content'

export async function useCommonContentFetch() {
    return useAsyncData<CommonContent>(COMMON_CONTENT_KEY, () => {
        const fetch = useRoadizFetchFactory()

        return fetch('/common_content')
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key], // no re-fetch data if the key is already in the payload
        dedupe: 'defer', // wait for the first request to finish before making another request
        deep: false, // use shallowRef for optimization
    })
}
