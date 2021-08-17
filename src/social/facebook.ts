import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import { $Img } from '@nuxt/image'
import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import getNodesSourcesTitle from '~/utils/roadiz/get-nodes-sources-title'

interface FacebookMeta {
    hid: string
    property: string
    content: string
}

export function createFacebookMeta(page: RoadizNodesSources, $config: NuxtRuntimeConfig, $img: $Img): FacebookMeta[] {
    const meta = [
        {
            hid: 'og:title',
            property: 'og:title',
            content: getNodesSourcesTitle(page) || '',
        },
        {
            hid: 'og:description',
            property: 'og:description',
            content: page.metaDescription || '',
        },
        {
            hid: 'og:url',
            property: 'og:url',
            content: page.url || '',
        },
    ]

    if (page.head) {
        if (page.head.siteName) {
            meta.push({
                hid: 'og:site_name',
                property: 'og:site_name',
                content: page.head.siteName,
            })
        }

        let imageUrl = $config.baseUrl + '/share.jpg'

        if (page.head.shareImage && page.head.shareImage.relativePath) {
            imageUrl = $img(page.head.shareImage.relativePath, {
                fit: '1200x600',
                quality: 80,
            })
        }

        meta.push({
            hid: 'og:image',
            property: 'og:image',
            content: imageUrl,
        })
    }

    return meta
}
