import * as Sentry from '@sentry/nuxt'

const dsn = process.env.NUXT_PUBLIC_SENTRY_DSN
const environment = process.env.NUXT_PUBLIC_SITE_ENV

if (dsn) {
    Sentry.init({
        dsn,
        environment,
    })
}
