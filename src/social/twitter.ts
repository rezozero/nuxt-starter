import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import { $Img } from '@nuxt/image'
import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { getNodesSourcesTitle } from '~/utils/roadiz'

interface TwitterMeta {
    hid: string
    name: string
    content: string
}

export function createTwitterMeta(page: RoadizNodesSources, $config: NuxtRuntimeConfig, $img: $Img): TwitterMeta[] {
    const meta = [
        {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary',
        },
        {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: getNodesSourcesTitle(page) || '',
        },
        {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: page.metaDescription || '',
        },
        {
            hid: 'twitter:url',
            name: 'twitter:url',
            content: page.url || '',
        },
    ]

    if (page.head) {
        let imageUrl = $config.baseUrl + '/share.jpg'

        if (page.head.shareImage && page.head.shareImage.relativePath) {
            imageUrl = $img(page.head.shareImage.relativePath, {
                width: 1200,
                quality: 70,
            })
        }
        meta.push({
            hid: 'twitter:image',
            name: 'twitter:image',
            content: imageUrl,
        })
    }

    return meta
}
