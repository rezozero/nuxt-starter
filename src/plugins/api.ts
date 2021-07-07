import { Inject } from '@nuxt/types/app'
import { Context } from '@nuxt/types'
import RoadizApi from '@roadiz/abstract-api-client'

export default function ({ $config }: Context, inject: Inject) {
    inject('api', new RoadizApi($config.apiUrl, $config.apiKey))
}
