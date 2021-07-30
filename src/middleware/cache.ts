import { ServerMiddleware } from '@nuxt/types'

const cacheMiddleware: ServerMiddleware = function (req, res, next) {
    // Adds a minimum 30 seconds for Varnish to cache Nuxt responses.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    next()
}

export default cacheMiddleware
