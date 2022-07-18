import { Context } from '@nuxt/types'

/**
 * @see https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Cache-Control
 */
export interface HttpCacheControlParams {
    'max-age'?: number | false
    's-maxage'?: number | false
    'max-stale'?: number | false
    'min-fresh'?: number | false
    'no-cache'?: boolean
    'no-store'?: boolean
    'no-transform'?: boolean
    'only-if-cached'?: boolean
    'must-revalidate'?: boolean
    public?: boolean
    private?: boolean
    'proxy-revalidate'?: boolean
    immutable?: boolean
    'stale-if-error'?: number | false
    'stale-while-revalidate'?: number | false
}

const httpCache =
    (cacheControl: HttpCacheControlParams | undefined = undefined) =>
    ({ res, $roadiz }: Context) => {
        if (!process.server) return
        const defaultCacheControl = {
            's-maxage': 30,
            'stale-while-revalidate': 3,
        } as HttpCacheControlParams
        let value: HttpCacheControlParams

        if ($roadiz.isPreviewing()) {
            value = {
                'no-cache': true,
                'no-store': true,
                'must-revalidate': true,
            }
        } else {
            value = { ...defaultCacheControl, ...cacheControl }
        }

        const cacheControlValue = Object.entries(value)
            .filter(([_key, value]) => {
                return value !== false
            })
            .map(([key, value]) => {
                if (value === true) {
                    return `${key}`
                }
                return `${key}=${value}`
            })
            .join(', ') as string

        res.setHeader('Cache-Control', cacheControlValue)
    }

export default httpCache
