import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { joinURL } from 'ufo'

export default function ({ $config }: Context, inject: Inject) {
    inject('roadizURL', (path: string) => {
        const endpointPrefixWithLeadingSlash = $config.apiEndpointPrefix && joinURL('/', $config.apiEndpointPrefix)
        const pathWithLeadingSlash = joinURL('/', path)
        const formattedPath =
            endpointPrefixWithLeadingSlash && pathWithLeadingSlash?.startsWith(endpointPrefixWithLeadingSlash)
                ? path.replace(endpointPrefixWithLeadingSlash, '')
                : path

        return joinURL($config.roadiz?.baseURL || '', formattedPath)
    })
}
