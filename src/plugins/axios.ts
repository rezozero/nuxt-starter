import { Context } from '@nuxt/types'

export default function ({ $roadiz, i18n }: Context) {
    $roadiz?.axios.interceptors.request.use((config) => {
        config.params = config.params || {}

        // always include locale for API requests
        if (!config.params._locale) {
            config.params._locale = i18n.locale
        }

        return config
    })
}
