import { captureError, initSentry } from '~/utils/sentry/client'
import { isIgnoredAppError } from '~/utils/sentry/error-status'

/*
 * Sentry browser SDK, loaded once the app is ready, off the critical path.
 * Inactive while `runtimeConfig.public.sentry.dsn` (NUXT_PUBLIC_SENTRY_DSN) is empty.
 *
 * `@sentry/nuxt` is not initialised by a `sentry.client.config.ts` file: the module would then
 * load the SDK before the app starts. Errors raised before the SDK is ready are queued
 * and reported on load. Server-side Sentry (`sentry.server.config.ts`) is unchanged.
 *
 * A project that needs tracing or Session Replay can bring back a `sentry.client.config.ts`
 * and remove this plugin and the `sentry.bundleSizeOptimizations` of `nuxt.config.ts`.
 */
export default defineNuxtPlugin({
    name: 'sentry',
    enforce: 'pre', // Registered before the other plugins, to report their errors too
    setup(nuxtApp) {
        const { sentry, site } = useRuntimeConfig().public

        if (!sentry?.dsn) return

        // Without `sentry.client.config.ts`, the module no longer hooks the Vue errors: forward them, as unhandled.
        nuxtApp.hook('vue:error', (error, instance, info) => {
            captureError(error, {
                captureContext: { contexts: { nuxt: { info } } },
                mechanism: { handled: false, type: `auto.function.nuxt.${instance ? 'vue' : 'app'}-error` },
            })
        })

        nuxtApp.hook('app:error', (error) => {
            // Redirects and 404 pages are not errors to report
            if (isIgnoredAppError(error)) return

            captureError(error, { mechanism: { handled: false, type: 'auto.function.nuxt.app-error' } })
        })

        // Until the SDK installs its own global handlers
        const onError = (event: ErrorEvent) => captureError(event.error ?? event.message, {
            mechanism: { handled: false, type: 'auto.browser.global_handlers.onerror' },
        })
        const onUnhandledRejection = (event: PromiseRejectionEvent) => captureError(event.reason, {
            mechanism: { handled: false, type: 'auto.browser.global_handlers.onunhandledrejection' },
        })

        window.addEventListener('error', onError)
        window.addEventListener('unhandledrejection', onUnhandledRejection)

        onNuxtReady(() => {
            initSentry({ dsn: sentry.dsn, environment: site.env }).finally(() => {
                window.removeEventListener('error', onError)
                window.removeEventListener('unhandledrejection', onUnhandledRejection)
            })
        })
    },
})
