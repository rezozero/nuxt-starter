import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { joinURL } from 'ufo'

export default function ({ $config }: Context, inject: Inject) {
    inject('documentURL', (path: string | undefined) => joinURL($config.apiURL, $config.documentPath, path || ''))
}
