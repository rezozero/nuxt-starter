import { FacebookMetaOptions, PageMetaPropertyName } from '~/types/meta'

export function createFacebookMeta(params: FacebookMetaOptions): PageMetaPropertyName[] {
    const { title, description, url, image, siteName } = params

    const meta = [
        {
            hid: 'og:title',
            name: 'og:title',
            content: title || '',
        },
        {
            hid: 'og:description',
            name: 'og:description',
            content: description || '',
        },
        {
            hid: 'og:url',
            name: 'og:url',
            content: url || '',
        },
    ]

    if (siteName) {
        meta.push({
            hid: 'og:site_name',
            name: 'og:site_name',
            content: siteName,
        })
    }

    if (image) {
        meta.push({
            hid: 'og:image',
            name: 'og:image',
            content: image,
        })
    }

    return meta
}
