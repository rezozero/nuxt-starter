import * as Sentry from '@sentry/node'
import { H3Error } from 'h3'

// @see https://www.lichter.io/articles/nuxt3-sentry-recipe/
export default defineNitroPlugin((nitroApp) => {
    const runtimeConfig = useRuntimeConfig()
    const { sentry, site } = runtimeConfig.public

    if (!sentry?.dsn) {
        return
    }

    // Initialize Sentry
    Sentry.init({
        dsn: sentry?.dsn,
        environment: site?.environment,
    })

    nitroApp.hooks.hook('error', (error) => {
        // Do not handle 404s and 422s
        if (error instanceof H3Error) {
            if (error.statusCode === 404 || error.statusCode === 422) {
                return
            }
        }

        Sentry.captureException(error)
    })

    nitroApp.hooks.hookOnce('close', async () => {
        await Sentry.close(2000)
    })
})
