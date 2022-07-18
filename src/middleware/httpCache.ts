import { Context } from '@nuxt/types'

const httpCache =
    (cacheControl: Record<string, number | true> | undefined = undefined) =>
    ({ res, $roadiz }: Context) => {
        if (!process.server) return
        const defaultCacheControl = {
            's-maxage': 30,
            'stale-while-revalidate': true,
        }

        let value = cacheControl || defaultCacheControl

        if ($roadiz.isPreviewing()) {
            value = {
                'no-cache': true,
                'no-store': true,
                'must-revalidate': true,
            }
        }

        const cacheControlValue = Object.entries(value)
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
