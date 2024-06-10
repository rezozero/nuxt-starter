import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export function useRoadizFetchFactory<DefaultR extends NitroFetchRequest = NitroFetchRequest>(
    options?: NitroFetchOptions<DefaultR>,
) {
    return $fetch.create({
        onRequest(context) {
            /*
             * Add preview token to every request if preview mode is enabled.
             */
            const { token, isActive } = useRoadizPreview()

            if (isActive.value && token.value) {
                context.options.query = {
                    ...context.options.query,
                    _preview: '1',
                }

                context.options.headers = {
                    ...context.options.headers,
                    Authorization: `Bearer ${token.value}`,
                }
            }
            /*
             * Add locale to every request if it is not a web response request.
             */
            if (context.request.toString() !== '/web_response_by_path') {
                const { $i18n } = useNuxtApp()

                context.options.query = {
                    ...context.options.query,
                    _locale: $i18n?.locale.value || $i18n?.defaultLocale?.toString(),
                }
            }
        },
        onResponseError(context) {
            throw createError({
                statusCode: context.response.status,
                message: context.response.statusText,
            })
        },
        headers: {
            'accept-encoding': 'gzip, deflate',
            accept: 'application/ld+json',
        },
        baseURL: useApiUrl(),
        ...options,
    })
}
