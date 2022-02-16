import { PageMetaPropertyName, TwitterMetaOptions } from '~/types/meta'

export function createTwitterMeta(params: TwitterMetaOptions): PageMetaPropertyName[] {
    const { title, description, url, image } = params

    const meta = [
        {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary',
        },
        {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: title || '',
        },
        {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: description || '',
        },
        {
            hid: 'twitter:url',
            name: 'twitter:url',
            content: url || '',
        },
    ]

    if (image) {
        meta.push({
            hid: 'twitter:image',
            name: 'twitter:image',
            content: image,
        })
    }

    return meta
}
