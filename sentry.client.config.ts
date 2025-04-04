import * as Sentry from '@sentry/nuxt'

const runtimeConfig = useRuntimeConfig()
const { sentry, site } = runtimeConfig.public

if (sentry.dsn) {
    Sentry.init({
        dsn: sentry.dsn,
        environment: site.environment,
    })
}
