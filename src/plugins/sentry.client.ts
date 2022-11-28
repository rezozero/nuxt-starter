import Vue from 'vue'
import { Context } from '@nuxt/types'

export default ({ $sentry }: Context) => {
    const vueErrorHandler = Vue.config.errorHandler

    // overrides Vue default handler
    Vue.config.errorHandler = function (error, vm, info) {
        // for early errors (e.g. hydration error), the app is not already initialized (vm is undefined) and the Sentry module
        // won't catch the error because it is lazy loaded and the module waits the app initialisation
        // https://github.com/nuxt-community/sentry-module/blob/main/lib/plugin.lazy.js#L27
        if (!vm && $sentry) $sentry.captureException(error)

        if (vueErrorHandler) {
            return vueErrorHandler(error, vm, info)
        }
    }
}
