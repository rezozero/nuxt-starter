import { ServerMiddleware } from '@nuxt/types'
import toBoolean from '../utils/to-boolean'

const cacheMiddleware: ServerMiddleware = function (_req, res, next) {
    const allowClientPreview = toBoolean(process.env.API_ALLOW_CLIENT_PREVIEW)
    const searchParams = new URL(`http://localhost` + _req.url).searchParams

    if (allowClientPreview && searchParams.has('token') && searchParams.get('_preview') === '1') {
        // Do not cache nor store previewed responses
        res.setHeader('Cache-Control', 'no-cache, no-store')
    } else {
        // Adds a minimum 30 seconds for Varnish to cache Nuxt responses.
        res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    }
    next()
}

export default cacheMiddleware
